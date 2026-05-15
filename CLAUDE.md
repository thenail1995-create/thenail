# THE NAIL — Project Context

> Đọc file này TRƯỚC khi sửa code. Nó chứa quyết định + quy ước không có trong code.
> **Chi tiết hiện tại của web → đọc thẳng `index.html`**, đừng duplicate ở đây.

---

## 🏠 Bối cảnh

- **Tên tiệm:** The Nail — **Chủ:** Trần Ngọc (vợ, thợ chính) + Hào (chồng)
- **Địa chỉ:** 521/54 Cách Mạng Tháng 8, P. Hoà Hưng, Q.10, TP.HCM
- **Domain:** [thenail.vn](https://thenail.vn) — DNS qua ZoneDNS, mua tại Nhân Hòa
- **Hosting:** GitHub Pages — repo [thenail1995-create/thenail](https://github.com/thenail1995-create/thenail)
- **Tech:** Static HTML/CSS/JS — 1 file `index.html` duy nhất, không framework

## 🎨 Định hướng thiết kế (KHÔNG đổi trừ khi user yêu cầu rõ)

- **Phong cách:** Dark Luxury — đen sâu + accent emerald + hiệu ứng kim tuyến
- **Tinh thần:** Boutique cao cấp, "ảnh là tác phẩm", tối giản, không hoa lá
- **Tránh:** Emoji trong UI, màu rực, text overlay trên ảnh, framework JS, build step

## 📝 Brand không đổi

- Slogan EN: **your concept, my creation**
- Slogan VI: **Ý tưởng bạn trao — Nghệ thuật tôi tạo**
- Tagline: **Nail Studio by Trần Ngọc**
- 3 giá trị: **Cá nhân hoá · Sáng tạo · Tỉ mỉ**

## 💰 Cấu trúc 5 tier giá

| Tier | Filter ID | Drive folder |
|---|---|---|
| 200—300k | `200-300` | `16ZTxMH0-7EmiZ7tgEGWfhRVizwJOodtL` |
| 300—400k | `300-400` | `1yxzopC7iZX0N1j-UohW-H7iGW9Q2FsPB` |
| 400—500k | `400-500` | `1GDsMSSmfkb8LxrNxUcvTpEPb1giGyI73` |
| 500—700k | `500-700` | `1snLnf4KBGQjAJl4Y7u6yEru2CmIV6q_d` |
| 800k+ | `800-plus` | `14WXwwL3sktdZaR-xAXBHa9ys-LNUjcuI` |

**Gap 700-800k có chủ đích** — tiệm không có dịch vụ ở range này.
**Folders đã share public** — render ảnh qua `https://lh3.googleusercontent.com/d/{ID}=w800`

## 🚫 Đừng tự ý

- Đổi màu, font, slogan, tier giá
- Thêm emoji vào UI / slogan
- Thêm text overlay trên ảnh (user đã yêu cầu xoá hết)
- Convert sang React / framework / build step
- Tách CSS/JS ra file riêng

## ✅ Khi user yêu cầu thay đổi

- Edit `index.html` trực tiếp
- Commit message tiếng Anh, imperative ngắn
- Push → Pages tự rebuild 1-2 phút
- **Update file này CHỈ KHI** quy ước/định hướng thay đổi, KHÔNG cho mỗi commit thường

## 📌 Pending / việc còn lại

- Thay 6 review mẫu bằng review thật từ Google Maps
- Xác nhận số liệu Trust Stats (năm kinh nghiệm, số khách thật)
- FB Page chưa đặt username (URL còn dạng `profile.php?id=...`)
- Email `hello@thenail.vn` chưa setup

## 🗃️ Drive assets quan trọng (read-only access)

- Logo SVG: `1KvwKglwvZtn_q-1KDsnRBbkztWVmWp7R` (đã copy về `images/logo.svg`)
- Design philosophy: `1OW34gEGGuhApzJO5kLnbdjRGu_aK-ZyT` (Velvet Silence)

---

**Lần update gần nhất:** 2026-05-15
