// @ts-check
const { test, expect } = require('@playwright/test');

// ===== Tiện ích dùng chung =====

// Lọc tiếng ồn bên thứ ba (Google Maps, gstatic, GTM, favicon...) để tránh báo động giả
function laTiengOnBenThu3(url) {
  const u = (url || '').toLowerCase();
  return (
    u.includes('google') ||
    u.includes('gstatic') ||
    u.includes('googletagmanager') ||
    u.includes('maps') ||
    u.includes('favicon.ico')
  );
}

// Lấy số đầu tiên trong chuỗi giá, bỏ mọi ký tự khác (vd "250–300k" -> 250, "120000" -> 120000)
function soDauTien(chuoi) {
  const m = String(chuoi).replace(/,/g, '').match(/\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

// Chuẩn hoá về đơn vị nghìn đồng để so sánh (menu VI "120" = 120k, JSON-LD "120000" = 120k)
function veNghin(soThuc) {
  if (soThuc >= 1000) return Math.round(soThuc / 1000);
  return soThuc;
}

test.describe('A. Sống & tài nguyên', () => {
  const urlPhaiSong = [
    '/',
    '/en/',
    '/styles.css',
    '/main.js',
    '/en/styles.css',
    '/en/main.js',
    '/sitemap.xml',
    '/robots.txt',
    '/google98cb8ba1f49377d8.html',
  ];

  for (const duongDan of urlPhaiSong) {
    test(`URL "${duongDan}" phải trả về HTTP 200`, async ({ request, baseURL }) => {
      const res = await request.get(duongDan);
      expect(res.status(), `"${duongDan}" phải trả 200, thực tế ${res.status()}`).toBe(200);
    });
  }

  // Ghi chú nội bộ, mã nguồn bot và tài liệu dự án KHÔNG được xuất hiện trên tên miền
  // công khai. GitHub Pages mặc định phục vụ mọi file trong repo, nên phải chặn bằng
  // _config.yml (exclude) — và test này canh cho lỗi đó không tái diễn.
  const urlPhaiKhongTruyCapDuoc = [
    '/bot/wrangler.toml',
    '/bot/thenail-bot-worker.js',
    '/bot/README-chatbot.md',
    '/docs/state.md',
    '/docs/tech.md',
    '/README.md',
  ];

  for (const duongDan of urlPhaiKhongTruyCapDuoc) {
    test(`File nội bộ "${duongDan}" KHÔNG được truy cập công khai`, async ({ request }) => {
      const res = await request.get(duongDan);
      expect(
        res.status(),
        `"${duongDan}" đang phơi ra công khai (HTTP ${res.status()}) — file nội bộ không được nằm trên tên miền`
      ).toBeGreaterThanOrEqual(400);
    });
  }

  test('Ảnh og:image của trang VI phải tải được (HTTP 200)', async ({ page, request }) => {
    await page.goto('/');
    const noiDung = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(noiDung, 'Không tìm thấy thẻ meta og:image ở trang VI').toBeTruthy();
    const res = await request.get(/** @type {string} */ (noiDung));
    expect(res.status(), `Ảnh og:image trang VI (${noiDung}) phải trả 200`).toBe(200);
  });

  test('Ảnh og:image của trang EN phải tải được (HTTP 200)', async ({ page, request }) => {
    await page.goto('/en/');
    const noiDung = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(noiDung, 'Không tìm thấy thẻ meta og:image ở trang EN').toBeTruthy();
    const res = await request.get(/** @type {string} */ (noiDung));
    expect(res.status(), `Ảnh og:image trang EN (${noiDung}) phải trả 200`).toBe(200);
  });

  test('Sitemap.xml: mọi đường dẫn <loc> phải trả 200, và có đủ trang VI lẫn EN', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status(), 'sitemap.xml phải trả 200').toBe(200);
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    expect(locs.length, 'sitemap.xml phải có ít nhất 1 đường dẫn <loc>').toBeGreaterThan(0);
    expect(locs, 'sitemap.xml phải chứa trang chủ VI').toContain('https://thenail.vn/');
    expect(locs, 'sitemap.xml phải chứa trang EN').toContain('https://thenail.vn/en/');

    for (const loc of locs) {
      const r = await request.get(loc);
      expect(r.status(), `Đường dẫn trong sitemap "${loc}" phải trả 200, thực tế ${r.status()}`).toBe(200);
    }
  });
});

