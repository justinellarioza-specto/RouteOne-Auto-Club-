import { test, expect, Page } from '@playwright/test';

// The YouTube background video isn't needed for these checks
test.beforeEach(async ({ page }) => {
  await page.route('**/*youtube*/**', (r) => r.abort());
});

async function skipIntro(page: Page) {
  // The intro either lifts away by itself or ends on "Tap to enter" (first visit to the home page)
  const intro = page.locator('#race-start-intro');
  const enter = page.locator('#intro-enter-btn');
  await Promise.race([
    enter.waitFor({ state: 'visible', timeout: 8000 }).then(() => enter.click()).catch(() => {}),
    intro.waitFor({ state: 'detached', timeout: 8000 }).catch(() => {}),
  ]);
  await expect(intro).toHaveCount(0);
}

test('pages have their own links and the Back button works', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await expect(page).toHaveTitle('RouteOne Auto Club');

  await page.locator('header').getByRole('button', { name: 'Collection', exact: true }).click();
  await expect(page).toHaveURL(/#\/collection$/);
  await expect(page).toHaveTitle(/The collection/);

  await page.goBack();
  await expect(page.locator('#hero-heading')).toBeVisible();

  await page.goto('/#/contact');
  await skipIntro(page);
  await expect(page.locator('#contact-page')).toBeVisible();
});

test('a visitor books, and the admin sees it in the inbox', async ({ page }) => {
  const name = `Grader Test ${Date.now()}`;
  const future = new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10);

  await page.goto('/#/contact');
  await skipIntro(page);
  const form = page.locator('#contact-page form');
  await form.locator('input[type=text]').nth(0).fill(name);
  await form.locator('input[type=email]').fill('grader@example.com');
  await form.locator('input[type=text]').nth(1).fill('Track day enquiry');
  await form.locator('input[type=date]').fill(future);
  await form.locator('textarea').fill('Testing the booking flow.');
  await form.getByRole('button', { name: /send inquiry/i }).click();
  await expect(page.getByText(/inquiry dispatched/i)).toBeVisible();

  // Wrong password is rejected
  await page.locator('#nav-member-toggle').click();
  await page.locator('#login-id-input').fill('admin');
  await page.locator('#login-password-input').fill('wrong-password');
  await page.locator('#btn-submit-login').click();
  await expect(page.getByText('Wrong login ID or password.')).toBeVisible();

  // Correct password opens the admin inbox with the new request in it
  await page.locator('#login-password-input').fill('admin');
  await page.locator('#btn-submit-login').click();
  await page.locator('#nav-admin-portal-button').click();
  await expect(page.locator('#admin-inquiries-inbox')).toContainText(name);
});

test('no sideways scrolling on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/#/collection', '/#/services', '/#/contact']) {
    await page.goto(route);
    await skipIntro(page);
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `page ${route} scrolls sideways`).toBeLessThanOrEqual(0);
  }
});
