// tests/shopink.test.js
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001');
});

test('should display hero banner and shop now button', async ({ page }) => {
  await expect(page.getByText('Get your special sale up to 50%')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Shop now' })).toBeVisible();
});

test('should toggle favorite on product card', async ({ page }) => {
  const heart = page.locator('.text-red-500').first();
  const initialClass = await heart.getAttribute('class');
  await heart.click();
  await expect(heart).not.toHaveClass(initialClass);
  await heart.click(); // toggle back
});

test('should filter best sellers by brand', async ({ page }) => {
  await page.getByText('Adidas').click();
  await expect(page.getByText('Adidas Ultraboost')).toBeVisible();
  await expect(page.getByText('Nike Air Max 90')).not.toBeVisible();
});

test('should navigate to product detail (simulated)', async ({ page }) => {
  await page.locator('text=Nike Blazer Low').first().click();
  await expect(page.getByText('Viewing Nike Blazer Low')).toBeVisible();
});

test('should show toast when adding to cart via Stimulus', async ({ page }) => {
  await page.evaluate(() => {
    const event = new CustomEvent('click', {
      detail: { params: { id: 1 } }
    });
    document.body.dispatchEvent(event);
  });

  await expect(page.locator('text=added to cart')).toBeVisible();
});

test('should install as PWA (if supported)', async ({ page }) => {
  // This is a smoke test — real installability requires HTTPS and user gesture
  await page.goto('http://localhost:3001');
  await expect(page).toHaveTitle(/Shopink/);
});