test.describe('B. Cấu trúc HTML đúng chỗ', () => {
  const cacTrang = [
    { ten: 'VI', duongDan: '/' },
    { ten: 'EN', duongDan: '/en/' },
  ];

  for (const { ten, duongDan } of cacTrang) {
    test(`<head> không bị vỡ trên trang ${ten}`, async ({ page }) => {
      await page.goto(duongDan);

      const kiemTraNamTrongHead = async (selector) => {
        const soLuong = await page.locator(selector).count();
        expect(soLuong, `Trang ${ten}: không tìm thấy thẻ "${selector}"`).toBeGreaterThan(0);
        const soNamNgoaiHead = await page.evaluate((sel) => {
          const els = Array.from(document.querySelectorAll(sel));
          return els.filter((el) => !document.head.contains(el)).length;
        }, selector);
        expect(soNamNgoaiHead, `Trang ${ten}: có thẻ "${selector}" nằm NGOÀI <head> — HTML có thể đã bị vỡ`).toBe(0);
      };

      await kiemTraNamTrongHead('meta[property="og:image"]');
      await kiemTraNamTrongHead('meta[property="og:title"]');
      await kiemTraNamTrongHead('link[rel="canonical"]');
      await kiemTraNamTrongHead('link[rel="stylesheet"]');
      await kiemTraNamTrongHead('script[type="application/ld+json"]');
    });

    test(`Không có văn bản rác ở đầu <body> trên trang ${ten}`, async ({ page }) => {
      await page.goto(duongDan);
      const chuKyDauTien = await page.evaluate(() => {
        const node = document.body.firstChild;
        if (!node) return '';
        return node.nodeType === Node.TEXT_NODE ? (node.textContent || '') : '';
      });
      expect(chuKyDauTien, 'Đầu <body> không được chứa "-->"').not.toContain('-->');
      expect(chuKyDauTien, 'Đầu <body> không được chứa "<!--"').not.toContain('<!--');
    });

    test(`Không có comment HTML lồng nhau trong mã nguồn thô trang ${ten}`, async ({ request }) => {
      const res = await request.get(duongDan);
      const html = await res.text();
      const comments = [...html.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]);
      expect(comments.length, `Trang ${ten}: phải có ít nhất 1 comment HTML để kiểm tra`).toBeGreaterThan(0);
      for (const noiDung of comments) {
        expect(noiDung, `Trang ${ten}: có comment HTML chứa "<!--" lồng bên trong — dấu hiệu comment bị vỡ`).not.toContain('<!--');
        expect(noiDung, `Trang ${ten}: có comment HTML chứa "-->" bên trong — dấu hiệu comment bị vỡ`).not.toContain('-->');
      }
    });

    test(`Không còn chuỗi placeholder trong HTML thô trang ${ten}`, async ({ request }) => {
      const res = await request.get(duongDan);
      const html = await res.text();
      const cacPlaceholder = ['DAN_MA_XAC_MINH_VAO_DAY', 'TODO', 'XXXXXXXXXX', 'lorem ipsum'];
      for (const p of cacPlaceholder) {
        const timThay = html.toLowerCase().includes(p.toLowerCase());
        expect(timThay, `Trang ${ten}: HTML còn sót chuỗi placeholder "${p}"`).toBe(false);
      }
    });
  }
});

