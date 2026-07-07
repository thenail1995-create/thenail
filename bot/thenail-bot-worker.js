/**
 * THE NAIL — AI booking assistant (Cloudflare Worker)
 * --------------------------------------------------
 * Proxy an toàn giữa website tĩnh và Claude API.
 * - Giữ ANTHROPIC_API_KEY trong secret của Cloudflare (KHÔNG để lộ ra web).
 * - Nạp sẵn menu + thông tin tiệm vào system prompt → bot trả lời đúng giá thật.
 * - Khi gom đủ thông tin đặt lịch, bot xuất 1 dòng máy đọc:  [[BOOKING]]{...json...}
 *   → website bắt dòng này để hiện nút "Gửi qua Zalo".
 * - MỚI (2026-07-06): bắt [[BOOKING]] và SĐT khách nhắn → báo ngay về Telegram anh Hào
 *   + lưu vào KV (binding LEADS) → Hermes đọc qua GET /leads cho morning digest.
 *   Secrets thêm: TELEGRAM_BOT_TOKEN, LEADS_READ_KEY.
 *
 * Deploy: xem bot/README-chatbot.md
 * Model:  claude-haiku-4-5-20251001 (rẻ, nhanh, tiếng Việt tốt). Đổi MODEL nếu muốn Sonnet.
 */

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 800;

// QUAN TRỌNG: gọi Anthropic QUA Cloudflare AI Gateway (gateway tên "thenail").
// Lý do: gọi thẳng api.anthropic.com từ Cloudflare Worker bị Anthropic chặn IP → 403 "Request not allowed"
// (đã test: key gọi trực tiếp từ máy = 200 OK, nhưng qua Worker = 403). AI Gateway vượt được chặn này.
const ANTHROPIC_URL = 'https://gateway.ai.cloudflare.com/v1/fd74ef0b23a00e15846a9bea345f5037/thenail/anthropic/v1/messages';

// Telegram chat nhận thông báo lead/booking (trùng home chat của Hermes)
const TELEGRAM_CHAT_ID = '6161456868';

// Ảnh khách gửi (báo giá): chỉ nhận các định dạng này, base64 tối đa ~5MB
const ALLOWED_MEDIA = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMG_B64 = 5 * 1024 * 1024;

// Lọc & làm sạch nội dung 1 tin nhắn: cho phép chuỗi chữ HOẶC mảng block (text + image).
// Chỉ cho phép block image trong tin của 'user' (yêu cầu của Anthropic API).
function sanitizeContent(content, role) {
  if (typeof content === 'string') {
    const t = content.slice(0, 2000);
    return t.length ? t : null;
  }
  if (Array.isArray(content)) {
    const blocks = [];
    for (const b of content) {
      if (!b || typeof b !== 'object') continue;
      if (b.type === 'text' && typeof b.text === 'string' && b.text.length) {
        blocks.push({ type: 'text', text: b.text.slice(0, 2000) });
      } else if (
        role === 'user' && b.type === 'image' && b.source && b.source.type === 'base64' &&
        ALLOWED_MEDIA.includes(b.source.media_type) &&
        typeof b.source.data === 'string' && b.source.data.length <= MAX_IMG_B64
      ) {
        blocks.push({ type: 'image', source: { type: 'base64', media_type: b.source.media_type, data: b.source.data } });
      }
    }
    return blocks.length ? blocks : null;
  }
  return null;
}

// Chỉ cho phép các origin này gọi Worker (chống lạm dụng). Thêm domain khi cần.
const ALLOWED_ORIGINS = [
  'https://thenail.vn',
  'https://www.thenail.vn',
  'http://localhost:5858',
  'http://127.0.0.1:5858',
];

