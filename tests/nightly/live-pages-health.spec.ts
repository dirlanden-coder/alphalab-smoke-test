import { test, expect } from '@playwright/test';
import { ONBOARDING_URL, REPORT_URL } from '../config/targets';

// Nightly health checks verify that the live pages are reachable and respond with a 2xx status code.

test.describe('Nightly – live pages health', () => {
  const urls = [ONBOARDING_URL, REPORT_URL];
  for (const url of urls) {
    test(`should successfully load ${url}`, async ({ page }) => {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response && response.ok(), `Response for ${url} is not OK`).toBeTruthy();
      const title = await page.title();
      expect(title).not.toBe('');
    });
  }
});