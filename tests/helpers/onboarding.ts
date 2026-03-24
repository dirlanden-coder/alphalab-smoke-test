import { Page, expect } from '@playwright/test';
import { ONBOARDING_URL } from '../config/targets';

/**
 * Navigate to the onboarding page and wait for the DOM to be ready.
 */
export async function openOnboarding(page: Page): Promise<void> {
  await page.goto(ONBOARDING_URL, { waitUntil: 'domcontentloaded' });
  // Ensure the persona selector is present before interacting
  await page.locator('#al-test-persona-select').waitFor({ state: 'visible' });
}

/**
 * Select a persona in the test persona dropdown. The code must match the value attribute.
 */
export async function selectPersona(page: Page, code: string): Promise<void> {
  const selector = page.locator('#al-test-persona-select');
  await selector.selectOption(code);
}

/**
 * Select the given persona and click the “fill and continue” button to advance to the report.
 * Waits for the URL to change to a report URL containing `AlphaLab`.
 */
export async function fillAndContinue(page: Page, code: string): Promise<void> {
  await selectPersona(page, code);
  const continueButton = page.locator('#al-fill-and-continue-btn');
  await continueButton.waitFor({ state: 'visible' });
  // Ensure button is enabled
  await expect(continueButton).toBeEnabled();
  await continueButton.click();
  // Wait until navigation to the report page occurs
  await page.waitForURL('**/AlphaLab*', { timeout: 20000 });
}