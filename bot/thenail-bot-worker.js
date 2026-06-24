/**
 * THE NAIL — AI booking assistant (Cloudflare Worker)
 * --------------------------------------------------
 * Proxy an toàn giữa website tĩnh và Claude API.
 * - Giữ ANTHROPIC_API_KEY trong secret của Cloudflare (KHÔNG để lộ ra web).
 * - Nạp sẵn menu + thông tin tiệm vào system prompt → bot trả lời đúng giá thật.
 * - Khi gom đủ thông tin đặt lịch, bot xuất 1 dòng máy đọc:  [[BOOKING]]{...json...}
 *   → website bắt dòng này để hiện nút "Gửi qua Zalo".
 *
 * Deploy: xem bot/README-chatbot.md
 * Model:  claude-haiku-4-5-20251001 (rẻ, nhanh, tiếng Việt tốt). Đổi MODEL nếu muốn Sonnet.
 */

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 700;

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

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
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
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20) // giới hạn để tiết kiệm token
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return json({ error: 'Thiếu tin nhắn của khách' }, 400, origin);
    }

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
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

      return json({ reply }, 200, origin);
    } catch (err) {
      return json({ error: 'Không gọi được AI', detail: String(err).slice(0, 200) }, 502, origin);
    }
  },
};
