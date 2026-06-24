# Trợ lý AI The Nail — Hướng dẫn gắn (cho anh Hào)

Bot AI trả lời khách + gom thông tin đặt lịch → đẩy về Zalo.
Kiến trúc: **Web (widget) → Cloudflare Worker (giữ API key) → Claude API**.
Chi phí: Cloudflare Worker **miễn phí** (100k lượt/ngày) · Claude API **trả theo dùng**, tiệm nhỏ ~vài chục–vài trăm k/tháng (model Haiku rất rẻ).

> Khi **chưa** làm các bước dưới, widget vẫn hiện và chạy **chế độ DEMO** (trả lời theo từ khoá). Làm xong các bước → bot thông minh thật.

---

## Bước 1 — Lấy API key Anthropic (Claude)
1. Vào https://console.anthropic.com → đăng nhập (tạo tài khoản nếu chưa có).
2. **Billing** → nạp một ít tiền (vd 5 USD) để bật API.
3. **API Keys** → *Create Key* → copy chuỗi `sk-ant-...` (lưu kỹ, chỉ hiện 1 lần).

## Bước 2 — Tạo Cloudflare Worker
1. Vào https://dash.cloudflare.com → đăng nhập (tài khoản free).
2. **Workers & Pages** → *Create application* → *Create Worker* → đặt tên vd `thenail-bot` → *Deploy*.
3. Bấm *Edit code*, **xoá hết** code mẫu, dán **toàn bộ** nội dung file [`thenail-bot-worker.js`](./thenail-bot-worker.js) vào → *Deploy*.
4. Copy URL Worker (dạng `https://thenail-bot.<tên>.workers.dev`).

## Bước 3 — Gắn API key vào Worker (bí mật, KHÔNG để trong web)
Trong trang Worker vừa tạo:
- **Settings → Variables and Secrets → Add** →
  - Type: **Secret**
  - Name: `ANTHROPIC_API_KEY`
  - Value: dán chuỗi `sk-ant-...` ở Bước 1 → *Save / Deploy*.

## Bước 4 — Nối web với Worker
Mở `parallax-B-stack.html`, tìm dòng:
```js
endpoint: '',   // ← DÁN URL Cloudflare Worker vào đây
```
Sửa thành (dán URL ở Bước 2):
```js
endpoint: 'https://thenail-bot.<tên>.workers.dev',
```
Lưu lại → mở web → chat thử. Giờ bot trả lời bằng **Claude thật**, biết menu + giá của tiệm.

> Báo Claude (trong Claude Code) câu: *"gắn endpoint Worker vào widget AI"* kèm URL — mình sửa giúp 1 nốt.

---

## Tuỳ chỉnh thường gặp
- **Đổi model thông minh hơn:** trong `thenail-bot-worker.js`, đổi `MODEL` từ `claude-haiku-4-5-20251001` → `claude-sonnet-4-6` (trả lời "đỉnh" hơn, đắt hơn chút).
- **Cập nhật giá/dịch vụ:** sửa phần `# MENU & GIÁ` trong `SYSTEM_PROMPT` của Worker (giữ khớp với mục Menu trên web).
- **Thêm domain được phép gọi:** sửa mảng `ALLOWED_ORIGINS` trong Worker.
- **Đặt lịch về đâu:** hiện bot gom đủ thông tin rồi hiện nút **"Gửi qua Zalo"** (copy sẵn tin → mở Zalo 0931 415 099). Muốn đẩy thêm về Google Sheet / Telegram / email → báo Claude làm tiếp.

## Phase 2 (sau này) — trả lời thẳng trên Zalo / Messenger
Widget này chỉ trả lời khách **trên website**. Muốn bot tự rep khách nhắn thẳng vào **Zalo / Facebook / Instagram**:
- Cần **Zalo OA (Official Account) + duyệt Open API** cho Zalo, và **Facebook Page + Meta app** cho Messenger/IG.
- Worker này tái dùng được (cùng "bộ não"), chỉ thêm phần nhận webhook từ từng kênh. Báo Claude khi muốn làm.
