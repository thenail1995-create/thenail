# Kế hoạch triển khai bản thử nghiệm The Nail theo phong cách Air

> **Dành cho agent thực thi:** BẮT BUỘC dùng skill `superpowers:subagent-driven-development` (khuyến nghị) hoặc `superpowers:executing-plans` để thực hiện lần lượt từng task. Dùng các ô `- [ ]` để theo dõi tiến độ.

**Goal / Mục tiêu:** Tạo `air-style-preview.html`, một bản thử nghiệm độc lập tái hiện sát bố cục, không khí bầu trời, kính trong suốt và nhịp chuyển động của `air.inc`, nhưng sử dụng toàn bộ nội dung thật của The Nail.

**Architecture / Kiến trúc:** Giữ kiến trúc một file HTML tĩnh gồm HTML ngữ nghĩa, CSS theo token và JavaScript thuần. Các chức năng được chia thành các module nhỏ trong cùng thẻ `<script>`: điều hướng, chuyển động, hành trình ba bước, tab dịch vụ, gallery/lightbox và form Zalo. `index.html` chỉ được đọc để lấy nội dung và tuyệt đối không bị sửa.

**Tech Stack / Công nghệ:** HTML5, CSS3, SVG nội tuyến, Vanilla JavaScript, Intersection Observer, `requestAnimationFrame`, Google Fonts và ảnh Googleusercontent hiện có.

---

## Sơ đồ file

- Tạo: `air-style-preview.html`
  - Chứa toàn bộ giao diện, style, dữ liệu ảnh và hành vi tương tác của bản thử nghiệm.
- Giữ nguyên: `index.html`
  - Nguồn nội dung kinh doanh hiện tại; không chỉnh sửa.
- Tham khảo: `docs/superpowers/specs/2026-06-19-air-style-preview-design.md`
  - Tiêu chí thiết kế và nghiệm thu đã được duyệt.
- Không tạo CSS, JavaScript, package hoặc build config riêng.

## Task 1: Tạo khung trang và hàng rào bảo vệ website chính thức

**Files:**
- Create: `air-style-preview.html`
- Read only: `index.html`

- [ ] **Bước 1: Ghi lại checksum hiện tại của website chính thức**

Run:

```bash
shasum -a 256 index.html | tee /tmp/thenail-index-before.sha256
```

Expected: một dòng checksum kết thúc bằng `index.html`.

- [ ] **Bước 2: Tạo khung HTML ngữ nghĩa của bản preview**

Tạo `air-style-preview.html` với các phần tử gốc sau:

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Bản thử nghiệm giao diện The Nail theo phong cách bầu trời và kính trong suốt.">
  <meta name="theme-color" content="#426188">
  <title>The Nail — Air Style Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&family=Oswald:wght@600;700&display=swap" rel="stylesheet">
  <style></style>
</head>
<body>
  <a class="skip-link" href="#main">Đi đến nội dung chính</a>
  <nav class="site-nav" id="site-nav"></nav>
  <main id="main">
    <header class="sky-hero" id="top"></header>
    <section class="journey" id="journey"></section>
    <section class="gallery-section" id="gallery"></section>
    <section class="services-section" id="services"></section>
    <section class="values-section" id="values"></section>
    <section class="pricing-section" id="pricing"></section>
    <section class="booking-section" id="booking"></section>
    <section class="contact-section" id="contact"></section>
  </main>
  <footer class="site-footer"></footer>
  <div class="mobile-dock"></div>
  <dialog class="lightbox" id="lightbox"></dialog>
  <script></script>
