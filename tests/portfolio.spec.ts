import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const test = base.extend({
  request: async ({ request }, use) => {
    const wrapped = new Proxy(request, {
      get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver);
        if (typeof orig === 'function') {
          return (...args: any[]) => {
            if (
              typeof args[0] === 'string' &&
              args[0].startsWith('https://aoun62336.github.io/')
            ) {
              args[0] = args[0].replace('https://aoun62336.github.io/', '/');
            }
            return orig.apply(target, args);
          };
        }
        return orig;
      },
    });
    await use(wrapped);
  },
});

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

for (const route of routes) {
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

const evidenceCases = [
  { slug: 'assemblemonitor', imageCount: 3 },
  { slug: 'renewgrid', imageCount: 3 },
  { slug: 'callmissed', imageCount: 3 },
];

for (const { slug, imageCount } of evidenceCases) {
  test(`${slug} evidence images and original links work`, async ({
    page,
    request,
  }) => {
    await page.goto(`/work/${slug}/`);

    const links = page.locator('.engineering-evidence__image-link');
    await expect(links).toHaveCount(imageCount);

    for (const link of await links.all()) {
      await link.scrollIntoViewIfNeeded();
      const img = link.locator('img');

      await expect.poll(async () => {
        return img.evaluate((element) => {
          return (element as HTMLImageElement).naturalWidth;
        });
      }).toBeGreaterThan(0);

      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();

      const response = await request.get(href!);
      expect(response.status()).toBe(200);
    }
  });
}

test('case-study reading progress updates on scroll', async ({
  page,
}) => {
  await page.goto('/work/renewgrid/');

  const progressBar = page.locator('.reading-progress__bar');

  await expect(progressBar).toHaveCount(1);

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';

    window.scrollTo(
      0,
      document.documentElement.scrollHeight,
    );
  });

  await expect
    .poll(async () => {
      return progressBar.evaluate((element) => {
        const transform = getComputedStyle(element).transform;

        return new DOMMatrixReadOnly(transform).m11;
      });
    })
    .toBeGreaterThan(0.95);
});

test('mobile navigation exposes its open and closed states', async ({
  page,
}) => {
  await page.setViewportSize({
    width: 390,
    height: 844,
  });

  await page.goto('/');

  const menu = page.locator('.mobile-nav');
  const toggle = menu.locator('summary');

  await expect(menu).not.toHaveAttribute('open', '');

  await toggle.click();

  await expect(menu).toHaveAttribute('open', '');

  await toggle.click();

  await expect(menu).not.toHaveAttribute('open', '');
});

test('project card hover works after scroll reveal', async ({
  page,
}) => {
  await page.setViewportSize({
    width: 1280,
    height: 900,
  });

  await page.goto('/');

  const card = page.locator('.project-card').first();

  await card.scrollIntoViewIfNeeded();

  await expect(card).toHaveClass(/is-visible/);

  await card.hover();

  await expect
    .poll(async () => {
      return card.evaluate((element) => {
        const transform = getComputedStyle(element).transform;

        return new DOMMatrixReadOnly(transform).m42;
      });
    })
    .toBeLessThan(-3);
});


test('all case studies provide working section navigation', async ({
  page,
}) => {
  const projects = [
    'assemblemonitor',
    'renewgrid',
    'callmissed',
  ];

  for (const project of projects) {
    await page.goto(`/work/${project}/`);

    const contents = page.getByRole('navigation', {
      name: 'Case study contents',
    });

    await expect(contents).toBeVisible();

    const summary = contents.locator('summary');

    await summary.click();

    const links = contents.getByRole('link');

    const count = await links.count();

    expect(
      count,
      `${project} should have major article sections`,
    ).toBeGreaterThan(0);

    const firstLink = links.first();

    const href = await firstLink.getAttribute('href');

    expect(href).toMatch(/^#[a-zA-Z0-9_-]+$/);

    const target = page.locator(href!);

    await expect(target).toHaveCount(1);

    await firstLink.click();

    await expect
      .poll(() => new URL(page.url()).hash)
      .toBe(href);

    await expect(target).toBeInViewport();
  }
});

test('case studies fit narrow mobile screens', async ({ page }) => {
  const routes = [
    '/work/assemblemonitor/',
    '/work/renewgrid/',
    '/work/callmissed/',
  ];

  const widths = [320, 360, 390];

  for (const width of widths) {
    await page.setViewportSize({
      width,
      height: 800,
    });

    for (const route of routes) {
      await page.goto(route);

      const heading = page.getByRole('heading', {
        level: 1,
      });

      await expect(heading).toBeVisible();

      const overflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
        );
      });

      expect(
        overflow,
        `${route} overflows at ${width}px`,
      ).toBeLessThanOrEqual(1);

      const metadata = page.locator('.case-meta > div');

      await expect(metadata).toHaveCount(3);

      const role = await metadata.nth(0).boundingBox();
      const period = await metadata.nth(1).boundingBox();
      const source = await metadata.nth(2).boundingBox();

      expect(role).not.toBeNull();
      expect(period).not.toBeNull();
      expect(source).not.toBeNull();

      // Period and source share the second metadata row.
      expect(
        Math.abs(period!.y - source!.y),
      ).toBeLessThanOrEqual(3);

      expect(role!.y).toBeLessThan(period!.y);
    }
  }
});

