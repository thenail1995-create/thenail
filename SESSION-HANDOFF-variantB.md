# THE NAIL — Bàn giao: VARIANT B (bản chính đang xây) · cập nhật 2026-06-24

> File để **session Claude mới tiếp tục ngay**. Đọc cùng memory `project_thenail_prod_repo.md` + `project_thenail_rebuild.md`.

## TL;DR
- Đang xây **variant B = `parallax-B-stack.html`** thành bản chính cho thenail.vn. **User ĐÃ ƯNG hướng này** ("tất cả ok rồi, mọi thứ như tôi muốn").
- **CHƯA DEPLOY** — vẫn là file `parallax-B-stack.html` (chưa đổi thành `index.html`, chưa push). Site live thenail.vn vẫn là bản TỐI/emerald cũ.
- **Concept:** desktop = **sticky-stack** (section trượt đè nhau); mobile = **card-stack tĩnh + reveal + marquee + bottom action bar** (mobile-native, không ghim). **Song ngữ VI/EN**. Tông vintage sage/cream. Địa chỉ mới **517/15 Nguyễn Tri Phương, P. Diên Hồng, Q.10**.

## Vị trí & cách chạy
- Repo: `~/Desktop/thenail-website` (git, remote `github.com/thenail1995-create/thenail`, branch main, GitHub Pages + CNAME thenail.vn). `gh` đã auth acc `thenail1995-create`.
- **File chính đang sửa: `parallax-B-stack.html`** (KHÔNG phải index.html).
- `parallax-A-bgimage.html` = bản A (ảnh nền trôi chậm) — user KHÔNG chọn, giữ để tham khảo.
- `index.html` = bản clean trước đó (vintage sage, KHÔNG có stack/song ngữ) — đừng nhầm.
- Server bền: `lsof -ti tcp:5858 | xargs kill -9 2>/dev/null; cd ~/Desktop/thenail-website && nohup python3 -m http.server 5858 --bind 127.0.0.1 >/tmp/thenail-server.log 2>&1 & disown`
- Mở: `open -a "Google Chrome" "http://localhost:5858/parallax-B-stack.html?v=$(date +%s)"` (LUÔN cache-buster — Chrome cache lì).

## ⚠️ Cách VERIFY (quan trọng)
- **Claude Preview MCP máy này LỖI** (innerWidth≈0) → KHÔNG dùng. Dùng **browser-act** (skill, Chrome thật, browser id `chrome_local_98081020414263465`).
- **Test mobile:** browser-act KHÔNG resize được → nhúng page vào iframe 390px: tạo file tạm `_mt.html` (`<iframe width=390 height=844 src="parallax-B-stack.html">`), mở bằng browser-act, eval/scroll vào `iframe.contentWindow`. Đã có sẵn `_xem-mobile.html` (khung điện thoại đẹp cho USER xem — **XOÁ trước khi deploy**).
- Test scroll: set `document.documentElement.style.scrollBehavior='auto'` trước khi scrollTo. Splash chặn scroll → ẩn nó: `document.querySelector('.loading-splash').style.display='none'`.

## Đã làm trên B (toàn bộ session này)
**Cấu trúc stack (desktop):** Hero → Giới thiệu(about) → Bộ sưu tập(gallery) → Đặt lịch(booking) → Liên hệ(contact) → footer. Hero+About+Booking+Contact **sticky 100vh** (trượt đè nhau); Gallery **relative full** (cuộn thường, đè lên About nhờ nền đặc). Mỗi section nền ĐẶC + bo góc trên + đổ bóng → "thẻ chồng".
1. **Parallax stack**: section sau trượt đè section trước (rounded top + shadow). Booking+Contact đều sticky `overflow:visible` + min-height 100vh + padding gọn (40/64-110px) để vừa 1 màn hình, KHÔNG cắt nội dung, KHÔNG lòi nút ra footer.
2. **Hero**: bỏ hiệu ứng mờ (`#hero-scene{opacity:1!important}` ghi đè JS fade). Slogan ngắt gọn ở dấu "—" (mỗi vế span `white-space:nowrap` + `text-wrap:balance`).
3. **Gallery**: tiêu đề lớn cuộn đi, **thanh lọc giá GHIM** (sticky 2 hàng: "Bộ sưu tập" + nút giá), ảnh cuộn dưới. 81 ảnh.
4. **Nav thu gọn khi cuộn** (`nav.compact` qua scroll JS): bỏ tầng info, logo 54→42px.
5. **Map Liên hệ** = Google Maps thật (iframe `?q=517 Nguyễn Tri Phương...&output=embed`), tương tác được, 2 nút Chỉ đường/Zalo bên PHẢI map, marker = marker gốc Google. (Có lúc dùng ghim tự vẽ nhưng bỏ vì kéo map lệch.)
6. **SEO**: JSON-LD `NailSalon` + Open Graph + Twitter meta (head). Ảnh OG = 1 ảnh Drive.
7. **Splash**: rèm 8 dải ảnh (desktop) / mosaic 2 ảnh (mobile). Đã fix: ảnh load (thêm `<meta name="referrer" content="no-referrer">` cho CSS bg Drive), không méo (`background-size:400% auto`), **tối hơn** (`filter:brightness(0.78) contrast(1.05)`).
8. **MOBILE (≤820px) — thay-không-bỏ:**
   - Tắt sticky-stack → cuộn thường + **card-stack tĩnh** (bo góc + `margin-top:-24px` chồng nhẹ) + **reveal** (`.reveal-m` fade-up+scale+stagger, IntersectionObserver, 91 phần tử gồm 81 ảnh).
   - **Marquee 2 hàng** ảnh nail chạy ngược chiều (JS build từ `.scatter-card`, `.hero-strip-m` + `.hero-strip-track`/`.r2`) + gợi ý "Cuộn xuống".
   - **Thanh lọc = chip dính vuốt ngang** (nowrap + overflow-x auto).
   - **Bottom action bar** `.mbar` (fixed đáy): **Menu · Mẫu · Liên hệ** (3 nút điều hướng). Ẩn nút mạng XH nổi cũ trên mobile.
   - Liên hệ 1 cột, map full ngang, nút xuống dưới map. Touch `:active`. Lightbox (sẵn có) tap mở.