</body>
</html>
```

- [ ] **Bước 3: Chạy kiểm tra cấu trúc ban đầu**

Run:

```bash
node -e "const fs=require('fs');const s=fs.readFileSync('air-style-preview.html','utf8');for(const id of ['main','top','journey','gallery','services','values','pricing','booking','contact','lightbox'])if(!s.includes('id=\"'+id+'\"'))throw new Error('Thiếu '+id);console.log('PASS: preview skeleton')"
```

Expected: `PASS: preview skeleton`.

- [ ] **Bước 4: Xác minh `index.html` chưa đổi do task này**

Run:

```bash
shasum -a 256 -c /tmp/thenail-index-before.sha256
```

Expected: `index.html: OK`.

- [ ] **Bước 5: Commit khung trang**

```bash
git add air-style-preview.html
git commit -m "Add Air-style preview skeleton"
```

## Task 2: Dựng hệ token, điều hướng và hero bầu trời

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Thêm token thiết kế và CSS nền**

Trong `<style>`, định nghĩa đúng các biến và reset chính:

```css
:root {
  --sky: #426188;
  --sky-deep: #27486f;
  --action: #2b7fff;
  --ink: #000;
  --charcoal: #1b1b1b;
  --haze: #f5f5f5;
  --cloud: #fff;
  --glass: rgba(255,255,255,.16);
  --glass-border: rgba(255,255,255,.48);
  --font-ui: "DM Sans", Inter, system-ui, sans-serif;
  --font-display: Oswald, Impact, sans-serif;
  --font-script: "DM Serif Display", Georgia, serif;
  --radius-card: 14px;
  --radius-image: 11px;
  --radius-button: 8px;
  --ease-air: cubic-bezier(.16,1,.3,1);
  --page-pad: clamp(16px, 2.5vw, 40px);
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  overflow-x: clip;
  color: var(--charcoal);
  background: var(--sky);
  font-family: var(--font-ui);
}
img { display: block; max-width: 100%; }
button, input, select, textarea { font: inherit; }
a { color: inherit; }
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 9999;
  transform: translateY(-150%);
}
.skip-link:focus { transform: none; }
```

- [ ] **Bước 2: Viết nội dung điều hướng**

Thanh điều hướng phải có:

```html
<div class="nav-inner">
  <a class="wordmark" href="#top" aria-label="The Nail — về đầu trang">The Nail</a>
  <div class="nav-links" id="nav-links">
    <a href="#gallery">Mẫu nail</a>
    <a href="#services">Dịch vụ</a>
    <a href="#pricing">Bảng giá</a>
    <a href="#contact">Về tiệm</a>
  </div>
  <div class="nav-actions">
    <a class="nav-instagram" href="https://www.instagram.com/thenail.1995/" target="_blank" rel="noopener">Instagram</a>
    <a class="button button-light" href="#booking">Đặt lịch</a>
    <button class="menu-toggle" type="button" aria-controls="nav-links" aria-expanded="false" aria-label="Mở menu">
      <span></span><span></span>
    </button>
  </div>
</div>
```

- [ ] **Bước 3: Dựng hero với hình nền nguyên bản**

Hero phải có các lớp `.cloud`, `.glass-ribbon` và `.glass-orb`, chữ lớn và CTA:

```html
<div class="hero-atmosphere" aria-hidden="true">
  <span class="cloud cloud-a"></span>
  <span class="cloud cloud-b"></span>
  <span class="cloud cloud-c"></span>
  <svg class="glass-ribbon ribbon-a" viewBox="0 0 900 600">
    <defs>
      <linearGradient id="tube-a" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".72"/>
        <stop offset=".46" stop-color="#bfe1ff" stop-opacity=".16"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".5"/>
      </linearGradient>
      <filter id="tube-blur"><feGaussianBlur stdDeviation="1.4"/></filter>
    </defs>
    <path d="M-50 500 C140 340 180 80 340 95 C500 110 400 445 570 470 C720 490 730 210 960 155"
      fill="none" stroke="url(#tube-a)" stroke-width="92" stroke-linecap="round"
      filter="url(#tube-blur)"/>
    <path d="M-50 500 C140 340 180 80 340 95 C500 110 400 445 570 470 C720 490 730 210 960 155"
      fill="none" stroke="#fff" stroke-opacity=".42" stroke-width="7" stroke-linecap="round"/>
  </svg>
  <span class="glass-orb"></span>
</div>
<div class="hero-copy">
  <p class="hero-kicker">Nail Studio by Trần Ngọc</p>
  <h1><span>THE</span><span>NAIL</span></h1>
  <p class="hero-script">your concept, my creation</p>
  <p class="hero-subtitle">Ý tưởng bạn trao — Nghệ thuật tôi tạo</p>
  <div class="hero-actions">
    <a class="button button-light" href="#booking">Đặt lịch</a>
    <a class="button button-ghost" href="#gallery">Xem mẫu nail</a>
  </div>
</div>
```

CSS hero phải dùng `min-height: 100svh`, chữ display bằng
`font-size: clamp(96px, 20vw, 280px)`, `line-height: .78`, nền nhiều radial
gradient và không dùng ảnh hoặc mã lấy từ Air.

- [ ] **Bước 4: Thêm menu mobile và trạng thái nav khi cuộn**

Trong `<script>`, thêm:

```js
const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

