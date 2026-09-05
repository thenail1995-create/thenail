// @ts-check
const { test, expect } = require('@playwright/test');

function futureDateISO() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + 7);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

async function blockExternalConversionTraffic(page) {
  await page.context().route(/https:\/\/(www\.googletagmanager\.com|www\.google-analytics\.com)\//, (route) => route.abort());
  await page.context().route('https://zalo.me/**', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><title>Zalo test route</title>',
  }));
}

async function prepareBooking(page, useSubmitButton = false) {
  await page.goto('/');
  await page.locator('#b-name').fill('Khach Thu Nghiem');
  await page.locator('#b-phone').fill('0900000000');
  await page.locator('#b-date').fill(futureDateISO());
  await page.locator('#b-time').selectOption({ label: '10:00' });
  await page.locator('#b-service').selectOption({ index: 1 });
  await page.locator('#b-note').fill('Thong tin rieng tu');
  if (useSubmitButton) await page.locator('#booking-form button[type="submit"]').click();
  else await page.locator('#booking-form').evaluate((form) => form.requestSubmit());
  await expect(page.locator('#booking-modal')).toHaveClass(/active/);
}

test.describe('Booking conversion', () => {
  test('booking assets use the same cache-busting version and remain reachable', async ({ request }) => {
    const version = 'booking-conversion-20260905';
    const assets = [
      '/styles.css',
      '/main.js',
      '/en/styles.css',
      '/en/main.js',
    ];
    for (const asset of assets) {
      const response = await request.get(`${asset}?v=${version}`);
      expect(response.status(), `${asset} cache-busted URL must return 200`).toBe(200);
    }
    const viHtml = await (await request.get('/')).text();
    const enHtml = await (await request.get('/en/')).text();
    expect(viHtml).toContain(`/styles.css?v=${version}`);
    expect(viHtml).toContain(`/main.js?v=${version}`);
    expect(enHtml).toContain(`/en/styles.css?v=${version}`);
    expect(enHtml).toContain(`/en/main.js?v=${version}`);
  });

  test('clipboard rejection keeps the prepared request visible and lets the customer retry or open Zalo', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.reject(new Error('Clipboard denied')) },
      });
    });
    await prepareBooking(page);

    const preview = page.locator('#message-preview');
    await expect(preview).toHaveAttribute('readonly', '');
    await expect(preview).toHaveValue(/Khach Thu Nghiem/);
    await page.getByRole('button', { name: /copy/i }).click();
    await expect(page.locator('#booking-modal')).toHaveClass(/active/);
    await expect(page.locator('#booking-copy-status')).toContainText(/không thể tự copy/i);
    await expect(page.locator('#booking-modal a[href*="zalo.me"]')).toBeVisible();
  });

  test('clipboard success reports success, keeps the request open, and sends only allowed analytics without form data', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.addInitScript(() => {
      window.__copiedMessage = '';
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: (message) => { window.__copiedMessage = message; return Promise.resolve(); } },
      });
    });
    await prepareBooking(page);
    await page.getByRole('button', { name: /copy/i }).click();

    await expect(page.locator('#booking-copy-status')).toContainText(/đã copy/i);
    await expect(page.locator('#booking-modal')).toHaveClass(/active/);
    expect(await page.evaluate(() => window.__copiedMessage)).toContain('Khach Thu Nghiem');

    const popup = page.waitForEvent('popup', { timeout: 3000 });
    await page.locator('#booking-modal a[href*="zalo.me"]').click();
    const zaloPopup = await popup;
    await zaloPopup.waitForLoadState('domcontentloaded');
    expect(await zaloPopup.title()).toBe('Zalo test route');
    await zaloPopup.close();

    const events = await page.evaluate(() => window.dataLayer
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === 'event')
      .map((entry) => ({ name: entry[1], params: entry[2] || {} })));
    expect(events.map((event) => event.name)).toEqual([
      'booking_request_prepared',
      'booking_copy_success',
      'contact_click',
    ]);
    expect(events[2].params).toEqual({ channel: 'zalo', placement: 'booking_modal', language: 'vi' });
    expect(JSON.stringify(events)).not.toContain('Khach Thu Nghiem');
    expect(JSON.stringify(events)).not.toContain('0900000000');
    expect(JSON.stringify(events)).not.toContain('Thong tin rieng tu');
  });

  test('mobile exposes a direct Zalo CTA while the floating Zalo control is hidden', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('.mbar .mbar-cta[href*="zalo.me"]')).toBeVisible();
    await expect(page.locator('.zalo-float')).toBeHidden();
    const size = await page.locator('.mbar .mbar-cta').evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  });

  test('English page prepares an English request', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.goto('/en/');
    await page.locator('#b-name').fill('Test Guest');
    await page.locator('#b-phone').fill('0900000000');
    await page.locator('#b-date').fill(futureDateISO());
    await page.locator('#b-time').selectOption({ label: '10:00' });
    await page.locator('#b-service').selectOption({ index: 1 });
    await page.locator('#booking-form').evaluate((form) => form.requestSubmit());
    await expect(page.locator('#message-preview')).toHaveValue(/^Hello The Nail!/);
    await page.locator('.modal-close').click();
    await page.locator('.lang-toggle').first().evaluate((button) => button.click());
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'vi');
    await page.locator('#booking-form').evaluate((form) => form.requestSubmit());
    await expect(page.getByRole('button', { name: 'Đóng cửa sổ đặt lịch' })).toBeVisible();
  });

  test('root page language toggle prepares and reports the request in the selected language', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: () => Promise.resolve() },
      });
    });
    await page.goto('/');
    await page.locator('.lang-toggle').first().click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await expect(page.locator('.booking-form button[type="submit"]')).toHaveText('Prepare Zalo request →');
    await page.locator('#b-name').fill('Test Guest');
    await page.locator('#b-phone').fill('0900000000');
    await page.locator('#b-date').fill(futureDateISO());
    await page.locator('#b-time').selectOption({ label: '10:00' });
    await page.locator('#b-service').selectOption({ index: 1 });
    await page.locator('#booking-form').evaluate((form) => form.requestSubmit());
    await expect(page.locator('#message-preview')).toHaveValue(/^Hello The Nail!/);
    await expect(page.getByRole('button', { name: 'Close booking dialog' })).toBeVisible();
    await page.getByRole('button', { name: 'Copy message' }).click();
    await expect(page.locator('#booking-copy-status')).toContainText(/Message copied/);
  });

  test('missing clipboard API keeps the prepared request available to copy manually', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    });
    await prepareBooking(page);
    await page.getByRole('button', { name: /copy/i }).click();
    await expect(page.locator('#booking-modal')).toHaveClass(/active/);
    await expect(page.locator('#booking-copy-status')).toContainText(/không thể tự copy/i);
  });

  test('booking dialog traps keyboard focus, restores it on Escape, and can scroll to every action on a short screen', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    await page.setViewportSize({ width: 320, height: 568 });
    await prepareBooking(page, true);
    const modal = page.locator('#booking-modal');
    await expect(modal).toHaveClass(/active/);
    const closeBox = await page.locator('.modal-close').boundingBox();
    expect(closeBox).not.toBeNull();
    expect(closeBox.y).toBeGreaterThanOrEqual(0);
    expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(568);
    expect(closeBox.width).toBeGreaterThanOrEqual(44);
    expect(closeBox.height).toBeGreaterThanOrEqual(44);
    await page.locator('.modal-close').focus();
    await page.locator('.modal-close').press('Shift+Tab');
    await expect(page.locator('#booking-modal a[href*="zalo.me"]')).toBeFocused();
    await page.locator('#booking-modal a[href*="zalo.me"]').press('Tab');
    await expect(page.locator('.modal-close')).toBeFocused();
    await page.locator('#booking-modal a[href*="zalo.me"]').scrollIntoViewIfNeeded();
    await expect(page.locator('#booking-modal a[href*="zalo.me"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(modal).not.toHaveClass(/active/);
    await expect(page.locator('.booking-form button[type="submit"]')).toBeFocused();
  });

  test('existing header contact link sends only its fixed analytics fields', async ({ page }) => {
    await blockExternalConversionTraffic(page);
    for (const path of ['/', '/en/']) {
      await page.goto(path);
      const untagged = await page.locator('a[href^="tel:"], a[href*="zalo.me"], a[href*="instagram.com"], a[href*="facebook.com"], a[href*="threads.com"], a[href*="wa.me"]').evaluateAll((links) => links
        .filter((link) => !link.hasAttribute('data-contact-channel') || !link.hasAttribute('data-contact-placement'))
        .map((link) => link.getAttribute('href')));
      expect(untagged, `${path} has an untracked direct-contact link`).toEqual([]);
    }
    await page.goto('/');
    const headerPhone = page.locator('.ni.phone a[data-contact-channel="phone"]');
    await expect(headerPhone).toHaveAttribute('data-contact-placement', 'header');
    await headerPhone.evaluate((link) => link.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const events = await page.evaluate(() => window.dataLayer
      .map((entry) => Array.from(entry))
      .filter((entry) => entry[0] === 'event')
      .map((entry) => ({ name: entry[1], params: entry[2] || {} })));
    expect(events).toEqual([
      { name: 'contact_click', params: { channel: 'phone', placement: 'header', language: 'vi' } },
    ]);
    expect(JSON.stringify(events)).not.toContain('0931415099');
  });
});