test.describe('C. Dữ liệu nhất quán', () => {
  const cacTrang = [
    { ten: 'VI', duongDan: '/' },
    { ten: 'EN', duongDan: '/en/' },
  ];

  for (const { ten, duongDan } of cacTrang) {
    test(`Mọi khối JSON-LD trên trang ${ten} phải parse được`, async ({ page }) => {
      await page.goto(duongDan);
      const cacKhoi = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(cacKhoi.length, `Trang ${ten}: phải có ít nhất 1 khối JSON-LD`).toBeGreaterThan(0);
      cacKhoi.forEach((noiDung, i) => {
        expect(() => JSON.parse(noiDung), `Trang ${ten}: khối JSON-LD thứ ${i + 1} không parse được (sai cú pháp JSON)`).not.toThrow();
      });
    });
  }

  test('Giá khớp nhau giữa bảng menu, JSON-LD và câu trả lời FAQ (trang VI)', async ({ page }) => {
    await page.goto('/');

    // (a) Giá trong bảng menu
    const giaMenu = {};
    const rows = page.locator('#menu .menu-row');
    const soDong = await rows.count();
    for (let i = 0; i < soDong; i++) {
      const ten = (await rows.nth(i).locator('.mi-name').textContent() || '').trim();
      const gia = (await rows.nth(i).locator('.mi-price').textContent() || '').trim();
      giaMenu[ten] = gia;
    }

    // (b) hasOfferCatalog trong JSON-LD
    const cacKhoiLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    let offerCatalog = null;
    for (const noiDung of cacKhoiLd) {
      try {
        const parsed = JSON.parse(noiDung);
        if (parsed.hasOfferCatalog) {
          offerCatalog = parsed.hasOfferCatalog;
          break;
        }
      } catch (e) {
        // đã được kiểm ở test khác
      }
    }
    expect(offerCatalog, 'Không tìm thấy hasOfferCatalog trong JSON-LD trang VI').toBeTruthy();
    const giaJsonLd = {};
    for (const item of offerCatalog.itemListElement || []) {
      const ten = item.itemOffered && item.itemOffered.name;
      if (ten) giaJsonLd[ten] = item.price;
    }

    // (c) Câu trả lời FAQ — dùng textContent vì <details> đóng ẩn nội dung khỏi innerText,
    // nhưng nội dung vẫn nằm trong DOM (đây là "câu trả lời FAQ" thật, chỉ chưa mở ra xem)
    const vanBanFaq = (await page.locator('details').allTextContents()).join(' \n ');

    // Danh sách đối chiếu bắt buộc theo SPEC: tên menu -> tên trong JSON-LD -> giá (nghìn đồng)
    const doiChieu = [
      { tenMenu: 'Úp móng gel', tenJsonLd: 'Úp móng gel', gia: 120 },
      { tenMenu: 'Nối móng đắp gel', tenJsonLd: 'Nối móng đắp gel', gia: 250 },
      { tenMenu: 'Sơn thạch', tenJsonLd: 'Sơn thạch', gia: 90 },
      { tenMenu: 'Sơn nhũ', tenJsonLd: 'Sơn nhũ', gia: 110 },
      { tenMenu: 'Sơn BIAB', tenJsonLd: 'Sơn BIAB', gia: 130 },
      { tenMenu: 'Đắp gel móng thật', tenJsonLd: 'Đắp gel móng thật', gia: 200 },
      { tenMenu: 'Sơn gel', tenJsonLd: 'Sơn gel', gia: 70 },
    ];

    for (const { tenMenu, tenJsonLd, gia } of doiChieu) {
      // (a) menu
      expect(giaMenu[tenMenu], `Menu: không thấy dịch vụ "${tenMenu}"`).toBeTruthy();
      const giaMenuSo = veNghin(soDauTien(giaMenu[tenMenu]));
      expect(giaMenuSo, `Menu: "${tenMenu}" hiển thị "${giaMenu[tenMenu]}", kỳ vọng bắt đầu từ ${gia}`).toBe(gia);

      // (b) JSON-LD
      expect(giaJsonLd[tenJsonLd], `JSON-LD: không thấy dịch vụ "${tenJsonLd}" trong hasOfferCatalog`).toBeTruthy();
      const giaLdSo = veNghin(soDauTien(giaJsonLd[tenJsonLd]));
      expect(giaLdSo, `JSON-LD: "${tenJsonLd}" giá ${giaJsonLd[tenJsonLd]}, lệch so với menu (${gia}k) — sửa 1 chỗ quên chỗ khác`).toBe(gia);

      // (c) FAQ — chỉ kiểm khi câu trả lời FAQ có nhắc tới mốc giá x.000₫ tương ứng dịch vụ
      const moTaGiaFaq = `${gia}.000`;
      const coTrongFaq = vanBanFaq.includes(moTaGiaFaq);
      expect(coTrongFaq, `FAQ: không tìm thấy mốc giá "${moTaGiaFaq}₫" cho "${tenMenu}" trong nội dung câu trả lời FAQ hiển thị — có thể FAQ đang nêu giá cũ`).toBe(true);
    }
  });

  test('Số điện thoại và địa chỉ nhất quán trên trang VI (nội dung trang, JSON-LD, link Zalo/tel)', async ({ page }) => {
    await page.goto('/');

    const soDT = '0931415099';
    const diaChi = '517/15 Nguyễn Tri Phương';

    const noiDungTrang = await page.locator('body').innerText();
    const noiDungTrangGomSo = noiDungTrang.replace(/\s|\./g, '');
    expect(noiDungTrangGomSo.includes(soDT), `Nội dung trang phải chứa số điện thoại ${soDT}`).toBe(true);
    expect(noiDungTrang.includes(diaChi), `Nội dung trang phải chứa địa chỉ "${diaChi}"`).toBe(true);

    const cacKhoiLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const toanBoJsonLd = cacKhoiLd.join(' ');
    expect(toanBoJsonLd.includes(soDT), `JSON-LD phải chứa số điện thoại ${soDT} (điện thoại hoặc link Zalo)`).toBe(true);
    expect(toanBoJsonLd.includes(diaChi), `JSON-LD phải chứa địa chỉ "${diaChi}"`).toBe(true);

    const linkTel = await page.locator(`a[href="tel:${soDT}"]`).count();
    expect(linkTel, `Phải có ít nhất 1 link tel:${soDT}`).toBeGreaterThan(0);

    const linkZalo = await page.locator(`a[href*="zalo.me/${soDT}"]`).count();
    expect(linkZalo, `Phải có ít nhất 1 link Zalo chứa số ${soDT}`).toBeGreaterThan(0);
  });

  test('Bảng giá trang VI và EN phải khớp nhau', async ({ page, context }) => {
    // So khớp theo THỨ TỰ dòng trong bảng giá (không so theo nhãn data-en, vì cách diễn đạt
    // tiếng Anh của VI và EN có thể viết khác chữ nhau dù cùng 1 dịch vụ — đó không phải lỗi giá).
    await page.goto('/');
    let rows = page.locator('#menu .menu-row');
    let soDongVi = await rows.count();
    const giaVi = [];
    for (let i = 0; i < soDongVi; i++) {
      const tenVi = (await rows.nth(i).locator('.mi-name').textContent() || '').trim();
      const gia = (await rows.nth(i).locator('.mi-price').textContent() || '').trim();
      giaVi.push({ tenVi, gia });
    }

    const trangEn = await context.newPage();
    await trangEn.goto('/en/');
    rows = trangEn.locator('#menu .menu-row');
    const soDongEn = await rows.count();
    const giaEn = [];
    for (let i = 0; i < soDongEn; i++) {
      const tenEn = (await rows.nth(i).locator('.mi-name').textContent() || '').trim();
      const gia = (await rows.nth(i).locator('.mi-price').textContent() || '').trim();
      giaEn.push({ tenEn, gia });
    }
    await trangEn.close();

    expect(soDongVi, 'Bảng giá VI phải có ít nhất 1 dòng').toBeGreaterThan(0);
    expect(soDongEn, `Bảng giá EN có ${soDongEn} dòng, khác số dòng bảng giá VI (${soDongVi})`).toBe(soDongVi);

    for (let i = 0; i < soDongVi; i++) {
      const soVi = veNghin(soDauTien(giaVi[i].gia));
      const soEn = veNghin(soDauTien(giaEn[i].gia));
      expect(
        soEn,
        `Dòng ${i + 1} ("${giaVi[i].tenVi}"): VI hiển thị "${giaVi[i].gia}" nhưng EN ("${giaEn[i].tenEn}") hiển thị "${giaEn[i].gia}" — giá lệch nhau`
      ).toBe(soVi);
    }
  });
});

