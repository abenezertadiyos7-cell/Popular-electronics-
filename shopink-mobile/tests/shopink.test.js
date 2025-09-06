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
  await heart.click();
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

test('should login successfully', async ({ page }) => {
  await page.getByText('Login').click();
  await page.fill('input[placeholder="Email"]', 'user@example.com');
  await page.fill('input[placeholder="Password"]', 'password123');
  await page.click('button:text("Login")');
  await expect(page.getByText('Hi, John')).toBeVisible();
});

test('should toggle dark mode', async ({ page }) => {
  const sunIcon = page.locator('span:has-text("☀️")');
  await expect(sunIcon).toBeVisible();
  await page.click('button:has-text("☀️")');
  const moonIcon = page.locator('span:has-text("🌙")');
  await expect(moonIcon).toBeVisible();
});

test('should switch language', async ({ page }) => {
  await page.selectOption('select', 'es');
  await expect(page.getByText('¡Consigue tu oferta especial de hasta el 50%!')).toBeVisible();
});

test('should open chatbot and send message', async ({ page }) => {
  await page.click('button:has-text("💬")');
  await page.fill('input[placeholder="Ask me anything..."]', 'Hello bot');
  await page.press('input[placeholder="Ask me anything..."]', 'Enter');
  await expect(page.locator('div:text("👤 Hello bot")')).toBeVisible();
});