9. **Song ngữ VI/EN**: nút `.lang-toggle` ở nav-info (góc phải). JS i18n (cuối `<script>`): dict `[selector, en]` → set `data-en`/`data-vi`, swap textContent, nhớ `localStorage tn-lang`. Đã dịch: nav, headings+mô tả mọi section, 3 thẻ about, nhãn form, nút Gửi Zalo, info liên hệ + giờ, nút map, footer, bottom bar.
10. **Desktop nút mạng XH nổi** nhỏ lại: `.social-float-btn` 48→40px, `.zalo-float` 60→50px.

## ✅ MENU — ĐÃ DỰNG XONG + GIÁ THẬT (2026-06-24, session sau)
- Section `#menu` nằm GIỮA Gallery và Booking (DOM order: hero→about→gallery→**menu**→booking→contact). Desktop **GHIM (sticky top:0, min-height 100vh, overflow visible, flex canh giữa)** như Booking/Liên hệ → Đặt lịch trượt đè lên Menu = có **parallax stack** (đổi từ relative→sticky 2026-06-24 theo yêu cầu user). Nội dung menu ~865px vừa 1 viewport ≥900px nên không bị cắt. z-index: about1·gallery2·**menu3**·booking4·contact5·footer6. CSS component cạnh `.about` (tìm `/* ===== MENU / BẢNG GIÁ ===== */`). Mobile vẫn static card-stack.
- **GIÁ THẬT** từ "PRICE list" của tiệm (Drive img `1XITjgqECvCN_nyrJ0BUa5Ocl_rhG7mo5`, OCR + xem ảnh `_real-menu.jpg`). **2 nhóm** (grid 2 cột desktop / 1 cột mobile + reveal), mỗi dòng `.menu-row`: **Nail Care** (9 mục: Sạch da 30k…Đắp gel móng thật 150k) + **Design** (11 mục: Sơn gel 70k…Dán sticker 5–20k). Đơn vị = nghìn (k); range dùng "–". Tên dịch vụ có `data-en`.
- **Đổi nhãn theo yêu cầu user "dùng menu thay vì bảng giá":** nav "Bảng giá"→**"Menu"** (data-en="Menu"); heading "Dịch vụ & Bảng giá"→**"Menu dịch vụ"** (EN "Service Menu"); label "— Thực đơn —". Bottom-bar mobile "Menu" trỏ `#menu`. Dropdown `#b-service` = 2 nhóm (Nail Care / Design / Cần tư vấn).
- **Song ngữ:** mọi text menu có `data-en` inline. i18n MỞ RỘNG: dịch cả **placeholder** ô form qua `data-en-ph`/`data-vi-ph` (`#b-name`, `#b-note`) + option dropdown.
- Đã verify browser-act: desktop + mobile 390px (VI) đều khớp PRICE list, stack đè đúng. Ảnh `_verify-realmenu-desktop/-mobile.png` + `_real-menu.jpg` (xoá khi deploy).

## 🔜 CÒN PENDING (việc tiếp theo)
1. (Đã xong giá.) Nếu chị Ngọc đổi giá/dịch vụ → sửa trong 2 thẻ `.menu-cat`: mỗi `.menu-row` đổi `.mi-name`(+data-en) & `.mi-price`. Dòng "Giá mang tính tham khảo…" ở `.menu-foot` giữ làm disclaimer.
2. Cố ý giữ nguyên: "Nail Studio by Trần Ngọc", địa chỉ (proper noun). Splash tagline đã có VI/EN sẵn.
3. **Sẵn sàng DEPLOY** khi user nói "chốt" (xem mục cuối). Nhớ xoá `_verify-*.png`, `_real-menu.jpg`, `_xem-mobile.html`.