test.describe('D. Chạy thật (runtime)', () => {
  const cacTrang = [
    { ten: 'VI', duongDan: '/' },
    { ten: 'EN', duongDan: '/en/' },
  ];

  for (const { ten, duongDan } of cacTrang) {
    test(`Trang ${ten} không bị trắng (màn hình mở đầu tự tắt)`, async ({ page }) => {
      await page.goto(duongDan);
      await expect(page.locator('.loading-splash')).toHaveClass(/hidden/, { timeout: 6000 });
    });
  }

  for (const { ten, duongDan } of cacTrang) {
    test(`Trang ${ten} không có lỗi console từ mã của site`, async ({ page }) => {
      const loiThat = [];

      page.on('console', (msg) => {
        if (msg.type() !== 'error') return;
        const location = msg.location();
        if (laTiengOnBenThu3(location && location.url)) return;
        loiThat.push(msg.text());
      });
      page.on('pageerror', (err) => {
        loiThat.push(err.message);
      });

      await page.goto(duongDan);
      await page.waitForTimeout(2000);

      expect(loiThat, `Trang ${ten} có lỗi console từ mã của site:\n${loiThat.join('\n')}`).toEqual([]);
    });
  }

  for (const { ten, duongDan } of cacTrang) {
    test(`Trang ${ten} không có tài nguyên lỗi tải (404 trở lên)`, async ({ page }) => {
      const cacLoi = [];
      page.on('response', (res) => {
        if (res.status() >= 400 && !laTiengOnBenThu3(res.url())) {
          cacLoi.push(`${res.status()} — ${res.url()}`);
        }
      });
      await page.goto(duongDan);
      await page.waitForTimeout(2000);
      expect(cacLoi, `Trang ${ten} có tài nguyên tải lỗi:\n${cacLoi.join('\n')}`).toEqual([]);
    });
  }

  test('Xem ảnh gallery được: mở lightbox và đóng bằng Escape', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loading-splash')).toHaveClass(/hidden/, { timeout: 6000 });

    const theAnhDauTien = page.locator('.nail-card').first();
    await theAnhDauTien.scrollIntoViewIfNeeded();
    await theAnhDauTien.click();

    const lightbox = page.locator('.lightbox');
    await expect(lightbox, 'Click ảnh xong nhưng lightbox không mở (không có class "active")').toHaveClass(/active/, { timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(lightbox, 'Nhấn Escape nhưng lightbox không đóng (vẫn còn class "active")').not.toHaveClass(/active/, { timeout: 5000 });
  });

  test('Đổi ngôn ngữ chạy được trên trang VI', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loading-splash')).toHaveClass(/hidden/, { timeout: 6000 });

    await expect(page.locator('html')).toHaveAttribute('data-lang', 'vi', { timeout: 5000 });
    await page.locator('.lang-toggle').first().click();
    await expect(page.locator('html'), 'Click nút đổi ngôn ngữ nhưng data-lang không đổi sang "en"').toHaveAttribute('data-lang', 'en', { timeout: 5000 });
  });

  test('Bộ sưu tập ảnh đủ số lượng và không lỗi tải ảnh trong màn hình đầu', async ({ page }) => {
    await page.goto('/');
    const soLuongThe = await page.locator('.nail-card').count();
    expect(soLuongThe, `Chỉ đếm được ${soLuongThe} thẻ ảnh, kỳ vọng >= 90`).toBeGreaterThanOrEqual(90);

    const soAnhLoi = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('.nail-card img')).slice(0, 12);
      return imgs.filter((img) => img.complete && img.naturalWidth === 0).length;
    });
    expect(soAnhLoi, 'Có ảnh trong màn hình đầu bị lỗi tải (naturalWidth = 0)').toBe(0);
  });

  test('Form đặt lịch còn nguyên các ô nhập', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#b-name')).toHaveCount(1);
    await expect(page.locator('#b-phone')).toHaveCount(1);
    await expect(page.locator('#b-date')).toHaveCount(1);
    await expect(page.locator('#b-time')).toHaveCount(1);
    await expect(page.locator('#b-service')).toHaveCount(1);

    const nutGui = page.locator('#booking-form button[type="submit"], form:has(#b-name) button[type="submit"]');
    expect(await nutGui.count(), 'Không tìm thấy nút gửi trong form đặt lịch').toBeGreaterThan(0);
  });
});

