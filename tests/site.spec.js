// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads and has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Shakespeare/i);
  });

  test('has navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('CSS is loaded (page is styled)', async ({ page }) => {
    await page.goto('/');
    const styleLink = page.locator('link[rel="stylesheet"]');
    await expect(styleLink.first()).toBeAttached();
  });
});

test.describe('Blog index', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/blog/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('lists at least one essay with a navigable link', async ({ page }) => {
    await page.goto('/blog/');
    const postLinks = page.locator('a[href*="/posts/"]');
    await expect(postLinks.first()).toBeVisible();
    const count = await postLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('essay links from blog index navigate to readable content', async ({ page }) => {
    await page.goto('/blog/');
    const postLinks = page.locator('a[href*="/posts/"]');
    const firstHref = await postLinks.first().getAttribute('href');
    expect(firstHref).toBeTruthy();

    // Navigate to the first essay and verify content loads
    await postLinks.first().click();
    await expect(page).toHaveURL(/\/posts\//);
    await expect(page.locator('body')).toBeVisible();
    const content = page.locator('main, article, .content, #content, .post, .entry').first();
    await expect(content).toBeVisible();
  });
});

test.describe('Essay posts', () => {
  const essays = [
    { title: 'Hamlet', path: '/posts/Hamlet 33/' },
    { title: 'Justice in Twelfth Night', path: '/posts/Justice in Twelfth Night/' },
    { title: 'Courage in Romeo and Juliet', path: '/posts/Courage in Romeo and Juliet/' },
    { title: "Midsummer Night's Dream", path: "/posts/Midsummer Night's Dream 9/" },
    { title: "Constancy in The Winter's Tale", path: "/posts/Constancy in The Winter's Tale/" },
  ];

  for (const essay of essays) {
    test(`"${essay.title}" loads and has readable content`, async ({ page }) => {
      await page.goto(essay.path);
      await expect(page.locator('body')).toBeVisible();
      const content = page.locator('main, article, .content, #content, .post, .entry').first();
      await expect(content).toBeVisible();
    });
  }

  test('essays have navigation back to blog index', async ({ page }) => {
    await page.goto('/posts/Hamlet 33/');
    // There should be a link somewhere to the blog/essays listing
    const blogLink = page.locator('a[href*="/blog"], a[href*="essays"], nav a').first();
    await expect(blogLink).toBeVisible();
  });
});