## 🤖 TRỢ LÝ AI (chatbot đặt lịch) — ĐÃ DỰNG (2026-06-24)
- **User chọn hướng AI agent.** Kiến trúc: web (widget) → **Cloudflare Worker** (giữ API key) → **Claude API**. Phase 1 = chat NGAY trên web; Phase 2 (sau) = nối Zalo OA + Messenger.
- **Frontend:** inline trong `parallax-B-stack.html` cuối file (style `.ai-*` + nút `.ai-fab` góc dưới-trái + panel `.ai-panel` + script IIFE). Cấu hình ở `AI_CFG.endpoint` (TRỐNG = chế độ **DEMO** trả lời theo từ khoá; dán URL Worker vào = AI thật). Gom đủ tên/SĐT/ngày/giờ/dịch vụ → bot xuất dòng `[[BOOKING]]{json}` → web hiện nút "Gửi qua Zalo" (copy tin + mở zalo.me/0931415099).
- **Backend:** `bot/thenail-bot-worker.js` (Cloudflare Worker, model `claude-haiku-4-5-20251001`, system prompt nạp sẵn menu+info tiệm, CORS theo `ALLOWED_ORIGINS`). Hướng dẫn deploy: `bot/README-chatbot.md` (lấy key console.anthropic.com → tạo Worker → set secret `ANTHROPIC_API_KEY` → dán URL vào `AI_CFG.endpoint`).
- **✅ ĐÃ LIVE (2026-06-24):** Worker đã deploy = **https://thenail-bot.psnhaotur1.workers.dev** (Cloudflare acc Psnhaotur1@gmail.com, account `fd74ef0b23a00e15846a9bea345f5037`). Secret `ANTHROPIC_API_KEY` đã set. `AI_CFG.endpoint` đã trỏ vào Worker. Test OK: hỏi giá → trả đúng menu bằng Claude Haiku. **wrangler đã login** trên máy này.
  - **Sửa code Worker rồi deploy lại:** `cd ~/Desktop/thenail-website && npx wrangler deploy bot/thenail-bot-worker.js --name thenail-bot --compatibility-date 2025-01-01`
  - **Đổi giá/dịch vụ trong não bot:** sửa `SYSTEM_PROMPT` trong `bot/thenail-bot-worker.js` rồi deploy lại (giữ khớp menu web).
  - Editor Cloudflare là iframe khác origin → KHÔNG paste code qua phím được; dùng wrangler. Dashboard hay load chậm — set secret qua Settings→Variables (user tự nhập key, Claude không nhập credential).
- **GOTCHA đã fix:** panel ban đầu là `<section>` → dính `section:not(#hero){position:relative}` (specificity cỡ id) → mất `position:fixed`. Đổi `<section>`→`<div>` là chuẩn (cùng họ lỗi `.mbar`).

## ⚠️ Gotcha kỹ thuật (đã vấp & học được)
- **Thứ tự CSS**: mọi override mobile/bản B đặt TRƯỚC rule desktop → bị rule desktop (sau, cùng specificity) đè. Phải `!important` (marquee `display`, chip-bar, contact-grid...). Specificity bẫy: `section:not(#hero)` tính như có id (1,0,1) > `.section.about` (0,1,1).
- **Booking sticky + relative trộn** gây lỗi: section sticky sót lại lòi nút ra footer. Giải: cho cả nhóm cuối cùng kiểu (sticky đều, hoặc relative đều) — hiện Booking+Contact ĐỀU sticky.
- **`overflow:hidden`/`clip` phá `position:sticky` lồng nhau** (thanh lọc gallery) → dùng `overflow-x:visible` cho body.
- **`.mbar` ban đầu là `<nav>`** → dính rule `nav{position:fixed;top:0}` của trang → phình full màn. Đổi thành `<div>`.
- **Ảnh Google Drive qua CSS `background-image`** bị chặn referrer → cần `<meta referrer no-referrer>` (thẻ `<img>` thì có `referrerpolicy="no-referrer"`).
- **Map ghim tự vẽ** lệch khi user kéo map → dùng marker gốc Google (`?q=...&output=embed`).
- Mobile: nội dung 1 cột cao hơn màn hình → KHÔNG ghim sticky (che/giật) → card-stack tĩnh + reveal thay thế.

## Khi user nói "CHỐT" để deploy
```bash
cd ~/Desktop/thenail-website
cp parallax-B-stack.html index.html        # B thành bản chính
rm -f _xem-mobile.html _mt.html _verify-*.png _real-menu.jpg   # xoá file preview/test
git add index.html images/ bot/             # bot/ = Worker + README trợ lý AI
git commit -m "Deploy variant B: sticky-stack + menu thật + song ngữ + trợ lý AI"
git push origin main                        # GitHub Pages build ~1-2 phút
```
(Kiểm tra OG image hiện đúng bằng FB Sharing Debugger sau khi live.)

## User context
- User = anh Hào (chủ tiệm = vợ, chị Trần Ngọc). Thích tiếng Việt, làm liên tục không dừng chờ, sau mỗi lần xong mở Chrome thật cho xem. Iterative, để ý chi tiết (bóng, gap, lệch px).
