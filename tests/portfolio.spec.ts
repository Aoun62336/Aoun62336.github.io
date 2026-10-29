import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/work/',
  '/work/assemblemonitor/',
  '/work/renewgrid/',
  '/work/callmissed/',
  '/about/',
  '/site/',
];

test('all portfolio routes load successfully', async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);

    expect(
      response?.status(),
      `Expected ${route} to return HTTP 200`,
    ).toBe(200);
  }
});

test('homepage contains the main identity and photograph', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toContainText('Aoun Md.');

  await expect(
    page.getByRole('img', {
      name: 'Portrait of Aoun Md.',
    }),
  ).toBeVisible();

  await expect(
    page.locator('.project-card'),
  ).toHaveCount(3);
});

test('project navigation works', async ({ page }) => {
  await page.goto('/work/');

  await page
    .getByRole('link', { name: 'Read case study' })
    .first()
    .click();

  await expect(page).toHaveURL(/\/work\/assemblemonitor\/$/);

  await expect(
    page.getByRole('heading', {
      name: 'AssembleMonitor',
      exact: true,
    }),
  ).toBeVisible();
});

test('mobile navigation works at 320px', async ({ page }) => {
  await page.setViewportSize({
    width: 320,
    height: 640,
  });

  await page.goto('/');

  await page.locator('.mobile-nav summary').click();

  await expect(
    page.getByRole('navigation', {
      name: 'Mobile navigation',
    }),
  ).toBeVisible();

  await page
    .getByRole('navigation', {
      name: 'Mobile navigation',
    })
    .getByRole('link', { name: 'About' })
    .click();

  await expect(page).toHaveURL(/\/about\/$/);
});

test('pages do not cause horizontal viewport overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({
      width,
      height: 844,
    });

    await page.goto('/');

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(
      overflow,
      `Unexpected horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(1);
  }
});

test('reduced-motion preference keeps content accessible', async ({ page }) => {
  await page.emulateMedia({
    reducedMotion: 'reduce',
  });

  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toBeVisible();

  const scrollBehavior = await page.evaluate(() => {
    return getComputedStyle(
      document.documentElement,
    ).scrollBehavior;
  });

  expect(scrollBehavior).toBe('auto');
});

test('keyboard users can reach the skip link', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');

  await expect(
    page.getByRole('link', {
      name: 'Skip to content',
    }),
  ).toBeFocused();
});

for (const route of ['/', '/work/', '/about/', '/work/assemblemonitor/']) {
  test(`automated accessibility checks pass on ${route}`, async ({ page }) => {
    await page.goto(route);

    // Wait for entrance transitions (such as data-reveal animations) to finish settling
    await page.evaluate(() => {
      return Promise.all(
        document.getAnimations().map((animation) => animation.finished),
      );
    });

    const results = await new AxeBuilder({ page })
      .withTags([
        'wcag2a',
        'wcag2aa',
        'wcag21aa',
        'wcag22aa',
      ])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}