test.describe('E. Dùng được trên điện thoại', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  const cacTrang = [
    { ten: 'VI', duongDan: '/' },
    { ten: 'EN', duongDan: '/en/' },
  ];

  for (const { ten, duongDan } of cacTrang) {
    test(`Trang ${ten} không tràn ngang ở khổ điện thoại 375px`, async ({ page }) => {
      await page.goto(duongDan);
      await expect(page.locator('.loading-splash')).toHaveClass(/hidden/, { timeout: 6000 });
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      expect(scrollWidth, `Trang ${ten} bị tràn ngang: scrollWidth=${scrollWidth} > innerWidth=${innerWidth}`).toBeLessThanOrEqual(innerWidth);
    });
  }

  test('Vùng chạm đủ lớn (>= 44px) cho các nút quan trọng trên di động', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loading-splash')).toHaveClass(/hidden/, { timeout: 6000 });

    const kiemTraVungCham = async (selector, ten) => {
      const soLuong = await page.locator(selector).count();
      if (soLuong === 0) return; // không có phần tử thì bỏ qua, tránh báo động giả
      for (let i = 0; i < soLuong; i++) {
        const el = page.locator(selector).nth(i);
        if (!(await el.isVisible())) continue;
        const box = await el.boundingBox();
        expect(box, `Không lấy được kích thước của "${ten}" #${i}`).toBeTruthy();
        if (box) {
          const duTieuChuan = box.width >= 44 && box.height >= 44;
          expect(duTieuChuan, `"${ten}" #${i} có vùng chạm ${Math.round(box.width)}x${Math.round(box.height)}px, nhỏ hơn 44x44px khuyến nghị`).toBe(true);
        }
      }
    };

    await kiemTraVungCham('.ni.phone a[href^="tel:"]', 'Link số điện thoại trên nav');
    await kiemTraVungCham('.lang-toggle', 'Nút đổi ngôn ngữ');
    await kiemTraVungCham('.map-actions a', 'Nút trong khu vực bản đồ');
  });
});