function closeMenu() {
  nav.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const open = !nav.classList.contains("menu-open");
  nav.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", scrollY > 40);
}, { passive: true });
```

- [ ] **Bước 5: Kiểm tra hero bằng trình duyệt local**

Run:

```bash
python3 -m http.server 4173
```

Mở `http://127.0.0.1:4173/air-style-preview.html`.

Expected:

- Hero phủ toàn màn hình.
- Có bầu trời, mây và dải kính trong suốt.
- `THE NAIL` không tràn ngang ở 1280×720.
- Nav đổi sang kính mờ khi cuộn.
- Menu mobile mở và đóng được.

- [ ] **Bước 6: Commit hero**

```bash
git add air-style-preview.html
git commit -m "Build atmospheric Air-style hero"
```

## Task 3: Thêm hành trình ba bước tương tác

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Viết markup của ba trạng thái**

Tạo các button có `data-journey` và một sân khấu hình ảnh:

```html
<div class="section-shell">
  <p class="eyebrow reveal">Một trải nghiệm riêng cho bạn</p>
  <h2 class="journey-title reveal">Từ ý tưởng đến <em>bộ móng của riêng bạn.</em></h2>
  <div class="journey-tabs" role="tablist" aria-label="Hành trình làm nail">
    <button role="tab" aria-selected="true" data-journey="discover">Khám phá</button>
    <button role="tab" aria-selected="false" data-journey="choose">Chọn mẫu</button>
    <button role="tab" aria-selected="false" data-journey="book">Đặt lịch</button>
  </div>
  <div class="journey-stage">
    <div class="journey-copy" aria-live="polite">
      <p class="journey-count">01 / 03</p>
      <h3>Khám phá phong cách khiến bạn rung động.</h3>
      <p>Xem những bộ móng đã được Trần Ngọc vẽ thủ công và lưu lại mẫu bạn yêu thích.</p>
    </div>
    <div class="journey-visual">
      <img src="https://lh3.googleusercontent.com/d/1S4QNzkjA6jfdOEWJK-XhGEdPk32S9JUP=w1000" alt="Mẫu nail nhẹ nhàng của The Nail">
    </div>
  </div>
</div>
```

- [ ] **Bước 2: Thêm dữ liệu và hàm chuyển trạng thái**

```js
const journeyData = {
  discover: {
    count: "01 / 03",
    title: "Khám phá phong cách khiến bạn rung động.",
    text: "Xem những bộ móng đã được Trần Ngọc vẽ thủ công và lưu lại mẫu bạn yêu thích.",
    image: "https://lh3.googleusercontent.com/d/1S4QNzkjA6jfdOEWJK-XhGEdPk32S9JUP=w1000",
    alt: "Mẫu nail nhẹ nhàng của The Nail"
  },
  choose: {
    count: "02 / 03",
    title: "Chọn mẫu, màu và phom hợp với đôi tay.",
    text: "Gửi mẫu tham khảo để được tư vấn chất liệu, độ dài và khoảng giá trước khi đến tiệm.",
    image: "https://lh3.googleusercontent.com/d/1GXvFnxAxKy_VGTAL9auoCdJ-aePzHhBa=w1000",
    alt: "Mẫu nail hoa khô của The Nail"
  },
  book: {
    count: "03 / 03",
    title: "Đặt lịch cho một buổi làm móng riêng tư.",
    text: "Chọn ngày giờ phù hợp và xác nhận nhanh qua Zalo với thợ chính.",
    image: "https://lh3.googleusercontent.com/d/1zRAsj2CXBTJhTYfcy-dQb3T7d7VICl3N=w1000",
    alt: "Mẫu nail cao cấp của The Nail"
  }
};

function setJourney(key) {
  const data = journeyData[key];
  const stage = document.querySelector(".journey-stage");
  stage.classList.add("is-changing");
  setTimeout(() => {
    stage.querySelector(".journey-count").textContent = data.count;
    stage.querySelector("h3").textContent = data.title;
    stage.querySelector(".journey-copy > p:last-child").textContent = data.text;
    const image = stage.querySelector("img");
    image.src = data.image;
    image.alt = data.alt;
    document.querySelectorAll("[data-journey]").forEach(button => {
      button.setAttribute("aria-selected", String(button.dataset.journey === key));
    });
    stage.classList.remove("is-changing");
  }, 220);
}

document.querySelectorAll("[data-journey]").forEach(button => {
  button.addEventListener("click", () => setJourney(button.dataset.journey));
});
```

- [ ] **Bước 3: Kiểm tra cả ba trạng thái**

Expected:

- Mỗi tab cập nhật đúng số, tiêu đề, mô tả và ảnh.
- `aria-selected` chỉ là `true` trên tab đang chọn.
- Chuyển trạng thái có opacity/blur nhẹ, không nhấp nháy trắng.

- [ ] **Bước 4: Commit hành trình**

```bash
git add air-style-preview.html
git commit -m "Add interactive salon journey"
```

## Task 4: Xây gallery, bộ lọc và lightbox

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Thêm đủ 15 ảnh thật và các bộ lọc**

Dùng nguyên 15 URL trong `index.html`, giữ các `data-category`:

```html
<div class="gallery-filters" role="group" aria-label="Lọc mẫu theo khoảng giá">
  <button class="is-active" data-filter="all">Tất cả</button>
  <button data-filter="200-300">200–300k</button>
  <button data-filter="300-400">300–400k</button>
  <button data-filter="400-500">400–500k</button>
  <button data-filter="500-700">500–700k</button>
  <button data-filter="800-plus">800k+</button>
</div>
```

Mỗi ảnh dùng cấu trúc:

```html
<button class="gallery-card reveal" type="button" data-category="200-300"
  aria-label="Mở mẫu nail nhẹ nhàng">
  <img src="https://lh3.googleusercontent.com/d/1S4QNzkjA6jfdOEWJK-XhGEdPk32S9JUP=w700"
    alt="Mẫu nail nhẹ nhàng" loading="lazy" decoding="async">
</button>
```

Danh sách chính xác cần đưa vào gallery:

```js
const galleryItems = [
  ["200-300", "1S4QNzkjA6jfdOEWJK-XhGEdPk32S9JUP", "Mẫu nail nhẹ nhàng"],
  ["200-300", "1j-MiMHT-BF-DUQ6rHUotwXMoz8jQ1pAe", "Mẫu nail tinh tế"],
  ["200-300", "18h6DMoUTIZHNlIa05yeUxwHni3mIneKq", "Mẫu nail thanh lịch"],
  ["300-400", "1RGsEjU97bI9bQPXHLnG-MVw4L3gp5bRQ", "Mẫu nail lấp lánh"],
  ["300-400", "1x4VLEfZMEqbu8RBjlwn4jowXvc5pUVX_", "Mẫu nail loang đá"],
  ["300-400", "1N9gvl1BvZ93_yT0_lmNDQFYXUh3itwVV", "Mẫu nail loang hoa"],
  ["400-500", "1dRqOcrr6ysD2CLLBSDqQNjhGo5ajFaKF", "Mẫu nail đính ngọc"],
  ["400-500", "1eNqvVO6_xFJdDzNls-d9pXgF76BZsj-8", "Mẫu nail nhũ nổi"],
  ["400-500", "1GXvFnxAxKy_VGTAL9auoCdJ-aePzHhBa", "Mẫu nail ẩn hoa khô"],
  ["500-700", "1UOpuen-QEHEk_6D8elQdkE_NkzRmAA8k", "Mẫu nail thiết kế"],
  ["500-700", "1UlRElNo7nBvcqjbaecrq0S_UaNAc-ONb", "Mẫu nail thủ công"],
  ["500-700", "1eVbcKJoqQ-IANuT-PfR9NVJdwqyyPqbn", "Mẫu nail đính đá"],
  ["800-plus", "1zRAsj2CXBTJhTYfcy-dQb3T7d7VICl3N", "Mẫu nail cao cấp"],
  ["800-plus", "1FPox5x2C_sBRAukxqoW7qYpxc3vhDRAW", "Mẫu nail đắp đá"],
  ["800-plus", "1LUv5qa6G92D7nT-OT-LG8D_MzeWeq9Lz", "Mẫu nail nghệ thuật"]
];
```

URL ảnh lưới được tạo bằng
`` `https://lh3.googleusercontent.com/d/${id}=w700` ``; lightbox thay bằng
`=w1600`.

Không chèn tên hoặc giá lên bề mặt ảnh.

- [ ] **Bước 2: Viết bộ lọc có trạng thái truy cập được**

```js
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const galleryCards = [...document.querySelectorAll(".gallery-card")];

function filterGallery(category) {
  filterButtons.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  galleryCards.forEach(card => {
    const visible = category === "all" || card.dataset.category === category;
    card.hidden = !visible;
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => filterGallery(button.dataset.filter));
});
filterGallery("all");
```

- [ ] **Bước 3: Dựng lightbox bằng `<dialog>`**