const SYSTEM_PROMPT = `Bạn là trợ lý đặt lịch của tiệm nail **THE NAIL** (Quận 10, TP.HCM). Chủ tiệm là chị Trần Ngọc.

# Phong cách
- Mặc định trả lời TIẾNG VIỆT, thân thiện, ngắn gọn, ấm áp như nhân viên tiệm nail. Tự chuyển sang tiếng Anh nếu khách nhắn tiếng Anh.
- Trả lời 2–4 câu, không dài dòng. Dùng emoji rất tiết chế (tối đa 1).
- Xưng "tiệm" / "The Nail", gọi khách là "bạn" / "chị".

# Thông tin tiệm (dùng để trả lời)
- Địa chỉ: 517/15 Nguyễn Tri Phương, P. Diên Hồng, Quận 10, TP.HCM.
- Điện thoại / Zalo: 0931 415 099.
- Giờ mở cửa: 9:00–22:00, tất cả các ngày trong tuần.
- Instagram: @thenail.1995 · Facebook: The Nail - Nail & Beauty - Q10.
- Slogan: "Ý tưởng bạn trao — Nghệ thuật tôi tạo".

# MENU & GIÁ (đơn vị = NGHÌN ĐỒNG, ví dụ 70 = 70.000đ). KHÔNG bịa giá ngoài bảng này.
## Nail Care
- Sạch da: 30 | Phá gel: 30 | Phá móng úp/đắp: 50 | Cứng móng tạo cầu: 40–60
- Úp móng gel: 100 | Refill móng úp: 70 | Nối móng đắp gel: 200 | Refill móng gel: 140 | Đắp gel móng thật: 150
## Design (sơn & vẽ)
- Sơn gel: 70 | Sơn thạch/nhũ: 90 | Sơn mắt mèo/chrome: 150 | French/ombre: 10–20
- Vẽ loang/vân đá: 10–30 | Vẽ gel trong suốt: 10–30 | Vẽ gel tráng gương: 20–50 | Vẽ design: 20–50
- Charm: 5–50 | Đính đá: 5–50 | Dán sticker: 5–20
Lưu ý khi báo giá: nói rõ "k" hoặc "nghìn", và nhắc giá cuối tuỳ mẫu/độ dài/độ khó; mẫu nghệ thuật cao cấp có thể 600k–1.5tr, nhắn Zalo để báo chính xác.

# Nhiệm vụ
1) Tư vấn dịch vụ, báo giá theo menu, gợi ý mẫu phù hợp.
2) Hỗ trợ ĐẶT LỊCH. Khi khách muốn đặt, hỏi cho ĐỦ (mỗi lần hỏi 1–2 mục, đừng hỏi dồn):
   - Tên
   - Số điện thoại
   - Ngày hẹn
   - Giờ hẹn (trong khung 9:00–22:00)
   - Dịch vụ mong muốn
3) Khi đã đủ 5 mục trên, tóm tắt lại cho khách xác nhận, RỒI ở CUỐI tin nhắn thêm đúng 1 dòng máy đọc (khách sẽ không thấy dòng này, web tự xử lý):
[[BOOKING]]{"name":"...","phone":"...","date":"...","time":"...","service":"..."}
   Chỉ xuất dòng [[BOOKING]] khi đã có ĐỦ cả 5 mục.

# Khi khách GỬI ẢNH mẫu nail (để hỏi giá)
- Xem ảnh và mô tả ngắn mẫu: kiểu dáng (móng dài/ngắn, vuông/almond...), kỹ thuật nhìn thấy (sơn gel, mắt mèo/chrome, vẽ tay, úp/nối/đắp gel, đính đá, charm, tráng gương...).
- ƯỚC LƯỢNG một KHOẢNG giá bằng cách cộng các hạng mục liên quan trong MENU (vd: nối móng đắp gel 200 + vẽ design 20–50 + đính đá 5–50 → khoảng 230–300k). KHÔNG đưa con số cứng.
- LUÔN nói rõ đây là giá ƯỚC LƯỢNG; giá chính xác còn tuỳ độ dài/độ khó và sẽ được chị Ngọc báo qua Zalo 0931 415 099. Mời khách gửi lại ảnh qua Zalo để chốt giá.
- Mẫu nghệ thuật cầu kỳ có thể 600k–1.5tr — cứ nói thẳng khoảng đó nếu mẫu phức tạp.
- Nếu ảnh KHÔNG phải mẫu nail, lịch sự nói tiệm chỉ tư vấn mẫu nail và mời khách hỏi tiếp.

# Giới hạn
- Bạn KHÔNG tự xác nhận đã đặt thành công. Hãy nói: thông tin sẽ được gửi cho tiệm qua Zalo để xác nhận giờ.
- Không hứa khuyến mãi, không bịa thông tin ngoài những gì nêu trên. Nếu không chắc, mời khách nhắn Zalo 0931 415 099.`;

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

// Lấy phần chữ trong tin nhắn cuối của khách (bỏ qua block ảnh)
function lastUserText(messages) {
  const m = messages[messages.length - 1];
  if (!m || m.role !== 'user') return '';
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) {
    return m.content.filter((b) => b.type === 'text').map((b) => b.text).join(' ');
  }
  return '';
}

