# Technical Architecture

## 🛠️ Stack

- **Frontend:** HTML5 + CSS3 + Vanilla JS (không framework)
- **Build:** Không có. Edit → save → reload.
- **Hosting:** GitHub Pages (miễn phí, HTTPS auto via Let's Encrypt)
- **DNS:** ZoneDNS.vn (tên miền mua tại Nhân Hòa)
- **Domain:** thenail.vn (.vn ccTLD)

## 📂 File structure

```
/
├── index.html        # Toàn bộ web — 1 file duy nhất (HTML + CSS + JS inline)
├── images/
│   └── logo.svg      # Logo by Trần Ngọc (chưa dùng trong UI, dự phòng)
├── CNAME             # thenail.vn (báo GitHub Pages biết custom domain)
├── .gitignore
├── .last-deploy      # touch file để trigger Pages rebuild khi cần
├── README.md         # Cho người xem GitHub
├── CLAUDE.md         # Entry point cho AI
└── docs/             # Tài liệu chi tiết
    ├── brand.md
    ├── design.md
    ├── tech.md (file này)
    ├── conventions.md
    └── state.md
```

## 🏗️ Section trong index.html (theo thứ tự render)

1. Loading splash screen (2.2s)
2. Scroll progress bar
3. Nav (logo text + 5 links + hamburger mobile)
4. Hero (THE NAIL + slogan + 35 sparkles bay)
5. Trust Stats (4 số đếm)
6. About — Giá trị (3 cards: Cá nhân hoá / Sáng tạo / Tỉ mỉ)
7. Gallery (27 ảnh, 5 tab filter)
8. Marquee band (chữ chạy ngang)
9. Reviews (6 review — chưa thật, placeholder)
10. Booking form (mở Zalo deep-link)
11. Contact (địa chỉ + Maps embed + 4 social icons)
12. Footer
13. Booking modal
14. Floating social stack (Threads / FB / IG)
15. Floating Zalo button (60x60, pulse animation)
16. Lightbox (chỉ ảnh, không text)

## 🌍 Hosting & DNS

### GitHub Pages
- Source: `main` branch, folder `/`
- Custom domain: `thenail.vn` (via CNAME file)
- HTTPS: Auto provisioned by GitHub (Let's Encrypt, *.thenail.vn cert)
- Build: Auto trigger khi push lên `main`

### DNS (tại ZoneDNS.vn)
```
@      A     185.199.108.153   (GitHub Pages)
@      A     185.199.109.153
@      A     185.199.110.153
@      A     185.199.111.153
www    CNAME thenail1995-create.github.io.
```

### Authoritative nameservers
- ns1.zonedns.vn
- ns2.zonedns.vn
- ns3.zonedns.vn

## 🖼️ Hệ thống ảnh

- **Source:** Google Drive folders (theo tier giá)
- **Format URL:** `https://lh3.googleusercontent.com/d/{FILE_ID}=w800` cho gallery
- **Lightbox:** Cùng URL nhưng `=w1400`
- **Drive folders đã share public** (anyone with link can view)
- **Drive folder IDs:** xem `state.md`

## 🔄 Deploy workflow

```bash
cd /Users/nguyenchihao/Desktop/thenail-website
# edit index.html (hoặc docs/*.md)
git add -A
git commit -m "Description in English imperative mode"
git push
# GitHub Pages tự rebuild trong ~1-2 phút
# Domain HTTPS sẵn sàng ngay
```

## 🔐 Security

- HTTPS bắt buộc (https_enforced: true)
- Không có user data thu thập (form đặt lịch chỉ mở Zalo, không lưu)
- Không cookie tracking
- Không analytics (chưa setup)

## ⚙️ Browser support

- Modern browsers (Chrome 90+, Safari 14+, Firefox 88+, Edge 90+)
- Mobile: iOS Safari 14+, Chrome Android
- IE: KHÔNG support (đã 2026 rồi)

## 📱 Mobile optimization

- Viewport meta set chuẩn
- Responsive grid với `grid-template-columns` breakpoint
- Hamburger menu khi width ≤ 700px
- Floating buttons co lại trên mobile
- Heavy effects auto disable trên touch device

## 🚀 Performance

- Single HTML file ~70KB
- Inline CSS/JS — không request thêm cho stylesheet
- Google Fonts preconnect
- Lazy load tất cả ảnh
- Image format JPEG (Drive auto convert từ HEIC)
- Marquee chạy CSS animation (GPU accelerated)