```html
<dialog class="lightbox" id="lightbox" aria-label="Xem ảnh nail">
  <button class="lightbox-close" type="button" aria-label="Đóng ảnh">Đóng</button>
  <button class="lightbox-prev" type="button" aria-label="Ảnh trước">←</button>
  <img src="" alt="">
  <button class="lightbox-next" type="button" aria-label="Ảnh sau">→</button>
</dialog>
```

JavaScript:

```js
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
let visibleCards = [];
let lightboxIndex = 0;

function updateVisibleCards() {
  visibleCards = galleryCards.filter(card => !card.hidden);
}

function showLightboxImage() {
  const source = visibleCards[lightboxIndex].querySelector("img");
  lightboxImage.src = source.src.replace("=w700", "=w1600");
  lightboxImage.alt = source.alt;
}

function openLightbox(card) {
  updateVisibleCards();
  lightboxIndex = visibleCards.indexOf(card);
  showLightboxImage();
  lightbox.showModal();
}

function moveLightbox(direction) {
  lightboxIndex = (lightboxIndex + direction + visibleCards.length) % visibleCards.length;
  showLightboxImage();
}

galleryCards.forEach(card => card.addEventListener("click", () => openLightbox(card)));
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});
addEventListener("keydown", event => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
```

- [ ] **Bước 4: Kiểm tra gallery**

Expected:

- Tất cả sáu bộ lọc cho kết quả đúng.
- Ảnh không có overlay chữ.
- Lightbox chỉ hiển thị ảnh và nút điều hướng.
- Escape, nút đóng và click nền đều đóng dialog.
- Sau khi lọc, nút trước/sau chỉ đi qua các ảnh đang hiển thị.

- [ ] **Bước 5: Commit gallery**

```bash
git add air-style-preview.html
git commit -m "Build filterable nail gallery"
```

## Task 5: Thêm dịch vụ, giá trị thương hiệu và bảng giá

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Tạo bốn tab dịch vụ bằng dữ liệu thật**

Dùng đúng bốn key:

```js
const serviceData = {
  care: {
    label: "Chăm sóc nền móng",
    title: "Nền móng sạch, phom gọn và khỏe hơn.",
    items: [
      ["Nhặt da & tạo phom móng tỉ mỉ", "Làm sạch biểu bì nhẹ nhàng, dũa phom tròn, oval hoặc vuông ôm gọn ngón tay.", "Inbox báo giá"],
      ["Sơn dưỡng phục hồi móng", "Dưỡng keratin hỗ trợ móng chắc khỏe sau khi tháo gel cũ.", "Inbox báo giá"]
    ]
  },
  gel: {
    label: "Gel & hiệu ứng",
    title: "Màu trong, độ bóng sâu và hiệu ứng bắt sáng.",
    items: [
      ["Sơn Gel màu trơn / phối màu", "Gel chính hãng Hàn/Nhật, bóng mượt và bền màu.", "200–300k"],
      ["Nhũ mắt mèo / sơn thạch", "Hiệu ứng thạch trong trẻo hoặc nhũ mắt mèo phản chiếu.", "200–300k"]
    ]
  },
  design: {
    label: "Vẽ design thủ công",
    title: "Từng nét cọ được vẽ riêng cho ý tưởng của bạn.",
    items: [
      ["Vẽ design họa tiết cọ mảnh", "Hoa lá, line art và chi tiết vẽ tay theo mẫu bạn trao.", "300–500k"],
      ["Loang vân đá ẩn nhũ 3D", "Vân loang có chiều sâu, line viền nổi hoặc đính đá.", "400–700k"]
    ]
  },
  extension: {
    label: "Nối & tạo phom",
    title: "Độ dài thanh thoát nhưng vẫn nhẹ và tự nhiên.",
    items: [
      ["Nối móng úp Gel-X Premium", "Kỹ thuật nối nhẹ, bền và ôm sát phom ngón tay.", "500–800k"],
      ["Đắp Gel / Bột phom dài", "Tạo dáng móng dài sắc nét cho mẫu design và đính đá.", "500–800k"]
    ]
  }
};
```

Hàm `renderService(key)` phải cập nhật tiêu đề và hai dòng dịch vụ bằng
`textContent`, không chèn HTML lấy từ input.

```js
const serviceTitle = document.querySelector("#service-title");
const serviceRows = [...document.querySelectorAll(".service-row")];

function renderService(key) {
  const service = serviceData[key];
  serviceTitle.textContent = service.title;
  serviceRows.forEach((row, index) => {
    const [name, description, price] = service.items[index];
    row.querySelector(".service-name").textContent = name;
    row.querySelector(".service-description").textContent = description;
    row.querySelector(".service-price").textContent = price;
  });
  document.querySelectorAll("[data-service]").forEach(button => {
    const active = button.dataset.service === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

document.querySelectorAll("[data-service]").forEach(button => {
  button.addEventListener("click", () => renderService(button.dataset.service));
});
renderService("care");
```