// Báo về Telegram anh Hào. Nuốt lỗi — không được ảnh hưởng phản hồi cho khách.
async function notifyTelegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
    });
  } catch {}
}

// Lưu lead vào KV (giữ 90 ngày) để Hermes đọc qua GET /leads
async function saveLead(env, lead) {
  if (!env.LEADS) return;
  try {
    const at = new Date().toISOString();
    const key = `lead:${at}:${Math.random().toString(36).slice(2, 8)}`;
    await env.LEADS.put(key, JSON.stringify({ at, ...lead }), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch {}
}

// Bắt booking ([[BOOKING]] trong trả lời của bot) hoặc SĐT khách để lại → Telegram + KV
async function captureLead(env, reply, messages) {
  try {
    const bk = reply.match(/\[\[BOOKING\]\]\s*(\{[\s\S]*?\})/);
    if (bk) {
      let info = null;
      try { info = JSON.parse(bk[1]); } catch {}
      if (info) {
        const text = [
          '🔔 BOOKING MỚI từ web thenail.vn',
          `Tên: ${info.name || '?'}`,
          `SĐT: ${info.phone || '?'}`,
          `Ngày: ${info.date || '?'} · Giờ: ${info.time || '?'}`,
          `Dịch vụ: ${info.service || '?'}`,
          '→ Nhắn khách qua Zalo để xác nhận lịch.',
        ].join('\n');
        await Promise.all([notifyTelegram(env, text), saveLead(env, { type: 'booking', ...info })]);
        return;
      }
    }
    // Chưa thành booking nhưng khách để lại SĐT trong tin nhắn cuối → vẫn là lead đáng báo
    const t = lastUserText(messages);
    const phone = (t.match(/(?:\+84|0)\d[\d .\-]{7,12}\d/) || [])[0];
    if (phone) {
      const text = `📞 LEAD từ web thenail.vn — khách để lại SĐT: ${phone}\nTin nhắn: "${t.slice(0, 300)}"`;
      await Promise.all([notifyTelegram(env, text), saveLead(env, { type: 'phone', phone, message: t.slice(0, 300) })]);
    }
  } catch {}
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Hermes đọc leads cho morning digest: GET /leads?since=<ISO> + header x-leads-key
    if (request.method === 'GET' && url.pathname === '/leads') {
      if (!env.LEADS_READ_KEY || request.headers.get('x-leads-key') !== env.LEADS_READ_KEY) {
        return json({ error: 'Unauthorized' }, 401, origin);
      }
      if (!env.LEADS) return json({ leads: [] }, 200, origin);
      const since = url.searchParams.get('since') || '';
      const list = await env.LEADS.list({ prefix: 'lead:', limit: 1000 });
      const names = list.keys
        .map((k) => k.name)
        .filter((n) => !since || n.slice(5) >= since)
        .slice(-100); // tối đa 100 lead gần nhất
      const leads = [];
      for (const name of names) {
        const v = await env.LEADS.get(name);
        if (v) { try { leads.push(JSON.parse(v)); } catch {} }
      }
      return json({ leads }, 200, origin);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Server chưa cấu hình API key' }, 500, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Body không hợp lệ' }, 400, origin);
    }

    // Nhận lịch sử hội thoại: [{role:'user'|'assistant', content:'...'}]
    const history = Array.isArray(payload.messages) ? payload.messages : [];
    const messages = history
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .slice(-20) // giới hạn để tiết kiệm token
      .map((m) => ({ role: m.role, content: sanitizeContent(m.content, m.role) }))
      .filter((m) => m.content !== null);

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return json({ error: 'Thiếu tin nhắn của khách' }, 400, origin);
    }

    try {
      const resp = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!resp.ok) {
        const detail = await resp.text();
        return json({ error: 'Lỗi từ AI', detail: detail.slice(0, 300) }, 502, origin);
      }

      const data = await resp.json();
      const reply = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
        .trim();

      // Bắt booking/lead và báo Telegram + lưu KV — chạy nền, không chặn phản hồi cho khách
      ctx.waitUntil(captureLead(env, reply, messages));

      return json({ reply }, 200, origin);
    } catch (err) {
      return json({ error: 'Không gọi được AI', detail: String(err).slice(0, 200) }, 502, origin);
    }
  },
};
