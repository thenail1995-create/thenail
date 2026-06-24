# THE NAIL — MASTER CONTINUITY DOC 🌿

> **Đọc file này TRƯỚC TIÊN.** Đây là bản đồ tổng cho mọi việc liên quan tới The Nail.
> File nằm trong GitHub repo nên **độc lập với tài khoản Claude** — lỡ Claude bị ban tài khoản,
> Claude/người mới chỉ cần clone repo + đọc file này là biết toàn bộ và tiếp tục được, không gián đoạn.
> Cập nhật lần cuối: **2026-06-24** (đã deploy web variant B + chatbot AI live).

---

## 1. The Nail là gì
- Tiệm nail của **chị Trần Ngọc** (chủ), chồng là **anh Hào** (người làm việc với Claude — thích tiếng Việt, làm liên tục không dừng chờ, để ý chi tiết, sau mỗi lần xong mở Chrome thật xem).
- Địa chỉ: **517/15 Nguyễn Tri Phương, P. Diên Hồng, Quận 10, TP.HCM**.
- Điện thoại / Zalo: **0931 415 099**. Slogan: *"Ý tưởng bạn trao — Nghệ thuật tôi tạo" / "your concept, my creation"*.
- Website: **https://thenail.vn**

## 2. Tài sản & tài khoản (QUAN TRỌNG — để khôi phục)
| Hạng mục | Chi tiết |
|---|---|
| **Thư mục code (máy local)** | `~/Desktop/thenail-website` (macOS của anh Hào) |
| **GitHub repo** | `github.com/thenail1995-create/thenail` · branch `main` · `gh` đã auth acc **thenail1995-create** |
| **Hosting web** | GitHub Pages + file `CNAME` = thenail.vn → trỏ domain **thenail.vn** |
| **Cloudflare (chatbot)** | acc **Psnhaotur1@gmail.com**, account id `fd74ef0b23a00e15846a9bea345f5037` · `wrangler` đã login trên máy |
| **Worker chatbot** | **https://thenail-bot.psnhaotur1.workers.dev** (tên `thenail-bot`) · secret `ANTHROPIC_API_KEY` đã set trên Cloudflare |
| **Anthropic API** | tài khoản Individual (console.anthropic.com), model **Claude Haiku** (`claude-haiku-4-5-20251001`) |
| **Mạng xã hội** | IG `@thenail.1995` · FB "The Nail - Nail & Beauty - Q10" (id 61578662806202) · Threads `@thenail.1995` |
| **Google Drive** | acc thenail1995@gmail.com — chứa ảnh nail, logo, và ảnh **PRICE list** (id `1XITjgqECvCN_nyrJ0BUa5Ocl_rhG7mo5`) |

## 3. Trạng thái hiện tại (2026-06-24)
- **Web LIVE = variant B** (file `index.html` = copy của `parallax-B-stack.html`):
  - Desktop **sticky-stack** (Hero → Giới thiệu → Bộ sưu tập → **Menu** → Đặt lịch → Liên hệ, các section trượt đè nhau).
  - Mobile **card-stack + reveal + marquee + bottom action bar** (Menu · Mẫu · Liên hệ).
  - **Song ngữ VI/EN** (nút góc phải nav, nhớ localStorage `tn-lang`).
  - Tông kem/rêu/terracotta theo logo. Google Maps thật. SEO JSON-LD + OG.
- **Mục Menu = giá THẬT** từ PRICE list (đơn vị nghìn đ):
  - *Nail Care:* Sạch da 30 · Phá gel 30 · Phá móng úp/đắp 50 · Cứng móng tạo cầu 40–60 · Úp móng gel 100 · Refill móng úp 70 · Nối móng đắp gel 200 · Refill móng gel 140 · Đắp gel móng thật 150.
  - *Design:* Sơn gel 70 · Sơn thạch/nhũ 90 · Mắt mèo/chrome 150 · French/ombre 10–20 · Vẽ loang/vân đá 10–30 · Vẽ gel trong suốt 10–30 · Vẽ gel tráng gương 20–50 · Vẽ design 20–50 · Charm 5–50 · Đính đá 5–50 · Dán sticker 5–20.
