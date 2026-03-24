import { test } from '@playwright/test';
import { REPORT_URL } from '../config/targets';
import { waitForStableReport, verifyCriticalNodes } from '../helpers/reportSignature';

// Smoke test: directly load the report URL and verify that critical
// elements render correctly without going through the onboarding flow.

test.describe('Smoke – direct report load', () => {
  test('@smoke should load the report directly and show critical nodes', async ({ page }) => {
    await page.goto(REPORT_URL, { waitUntil: 'domcontentloaded' });
    await waitForStableReport(page);
    await verifyCriticalNodes(page);
    // Reload once to ensure persistence
    await page.reload();
    await waitForStableReport(page);
    await verifyCriticalNodes(page);
  });
});