- [ ] **Bước 2: Viết section ba giá trị thương hiệu**

Giữ nguyên từng chữ:

```html
<article class="value-panel reveal">
  <p>01</p>
  <h3>Cá nhân hoá</h3>
  <p>Mỗi khách là duy nhất. Phom, màu và chi tiết được cân chỉnh theo chính đôi tay của bạn.</p>
</article>
<article class="value-panel reveal">
  <p>02</p>
  <h3>Sáng tạo</h3>
  <p>Không chỉ làm theo mẫu, The Nail cùng bạn chuyển ý tưởng thành một thiết kế riêng.</p>
</article>
<article class="value-panel reveal">
  <p>03</p>
  <h3>Tỉ mỉ</h3>
  <p>Từng đường cọ, lớp gel và đường viền đều được hoàn thiện chậm rãi, có chủ đích.</p>
</article>
```

- [ ] **Bước 3: Tạo bảng giá module**

Hiển thị đủ tám dịch vụ từ `serviceData`. Không đổi giá, không thêm discount và
không thêm review. Mỗi module gồm tên, mô tả và giá, sau đó có CTA:

```html
<a class="button button-blue" href="https://zalo.me/0931415099" target="_blank" rel="noopener">
  Gửi mẫu qua Zalo để được tư vấn
</a>
```

- [ ] **Bước 4: Kiểm tra nội dung bắt buộc bằng Node**

Run:

```bash
node - <<'NODE'
const fs=require("fs");
const s=fs.readFileSync("air-style-preview.html","utf8");
const required=[
  "Cá nhân hoá","Sáng tạo","Tỉ mỉ",
  "200–300k","300–500k","400–700k","500–800k",
  "Ý tưởng bạn trao — Nghệ thuật tôi tạo"
];
for(const text of required) if(!s.includes(text)) throw new Error("Thiếu: "+text);
console.log("PASS: approved content");
NODE
```

Expected: `PASS: approved content`.

- [ ] **Bước 5: Commit nội dung dịch vụ**

```bash
git add air-style-preview.html
git commit -m "Add services values and pricing"
```

## Task 6: Thêm form đặt lịch, thông tin liên hệ và footer

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Tạo form đặt lịch**

Form phải có đúng các id:

```html
<form class="booking-form" id="booking-form">
  <label>Họ và tên<input id="booking-name" name="name" autocomplete="name" required></label>
  <label>Số điện thoại<input id="booking-phone" name="phone" type="tel" autocomplete="tel" required></label>
  <label>Ngày mong muốn<input id="booking-date" name="date" type="date" required></label>
  <label>Giờ mong muốn
    <select id="booking-time" name="time" required>
      <option value="">Chọn giờ</option>
      <option>9:00</option><option>10:00</option><option>11:00</option>
      <option>12:00</option><option>13:00</option><option>14:00</option>
      <option>15:00</option><option>16:00</option><option>17:00</option>
      <option>18:00</option><option>19:00</option><option>20:00</option><option>21:00</option>
    </select>
  </label>
  <label>Dịch vụ
    <select id="booking-service" name="service" required>
      <option value="">Chọn dịch vụ</option>
      <option>Basic — chăm sóc nền móng</option>
      <option>Gel cơ bản — 200–300k</option>
      <option>Design vẽ tay — 300–500k</option>
      <option>Nối / Gel-X — 500–800k</option>
      <option>Chưa chọn — cần tư vấn</option>
    </select>
  </label>
  <label class="form-wide">Ý tưởng hoặc ghi chú<textarea id="booking-note" name="note" rows="4"></textarea></label>
  <button class="button button-blue form-wide" type="submit">Gửi yêu cầu qua Zalo</button>
</form>
```

- [ ] **Bước 2: Viết hàm tạo tin nhắn Zalo**

