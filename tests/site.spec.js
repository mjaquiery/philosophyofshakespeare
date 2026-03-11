// @ts-check
const { test, expect } = require('@playwright/test');

test('homepage loads and has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Shakespeare/i);
});

test('homepage has navigation', async ({ page }) => {
  await page.goto('/');
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
});

test('blog index page loads', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('body')).toBeVisible();
  // Should have at least one post link
  const links = page.locator('a[href*="/posts/"]');
  await expect(links.first()).toBeVisible();
});

test('an essay post loads and has content', async ({ page }) => {
  await page.goto('/posts/Justice in Twelfth Night/');
  await expect(page.locator('body')).toBeVisible();
  const main = page.locator('main, article, .content, #content').first();
  await expect(main).toBeVisible();
});

test('hamlet post loads', async ({ page }) => {
  await page.goto('/posts/Hamlet 33/');
  await expect(page.locator('body')).toBeVisible();
});

test('CSS is loaded (page is styled)', async ({ page }) => {
  await page.goto('/');
  // Check that a stylesheet link is present
  const styleLink = page.locator('link[rel="stylesheet"]');
  await expect(styleLink.first()).toBeAttached();
});
