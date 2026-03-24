import { test, expect } from '@playwright/test';
import { personas } from '../config/personas';
import { openOnboarding, fillAndContinue } from '../helpers/onboarding';
import { waitForStableReport } from '../helpers/reportSignature';

// Determine a small subset of personas for visual testing – first, middle, last.
const indices = [0, Math.floor(personas.length / 2), personas.length - 1];
const selected = indices.map(index => personas[index]);

// Nightly visual regression tests for selected personas across browsers.
test.describe('Nightly – visual regression for selected personas', () => {
  for (const persona of selected) {
    test(`should match visual snapshot for ${persona.code}`, async ({ page, browserName }) => {
      await openOnboarding(page);
      await fillAndContinue(page, persona.code);
      await waitForStableReport(page);
      // Use Playwright’s built‑in snapshot comparison. The snapshot will be saved under
      // the test’s snapshots directory. The browserName is included in the name to avoid clashes.
      await expect(page).toHaveScreenshot(`${persona.code}-${browserName}.png`, {
        timeout: 0,
        // 15% threshold helps avoid false positives across browsers while catching major drift.
        threshold: 0.15,
      });
    });
  }
});