test("current resume is available as a PDF", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const resumeLink = page.getByRole("link", {
    name: /Download resume/i,
  });

  await expect(resumeLink).toBeVisible();

  await expect(resumeLink).toHaveAttribute(
    "href",
    "/resume/Aoun_MD_Resume.pdf",
  );

  const response = await request.get(
    "/resume/Aoun_MD_Resume.pdf",
  );

  expect(response.status()).toBe(200);

  const contentType =
    response.headers()["content-type"] ?? "";

  expect(contentType).toContain("application/pdf");

  const bytes = await response.body();

  expect(
    bytes.subarray(0, 4).toString("ascii"),
  ).toBe("%PDF");
});

test("social preview metadata and images are valid", async ({
  page,
  request,
}) => {
  const pages = [
    {
      route: "/",
      image: "home.png",
    },
    {
      route: "/work/assemblemonitor/",
      image: "assemblemonitor.png",
    },
    {
      route: "/work/renewgrid/",
      image: "renewgrid.png",
    },
    {
      route: "/work/callmissed/",
      image: "callmissed.png",
    },
  ];

  for (const item of pages) {
    await page.goto(item.route);

    const imageURL = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");

    expect(imageURL).toBe(
      `https://aoun62336.github.io/og/${item.image}`,
    );

    const response = await request.get(imageURL!);

    expect(response.status()).toBe(200);

    const bytes = await response.body();

    expect(
      bytes.subarray(0, 8).toString("hex"),
    ).toBe("89504e470d0a1a0a");
  }
});

test("architecture explorer switches between three views", async ({
  page,
}) => {
  await page.goto("/");

  const explorer = page.locator(
    "[data-architecture-explorer]",
  );

  await expect(explorer).toBeVisible();

  const tabs = explorer.getByRole("tab");

  await expect(tabs).toHaveCount(3);

  await expect(tabs.nth(0)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await tabs.nth(1).click();

  await expect(tabs.nth(1)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await expect(
    explorer.getByRole("tabpanel", {
      name: /CI\/CD and GitOps/i,
    }),
  ).toBeVisible();

  await tabs.nth(2).click();

  await expect(tabs.nth(2)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await expect(
    explorer.getByRole("tabpanel", {
      name: /Observability/i,
    }),
  ).toBeVisible();
});

test("architecture explorer supports keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");

  const explorer = page.locator(
    "[data-architecture-explorer]",
  );

  const tabs = explorer.getByRole("tab");

  await tabs.nth(0).focus();

  await page.keyboard.press("ArrowRight");

  await expect(tabs.nth(1)).toBeFocused();

  await expect(tabs.nth(1)).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.keyboard.press("End");

  await expect(tabs.nth(2)).toBeFocused();

  await page.keyboard.press("Home");

  await expect(tabs.nth(0)).toBeFocused();

  await expect(tabs.nth(0)).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("architecture explorer does not overflow mobile screens", async ({
  page,
}) => {
  for (const width of [320, 360, 390, 768]) {
    await page.setViewportSize({
      width,
      height: 800,
    });

    await page.goto("/");

    const explorer = page.locator(
      "[data-architecture-explorer]",
    );

    await expect(explorer).toBeVisible();

    const overflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
      );
    });

    expect(
      overflow,
      `Unexpected page overflow at ${width}px`,
    ).toBeLessThanOrEqual(1);
  }
});