- **Chatbot AI LIVE:** widget nút "Trợ lý AI" góc dưới-trái → Cloudflare Worker → Claude Haiku. Trả lời tiếng Việt theo menu, gom thông tin đặt lịch → nút "Gửi qua Zalo". Đã test OK.

## 4. Cách tiếp tục / các việc thường gặp
- **Chạy web local:** `cd ~/Desktop/thenail-website && python3 -m http.server 5858 --bind 127.0.0.1` → mở `http://localhost:5858/index.html`. (Verify dùng skill **browser-act** / Chrome thật, browser id `chrome_local_98081020414263465` — Claude Preview MCP máy này lỗi.)
- **Sửa web → deploy lại:** sửa `parallax-B-stack.html` (file nguồn) → `cp parallax-B-stack.html index.html` → `git add index.html parallax-B-stack.html && git commit -m "..." && git push`. GitHub Pages build ~1–2 phút.
- **Sửa "não" chatbot (giá/câu trả lời/đổi model):** sửa `SYSTEM_PROMPT` (hoặc `MODEL`) trong `bot/thenail-bot-worker.js` → deploy lại:
  `cd ~/Desktop/thenail-website && npx wrangler deploy bot/thenail-bot-worker.js --name thenail-bot --compatibility-date 2025-01-01`
  (Giữ giá trong SYSTEM_PROMPT KHỚP với mục Menu trên web.)
- **Đổi endpoint chatbot trên web:** biến `AI_CFG.endpoint` cuối `parallax-B-stack.html` (đang = URL Worker; để trống = chế độ DEMO).

## 5. Gotcha đã học (đừng vấp lại)
- CSS bản B đặt TRƯỚC rule desktop → cần `!important`. Bẫy specificity: `section:not(#hero)` tính như có id → panel chatbot phải là `<div>` (không `<section>`) mới giữ `position:fixed`; `.mbar` phải `<div>` (không `<nav>`).
- Mobile: nội dung cao hơn màn hình → KHÔNG ghim sticky → dùng card-stack + reveal.
- Ảnh Google Drive qua CSS `background-image` cần `<meta name="referrer" content="no-referrer">` (thẻ `<img>` thì `referrerpolicy="no-referrer"`).
- Editor code trên Cloudflare dashboard là **iframe khác origin** → KHÔNG paste code qua phím được → deploy Worker bằng **wrangler** (CLI).
- KHÔNG commit `.wrangler/`, `.claude/`, ảnh `_verify-*.png` (đã cho vào `.gitignore`).
- Worker chỉ nhận origin trong `ALLOWED_ORIGINS` (đã có thenail.vn + localhost:5858).

## 6. Hồ sơ chi tiết khác trong repo
- `SESSION-HANDOFF-variantB.md` — bàn giao kỹ thuật chi tiết variant B + chatbot.
- `bot/thenail-bot-worker.js` — code Worker (não chatbot, nạp sẵn menu + info tiệm). **Không chứa API key** (key là secret trên Cloudflare).
- `bot/README-chatbot.md` — hướng dẫn deploy chatbot từ đầu.
- `CLAUDE.md`, `docs/` — tài liệu thiết kế/quy ước (có thể cũ hơn file này; ưu tiên MASTER này).

## 7. Việc còn lại / ý tưởng tương lai
- **Phase 2 chatbot:** nối trả lời thẳng trên **Zalo OA + Facebook Messenger/Instagram** (cần Zalo OA + duyệt Open API; Worker này tái dùng được làm "não").
- Cân nhắc đẩy thông tin đặt lịch về Google Sheet / Telegram / email thay vì chỉ Zalo.
- Theo dõi chi phí API ở console.anthropic.com → Usage (Haiku rất rẻ, ~vài chục–trăm k/tháng cho 1 tiệm).

---
*Ghi chú cho Claude tương lai: anh Hào từng bị ban tài khoản 1 lần (2026-06-08, data local còn nguyên, bản đồ ở `~/RECOVERY-MAP.md`). File MASTER này + repo GitHub là cách backup chống-gián-đoạn. Khi tiếp tục, đọc file này + `SESSION-HANDOFF-variantB.md`, rồi hỏi anh đang muốn làm gì.*
