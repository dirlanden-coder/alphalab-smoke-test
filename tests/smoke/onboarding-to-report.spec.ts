import { test, expect } from '@playwright/test';
import { personas } from '../config/personas';
import { openOnboarding, fillAndContinue } from '../helpers/onboarding';
import { waitForStableReport, verifyCriticalNodes } from '../helpers/reportSignature';

// Smoke test: start from the onboarding page, select the first persona,
// advance to the report and verify that critical elements render correctly.

test.describe('Smoke – onboarding flow to report', () => {
  test('@smoke should load onboarding, select a persona and navigate to the report', async ({ page }) => {
    // Use the first persona in the list for the smoke test
    const persona = personas[0];
    await openOnboarding(page);
    await fillAndContinue(page, persona.code);
    // Wait for the report to settle
    await waitForStableReport(page);
    // Ensure that the report URL is reached
    expect(page.url()).toContain('/AlphaLab');
    // Validate that critical nodes exist
    await verifyCriticalNodes(page);
    // Reload once to ensure stability persists
    await page.reload();
    await waitForStableReport(page);
    await verifyCriticalNodes(page);
  });
});