```js
function fieldValue(id) {
  return document.getElementById(id).value.trim();
}

function formatBookingDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

document.querySelector("#booking-form").addEventListener("submit", event => {
  event.preventDefault();
  const message = [
    "Chào The Nail Studio! Em muốn đặt lịch qua website:",
    `- Tên: ${fieldValue("booking-name")}`,
    `- SĐT: ${fieldValue("booking-phone")}`,
    `- Ngày: ${formatBookingDate(fieldValue("booking-date"))}`,
    `- Giờ: ${fieldValue("booking-time")}`,
    `- Dịch vụ: ${fieldValue("booking-service")}`,
    fieldValue("booking-note") ? `- Ghi chú: ${fieldValue("booking-note")}` : ""
  ].filter(Boolean).join("\n");

  if (navigator.clipboard) navigator.clipboard.writeText(message).catch(() => {});
  window.open(`https://zalo.me/0931415099?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});
```

- [ ] **Bước 3: Thêm đúng thông tin liên hệ**

```html
<address>
  <p>521/54 Cách Mạng Tháng 8, P. Hoà Hưng, Q.10, TP.HCM</p>
  <a href="tel:+84931415099">0931 415 099</a>
  <p>9:00 — 22:00 · Thứ 2 — Chủ nhật</p>
