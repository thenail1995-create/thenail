# Conventions — Do's & Don'ts

## ✅ Do's

### Code

- **Edit `index.html` trực tiếp** — single-file architecture, đừng tách
- **Inline CSS/JS** trong `<style>` và `<script>` tags
- **Vanilla JS** thuần, không add framework
- **Comment section rõ ràng:** `/* ===== SECTION NAME ===== */`
- **Mobile-first responsive** — test breakpoint 700px, 600px

### Git

- **Commit message:** tiếng Anh, imperative mode, ngắn gọn
  - Tốt: `Add new photos for tier 400-500`
  - Không: `tôi đã thêm ảnh nail mới vào folder 400-500`
- **Commit ngay sau mỗi thay đổi** logic, đừng gom nhiều thay đổi
- **Push lên main** sau commit — Pages tự rebuild

### UX

- **Test sau mỗi push** — mở thenail.vn xem có lỗi không
- **Hard reload** (Cmd+Shift+R) nếu thấy CSS không update
- **Test mobile** trước khi push (DevTools device mode)

### Hỏi user khi không chắc

- Đổi màu, font, slogan, tier giá
- Thêm section mới hoặc xoá section cũ
- Đổi cấu trúc thư mục
- Convert sang stack khác

## 🚫 Don'ts (tuyệt đối tránh)

### Design

- ❌ Thêm emoji vào UI / slogan / nav / footer
- ❌ Thêm text overlay lên ảnh nail (đã xoá theo yêu cầu user)
- ❌ Đổi tone màu chính (giữ Dark Luxury Emerald)
- ❌ Đổi font (Cormorant Garamond + Inter)
- ❌ Thêm icon to/giật gân
- ❌ Thêm khuyến mãi giật gân kiểu "GIẢM GIÁ -50%"

### Tech

- ❌ Tách CSS/JS ra file riêng (giữ single-file)
- ❌ Add npm/yarn/build step
- ❌ Convert sang React/Vue/framework
- ❌ Add analytics tracking khi chưa hỏi user
- ❌ Add cookie/popup
- ❌ Thêm dependency external (CDN) không cần thiết

### Content

- ❌ Tự đổi địa chỉ, SĐT, giờ mở cửa
- ❌ Tự đổi slogan
- ❌ Tự thêm/xoá tier giá
- ❌ Tự thay review (user phải provide review thật)
- ❌ Tự sinh review giả thêm

### Workflow

- ❌ Update CLAUDE.md / docs cho mỗi commit nhỏ
- ❌ Sửa file mà không commit
- ❌ Force push lên main
- ❌ Tạo branch khác (single main branch project)

## 📝 Cập nhật docs

Chỉ cập nhật `docs/*.md` khi:

- ✅ **Quy ước mới** (vd: "từ giờ luôn watermark ảnh")
- ✅ **Định hướng thay đổi** (vd: rebrand)
- ✅ **Asset mới quan trọng** (vd: thêm Drive folder mới)
- ✅ **Bài học từ thử nghiệm** (vd: thử màu X user không thích)

KHÔNG cập nhật cho:

- ❌ Thêm/đổi ảnh hàng ngày
- ❌ Đổi giá ảnh
- ❌ Sửa typo
- ❌ Fix bug nhỏ
- ❌ Tinh chỉnh CSS/JS thông thường

## 🎯 Pattern: User nói → Bạn làm gì

| User nói | Action chuẩn |
|---|---|
| "Thêm ảnh tier X" | Scan Drive folder X, replace cards, push |
| "Đổi slogan" | Update HTML + `docs/brand.md`, push |
| "Đổi giá ảnh Y" | Update `data-range` + lightbox price, push |
| "Thay review" | Replace `.review-card` elements, push |
| "Đổi địa chỉ/SĐT/giờ" | Update Contact section + Hero meta, push |
| "Update stats" | Update `data-target` trong stats section |
| "Thêm hiệu ứng" | Add CSS animation + JS handler, update `docs/design.md` nếu là effect lớn |
| "Bỏ hiệu ứng" | Comment/xoá CSS + JS, update `docs/design.md` |
| "Đổi cách hoạt động X" | Hỏi rõ trước khi làm, có thể update `docs/conventions.md` |
