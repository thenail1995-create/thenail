# Design System

## 🎨 Triết lý thiết kế

**Dark Luxury + Emerald + Kim tuyến**

Cảm hứng từ "Velvet Silence" — design philosophy của user
(Drive file `1OW34gEGGuhApzJO5kLnbdjRGu_aK-ZyT`):

> *"Luxury does not announce itself, but is felt in the quality of every
> negative space, every precise curve, every deliberate absence of decoration."*

Đặc trưng:
- Negative space rộng rãi
- Chuyển động chậm rãi, tinh tế
- Kim tuyến mô phỏng ánh sáng phản chiếu trên nail thật
- "Ảnh là tác phẩm" — không text overlay che ảnh

## 🌈 Bảng màu (KHÔNG đổi trừ khi user yêu cầu rõ)

```css
/* Nền */
#0a0a0a    /* nền chính */
#0d0d0d    /* nền section nhạt hơn */
#141414    /* card, modal */

/* Text */
#e8e6e1    /* chữ chính */
#a8a59f    /* chữ phụ, muted */
#8a8780    /* chữ rất phụ, label */

/* Accent — Emerald */
#047857    /* emerald đậm — viền, button solid */
#10b981    /* emerald sáng — text, icon, hover */

/* Glitter gradient — kim tuyến */
#6ee7b7    /* sáng */
#a7f3d0    /* trắng ngọc — peak */
```

## 🅰️ Typography

| Vai trò | Font | Sử dụng |
|---|---|---|
| Heading, slogan, decorative | `Cormorant Garamond` (serif) | Tiêu đề, slogan, italic |
| Body, UI, button | `Inter` (sans-serif) | Đa số UI |

Load từ Google Fonts — đừng đổi.

## ✨ 11 hiệu ứng đã implement

1. **Loading splash** — 2.2s, logo THE NAIL lấp lánh kim tuyến
2. **Scroll progress bar** — vạch emerald top, có glow
3. **Text reveal letters** — "THE NAIL" trồi từng chữ khi splash mờ
4. **Cursor sparkle trail** — vệt kim tuyến theo chuột (PC only)
5. **Magnetic buttons** — nút CTA hút cursor (PC only)
6. **Hero parallax** — text mờ + di chuyển khi scroll (PC only)
7. **Glow on value cards** — emerald glow lan tỏa khi hover
8. **Curtain reveal** — ảnh nail "vén rèm" lên khi vào viewport
9. **35 sparkles bay** trong hero (mobile giảm 18)
10. **3D tilt nail cards** — thẻ nghiêng theo cursor (PC only)
11. **Marquee scrolling** — chữ chạy ngang giữa Gallery và Reviews

**Glitter animation** áp lên: slogan EN, 3 keywords giá trị, số Trust Stats, "THE NAIL" footer.

**Mobile:** Auto disable cursor trail, 3D tilt, magnetic, parallax. Sparkles count giảm.

## 🚫 Anti-patterns (đã thử nhưng bỏ)

- **Màu jade #00733C/#00C853** — user thử nhưng không thích, quay lại emerald gốc
- **Tier "Dưới 200k"** — đã xoá vì tiệm không có dịch vụ ở range này
- **Price overlay trên ảnh** — đã xoá hoàn toàn theo yêu cầu user
- **Hover text overlay** — cũng đã xoá, ảnh tuyệt đối sạch
- **Emoji trong UI** — không dùng, đi ngược tinh thần luxury

## 🖼️ Quy ước hiển thị ảnh

- **Aspect ratio:** 1:1 (vuông) trong gallery
- **Object-fit:** cover (cắt sát)
- **Loading:** lazy
- **Lightbox:** chỉ ảnh + nút X, không text, dùng URL `=w1400` (sắc nét)
- **KHÔNG** overlay text/giá trên ảnh
- **Tab tier ở trên đã thể hiện giá** → ảnh không cần lặp lại

## 📐 Layout

- **Container:** `max-width: 1200px` cho desktop
- **Padding:** 24px container, 80px section
- **Gallery grid:** Desktop 4 cột → Tablet 3 → Mobile 2
- **Reviews grid:** Desktop 3 → Tablet 2 → Mobile 1
- **Stats grid:** Desktop 4 → Mobile 2