</address>
```

Footer phải có liên kết Instagram, Threads, Facebook, Zalo và dòng:

```html
<p>© 2026 The Nail · Nail Studio by Trần Ngọc · Quận 10, Sài Gòn</p>
```

- [ ] **Bước 4: Thêm mobile dock**

Dock chỉ hiện dưới 700px, gồm `Xem mẫu` và `Đặt lịch Zalo`, không che nội dung
cuối trang và có vùng bấm tối thiểu 44px.

- [ ] **Bước 5: Kiểm tra link và thông tin**

Run:

```bash
node - <<'NODE'
const fs=require("fs");
const s=fs.readFileSync("air-style-preview.html","utf8");
for(const text of [
  "521/54 Cách Mạng Tháng 8",
  "0931 415 099",
  "https://zalo.me/0931415099",
  "https://www.instagram.com/thenail.1995/"
]) if(!s.includes(text)) throw new Error("Thiếu: "+text);
console.log("PASS: contact data");
NODE
```

Expected: `PASS: contact data`.

- [ ] **Bước 6: Commit booking và contact**

```bash
git add air-style-preview.html
git commit -m "Add booking and contact experience"
```

## Task 7: Hoàn thiện hệ chuyển động và chế độ giảm chuyển động

**Files:**
- Modify: `air-style-preview.html`

- [ ] **Bước 1: Thêm Intersection Observer cho reveal**

```js
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
```

CSS:

```css
.reveal {
  opacity: 0;
  transform: translate3d(0, 36px, 0);
  transition: opacity .9s var(--ease-air), transform .9s var(--ease-air);
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

- [ ] **Bước 2: Thêm hero parallax bằng một vòng `requestAnimationFrame`**

```js
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(pointer: fine)");
let pointerX = 0;
let pointerY = 0;
let ticking = false;

function renderMotion() {
  ticking = false;
  if (motionQuery.matches) return;
  const y = scrollY;
  document.documentElement.style.setProperty("--hero-shift", `${Math.min(y * .16, 120)}px`);
  document.documentElement.style.setProperty("--pointer-x", `${pointerX * 18}px`);
  document.documentElement.style.setProperty("--pointer-y", `${pointerY * 12}px`);
}

function requestMotionFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(renderMotion);
}

addEventListener("scroll", requestMotionFrame, { passive: true });
if (finePointer.matches) {
  addEventListener("pointermove", event => {
    pointerX = event.clientX / innerWidth - .5;
    pointerY = event.clientY / innerHeight - .5;
    requestMotionFrame();
  }, { passive: true });
}
```

Các lớp hero chỉ đọc biến CSS bằng `transform`, không đọc layout trong vòng
animation.

- [ ] **Bước 3: Thêm CSS giảm chuyển động**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
  .glass-ribbon,
  .glass-orb,
  .cloud {
    transform: none !important;
  }
}
```

- [ ] **Bước 4: Kiểm tra hiệu năng chuyển động**

Trong trình duyệt:

- Cuộn liên tục từ đầu đến cuối ở 1280×720.
- Xác nhận không có giật mạnh do đọc/ghi layout xen kẽ.
- Bật `prefers-reduced-motion`, reload và xác nhận mọi nội dung hiện ngay.
- Xác nhận gallery, tab và form vẫn hoạt động khi giảm chuyển động.

- [ ] **Bước 5: Commit chuyển động**

```bash
git add air-style-preview.html
git commit -m "Polish motion and reduced-motion support"
```

## Task 8: Kiểm thử responsive, accessibility và sửa lỗi

**Files:**
- Modify if needed: `air-style-preview.html`

- [ ] **Bước 1: Chạy static assertions**

Run:

```bash
node - <<'NODE'
const fs=require("fs");
const s=fs.readFileSync("air-style-preview.html","utf8");
const checks = {
  "lang vi": /<html lang="vi">/,
  "viewport": /name="viewport"/,
  "one h1": (s.match(/<h1\b/g)||[]).length === 1,
  "lazy images": /loading="lazy"/,
  "reduced motion": /prefers-reduced-motion:\s*reduce/,
  "dialog": /<dialog[^>]+id="lightbox"/,
  "booking form": /id="booking-form"/
};
for (const [name, result] of Object.entries(checks)) {
  if (!result) throw new Error("FAIL: "+name);
}
console.log("PASS: static assertions");
NODE
```

Expected: `PASS: static assertions`.

- [ ] **Bước 2: Kiểm thử desktop**

Tại 1440×900 và 1280×720:

- Hero phủ viewport và giống nhịp bố cục Air.
- Chữ `THE NAIL`, dải kính và CTA đều nằm trong khung.
- Nav, ba tab hành trình, bốn tab dịch vụ, sáu filter và lightbox hoạt động.
- Không có horizontal scrollbar.

- [ ] **Bước 3: Kiểm thử tablet và mobile**

Tại 768×1024, 390×844 và 375×667:

- Menu mở, đóng và cập nhật `aria-expanded`.
- Hero không che CTA.
- Gallery hai cột ở 390px và không ép ảnh méo.
- Bảng dịch vụ, giá và form xếp dọc.
- Mobile dock không che footer hoặc nút submit.
- Mọi nút và input có chiều cao tối thiểu 44px.

- [ ] **Bước 4: Kiểm tra console và network**

Expected:

- Không có lỗi JavaScript.
- Không có request tới tài nguyên Air.
- Font lỗi vẫn có fallback đọc được.
- Ảnh Googleusercontent phía dưới fold dùng lazy loading.

- [ ] **Bước 5: Sửa toàn bộ lỗi tìm thấy và chạy lại Bước 1–4**

Không commit nếu còn:

- lỗi console,
- tràn ngang,
- nút không hoạt động,
- nội dung sai,
- hoặc ảnh có overlay chữ/giá.

- [ ] **Bước 6: Commit sửa lỗi responsive**

```bash
git add air-style-preview.html
git commit -m "Fix preview responsive and accessibility issues"
```

## Task 9: Kiểm tra cuối và bàn giao bản preview

**Files:**
- Verify: `air-style-preview.html`
- Verify unchanged: `index.html`

- [ ] **Bước 1: Xác minh website chính thức không bị sửa trong quá trình làm**

Run:

```bash
shasum -a 256 -c /tmp/thenail-index-before.sha256
```

Expected: `index.html: OK`.

- [ ] **Bước 2: Chạy kiểm tra diff**

Run:

```bash
git diff --check
git status --short
```

Expected:

- `git diff --check` không in lỗi.
- Không có thay đổi mới ngoài phạm vi của bản preview.
- Các thay đổi cũ của người dùng trong repo vẫn được giữ nguyên.

- [ ] **Bước 3: Kiểm tra lần cuối bằng trình duyệt**

Mở:

```text
http://127.0.0.1:4173/air-style-preview.html
```

Thực hiện smoke test:

1. Mở và đóng menu mobile.
2. Chọn đủ ba bước hành trình.
3. Chọn đủ sáu filter gallery.
4. Mở lightbox, chuyển ảnh và đóng.
5. Chọn đủ bốn tab dịch vụ.
6. Điền form bằng dữ liệu thử nhưng không gửi ra ngoài nếu không cần.
7. Kiểm tra tất cả anchor scroll đúng section.

- [ ] **Bước 4: Chụp ảnh nghiệm thu**

Lưu ảnh tại thư mục tạm, không thêm vào git:

```text
/tmp/thenail-air-preview-desktop.png
/tmp/thenail-air-preview-mobile.png
```

Ảnh desktop dùng 1440×900; ảnh mobile dùng 390×844.

- [ ] **Bước 5: Commit cuối nếu có sửa sau smoke test**

```bash
git add air-style-preview.html
git commit -m "Finalize Air-style preview"
```

- [ ] **Bước 6: Bàn giao**

Báo rõ:

- đường dẫn file preview,
- cách mở local,
- các kích thước đã kiểm tra,
- trạng thái console,
- xác nhận `index.html` không thay đổi,
- và không deploy/push khi chưa được yêu cầu.
