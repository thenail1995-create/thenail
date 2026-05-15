# THE NAIL — Project Context for Claude

> **Quan trọng:** Đọc file này TRƯỚC khi làm bất kỳ thay đổi nào. Nó chứa toàn bộ quyết định thiết kế, quy ước, và lý do đằng sau.

---

## 🏠 Bối cảnh dự án

- **Tên tiệm:** The Nail
- **Chủ:** Anh Nguyên Chí Hào (chồng) + Chị Trần Ngọc (vợ — nghệ nhân nail chính)
- **Địa chỉ:** 521/54 Cách Mạng Tháng 8, P. Hoà Hưng, Q.10, TP.HCM
- **Điện thoại / Zalo:** 0931 415 099
- **Domain:** [thenail.vn](https://thenail.vn) (mua tại Nhân Hòa, DNS qua ZoneDNS)
- **GitHub repo:** [thenail1995-create/thenail](https://github.com/thenail1995-create/thenail)
- **Hosting:** GitHub Pages (miễn phí, HTTPS auto)
- **Account GitHub:** thenail1995-create

## 🎨 Định hướng thiết kế

### Phong cách: **Dark Luxury + Emerald + Kim tuyến**

- **Tone chủ đạo:** Đen sâu (#0a0a0a) với accent xanh emerald
- **Cảm hứng:** "Velvet Silence" design philosophy (file `the_nail_philosophy.md` trên Drive của Hào)
- **Tránh:** Mọi thứ "rẻ tiền", "spammy", màu sắc rực rỡ chói chang
- **Hướng đến:** Boutique cao cấp, tinh tế, kim tuyến nail tự nhiên không phô trương

### Bảng màu chính (KHÔNG đổi trừ khi user yêu cầu rõ)

```css
--bg-primary:    #0a0a0a   /* nền chính */
--bg-secondary:  #0d0d0d   /* nền section nhạt hơn */
--bg-card:       #141414   /* card, modal */
--text-primary:  #e8e6e1   /* chữ chính */
--text-muted:    #a8a59f   /* chữ phụ */
--accent-deep:   #047857   /* emerald đậm — viền, button */
--accent-bright: #10b981   /* emerald sáng — text, hover */
--glitter-light: #6ee7b7   /* tone sáng nhất trong gradient kim tuyến */
--glitter-white: #a7f3d0   /* peak sáng trong gradient (mô phỏng ánh sáng) */
```

### Typography

- **Heading / Slogan:** `Cormorant Garamond` (serif sang, italic cho accent)
- **Body / UI:** `Inter` (sans-serif sạch)
- **Đừng đổi font** trừ khi user yêu cầu

## 📝 Brand assets

### Slogan
- **EN:** *your concept, my creation*
- **VI:** *Ý tưởng bạn trao — Nghệ thuật tôi tạo*

### Tagline
- **Nail Studio by Trần Ngọc**

### Logo
- File: `images/logo.svg` (đã có sẵn)
- Source: Drive file `1KvwKglwvZtn_q-1KDsnRBbkztWVmWp7R`
- **CHƯA dùng trong nav** — vẫn dùng text "THE NAIL". Cân nhắc thêm sau.

### 3 giá trị cốt lõi
1. **Cá nhân hoá** — mỗi khách là duy nhất
2. **Sáng tạo** — không chỉ làm theo mẫu, mà kiến tạo
3. **Tỉ mỉ** — từng đường nét được trau chuốt

→ KHÔNG đổi 3 từ này. Có thể đổi mô tả nhưng giữ 3 keywords.

## 💰 Cấu trúc giá (5 tier)

| Tier | Filter ID | Khoảng giá | Folder Drive |
|---|---|---|---|
| 1 | `200-300` | 200 — 300k | `16ZTxMH0-7EmiZ7tgEGWfhRVizwJOodtL` |
| 2 | `300-400` | 300 — 400k | `1yxzopC7iZX0N1j-UohW-H7iGW9Q2FsPB` |
| 3 | `400-500` | 400 — 500k | `1GDsMSSmfkb8LxrNxUcvTpEPb1giGyI73` |
| 4 | `500-700` | 500 — 700k | `1snLnf4KBGQjAJl4Y7u6yEru2CmIV6q_d` |
| 5 | `800-plus` | 800k+ | `14WXwwL3sktdZaR-xAXBHa9ys-LNUjcuI` |

**Lưu ý:** Có gap 700-800k (không có dịch vụ). KHÔNG tự thêm tier mới.

## 🖼️ Cách hiển thị ảnh nail

### Source ảnh: **Google Drive (folders phải share public)**

- URL format: `https://lh3.googleusercontent.com/d/{FILE_ID}=w800`
- Lightbox dùng `=w1400` (nét hơn khi phóng)
- Drive folders **đã được share "Anyone with link can view"**

### Gallery rules

- **Mỗi tier hiển thị 6 ảnh** (tier 5 hiện 3 vì Drive chỉ có 3)
- **Tổng 27 ảnh** trong gallery
- **KHÔNG hiện giá/tên overlay trên ảnh** (đã xoá theo yêu cầu user)
- Tab tier ở trên đã thể hiện giá → ảnh chỉ là tác phẩm
- Click ảnh → mở lightbox full-screen, chỉ có ảnh + nút X đóng (không text)

### Khi user yêu cầu "thêm ảnh mới"

1. Dùng `search_files` với `parentId = '<folder_id>'` để scan folder
2. Chọn 6 ảnh đẹp nhất (HEIC OK, Drive tự convert qua thumbnail API)
3. Generate URL: `https://lh3.googleusercontent.com/d/{ID}=w800`
4. Update HTML gallery (replace tương ứng tier)
5. Commit + push

### Đặt tên file ảnh trên Drive (gợi ý)

- Format: `[tên_mẫu]_[giá].jpg` — vd `gel_ombre_280.jpg`
- Không bắt buộc, nhưng tiện nếu có

## 🛠️ Cấu trúc kỹ thuật

### **Single-file architecture**

- Web là **1 file HTML duy nhất** (`index.html`)
- CSS inline trong `<style>` tag
- JS inline trong `<script>` tag
- **KHÔNG có build process, KHÔNG framework**
- Edit → save → reload là thấy ngay

### File trong repo

```
/
├── index.html        # toàn bộ web ở đây
├── images/
│   └── logo.svg      # logo by Trần Ngọc (chưa dùng trong UI)
├── CNAME             # thenail.vn (cho GitHub Pages)
├── .gitignore
├── .last-deploy      # touch file để trigger rebuild
└── CLAUDE.md         # file này
```

### Section của index.html (theo thứ tự)

1. Loading splash screen (2.2s animation)
2. Scroll progress bar (top)
3. Nav (logo + 5 links + hamburger mobile)
4. Hero (THE NAIL + slogan + 35 sparkles bay)
5. Trust Stats (4 số đếm: 5 năm / 1000+ / 100+ / 5.0⭐)
6. About — Giá trị (3 cards: Cá nhân hoá / Sáng tạo / Tỉ mỉ)
7. Gallery (27 ảnh, 5 tab filter)
8. Marquee band (chữ chạy ngang)
9. Reviews (6 review CHƯA THẬT — placeholder)
10. Booking form (mở Zalo deep-link)
11. Contact (địa chỉ + Maps + 4 social)
12. Footer
13. Booking modal
14. Floating social stack (Threads / FB / IG)
15. Floating Zalo button (60x60, pulse)
16. Lightbox (chỉ ảnh, không text)

## 🎭 11 hiệu ứng đã implement

1. **Loading splash** — 2.2s, logo THE NAIL lấp lánh kim tuyến
2. **Scroll progress bar** — vạch emerald top, glow
3. **Text reveal letters** — "THE NAIL" trồi từng chữ khi splash mờ
4. **Cursor sparkle trail** — vệt kim tuyến theo chuột (PC only)
5. **Magnetic buttons** — nút CTA hút cursor (PC only)
6. **Hero parallax** — text mờ + di chuyển khi scroll (PC only)
7. **Glow on value cards** — emerald glow lan tỏa khi hover (3 cards giá trị)
8. **Curtain reveal** — ảnh nail "vén rèm" lên khi vào viewport
9. **35 sparkles bay trong hero** (mobile giảm 18)
10. **3D tilt nail cards** — thẻ nghiêng theo cursor (PC only)
11. **Marquee scrolling** — chữ chạy ngang giữa Gallery và Reviews

**Glitter (kim tuyến) animation** áp lên:
- Slogan "your concept, my creation"
- 3 keywords (Cá nhân hoá, Sáng tạo, Tỉ mỉ)
- Số liệu Trust Stats
- "THE NAIL" ở footer

**Mobile:** Auto disable cursor trail, 3D tilt, magnetic, parallax. Sparkles giảm count.

## 📱 Liên hệ + Social (đã setup)

- **Zalo:** [zalo.me/0931415099](https://zalo.me/0931415099)
- **Instagram:** [@thenail.1995](https://www.instagram.com/thenail.1995/)
- **Facebook:** [Page](https://www.facebook.com/profile.php?id=61578662806202) (URL xấu vì chưa đặt username — bảo user đặt)
- **Threads:** [@thenail.1995](https://www.threads.com/@thenail.1995)
- **Google Maps:** Embed iframe theo địa chỉ 521/54 CMT8

**Email:** Chưa có. User muốn `hello@thenail.vn` thì cần setup mail forwarding.

## 🔄 Workflow khi user yêu cầu thay đổi

### Quy ước commit message

- Tiếng Anh ngắn gọn, viết ở mode imperative
- VD: `Add new photos for tier 400-500`, `Fix mobile nav menu z-index`

### Quy trình chuẩn

```bash
cd /Users/nguyenchihao/Desktop/thenail-website
# edit index.html
git add -A
git commit -m "Mô tả thay đổi"
git push
# Pages tự rebuild trong 1-2 phút
```

### Khi user nói các câu thường gặp

| User nói | Bạn làm gì |
|---|---|
| "Thêm ảnh mới" | Scan Drive folder tương ứng, replace 6 ảnh trong gallery, push |
| "Đổi slogan" | Tìm `your concept, my creation` và bản VI, update, push |
| "Đổi giá ảnh X" | Tìm card có `data-name="X"`, update `data-range` và lightbox price |
| "Thay review" | Tìm `.review-card`, replace text + tên + ngày |
| "Đổi địa chỉ" | Update phần Contact section (info-row) + Google Maps embed URL |
| "Đổi giờ mở cửa" | Update `Thứ 2 — Chủ nhật · 9:00 — 22:00` |
| "Update stats" | Update `.stat-item .num data-target` (số đếm animation) |
| "Bỏ hiệu ứng X" | Tìm CSS rule + JS handler tương ứng, comment hoặc xoá |

## ⚠️ Các đã thử nhưng KHÔNG dùng

- **Emerald jewel (#00733C / #00C853):** User muốn thử nhưng đổi lại về cũ
- **Slogan tiếng Anh khác:** User đã chọn "your concept, my creation"
- **Tier "Dưới 200k":** Đã xoá, không có dịch vụ ở range này
- **Price overlay trên ảnh:** Đã xoá hoàn toàn theo yêu cầu user

## 🚨 Lưu ý khi update

### ĐỪNG TỰ ĐỘNG

- ❌ Đừng tự thêm tier mới
- ❌ Đừng tự đổi màu, font
- ❌ Đừng tự đổi slogan
- ❌ Đừng tự thêm/xoá hiệu ứng
- ❌ Đừng dùng emoji trong UI/slogan (user muốn clean luxury)
- ❌ Đừng thêm icon emoji to vào nav/footer
- ❌ Đừng convert sang React/framework

### LUÔN LUÔN

- ✅ Hỏi trước khi xoá thứ user đã quyết
- ✅ Push lên main sau mỗi change
- ✅ Tôn trọng quy ước "ảnh là tác phẩm — không text overlay"
- ✅ Test mobile responsive trước khi push
- ✅ Giữ single-file architecture (không tách CSS/JS file)

## 📊 Trạng thái pending (chưa làm)

- [ ] Thay 6 review giả bằng review thật từ Google Maps
- [ ] Update số liệu Trust Stats cho đúng (5 năm? 1000+ khách? cần xác nhận)
- [ ] Cân nhắc dùng logo SVG trong nav thay vì text
- [ ] User chưa đặt FB Page username → URL còn ID dài
- [ ] Email `hello@thenail.vn` chưa setup

## 🗂️ Tham khảo Drive

User có Google Drive connected với Claude (read-only). Folder/file quan trọng:

- **5 folders ảnh nail** (theo tier giá, đã share public)
- **Logo:** `logo-the-nail-ngoc-tran.svg` (ID: 1KvwKglwvZtn_q-1KDsnRBbkztWVmWp7R)
- **Philosophy:** `the_nail_philosophy.md` (ID: 1OW34gEGGuhApzJO5kLnbdjRGu_aK-ZyT)
- **Business plan:** `the_nail_q3_business_plan.docx`

---

**Last updated:** 2026-05-15
**Maintained by:** Claude + Hào (Trần Ngọc's husband)
