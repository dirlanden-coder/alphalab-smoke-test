import { test, expect } from '@playwright/test';

const ONBOARDING_FILE = 'ONBOARDING__STABILIZED__3STEP__P05__GREEK20__GREEK_LABELS__REVISED_BADGES__ALL_PASS__POINTS_TO_SCENARIO_OVERWRITE_GUARD_REPORT__POINTS_TO_SUGAR_AXIS_AUTHORITY_FINAL_HOTFIX%20v2.html';
const REPORT_FILE = 'AlphaLab_v16j__SCENARIO_OVERWRITE_GUARD__LOW_RISK_PATCH_v1__SUGAR_AXIS_AUTHORITY_FINAL_HOTFIX%20v2.html';

const PERSONAS = {
  maria: 'GR-MARIA-22-ATH',
  alexandra: 'GR-ALEXANDRA-23-ATH',
  panagiotis: 'GR-PANAGIOTIS-36-THESS',
  manolis: 'GR-MANOLIS-42-HER',
  myrto: 'GR-MYRTO-43-VOL',
  sofia: 'GR-SOFIA-44-PATRAS',
};

async function loadPersona(page, personaKey) {
  const jsErrors = [];
  page.on('pageerror', (err) => jsErrors.push(`pageerror:${err.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') jsErrors.push(`console:${msg.text()}`);
  });

  await page.goto(`/${ONBOARDING_FILE}`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#al-test-persona-select')).toBeVisible();
  await page.selectOption('#al-test-persona-select', personaKey);
  await page.click('#al-fill-and-continue-btn');
  await page.waitForURL(new RegExp(`${REPORT_FILE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1200);
  await expect.poll(async () => {
    const txt = await page.locator('#heroPhenotype').textContent();
    return (txt || '').trim();
  }, { timeout: 30000 }).not.toBe('—');
  await expect.poll(async () => {
    const txt = await page.locator('#finalClose #priorityList').textContent();
    return (txt || '').trim().length;
  }, { timeout: 30000 }).toBeGreaterThan(30);

  return jsErrors;
}

async function collectReportState(page) {
  const text = async (selector) => {
    const loc = page.locator(selector).first();
    if (await loc.count() === 0) return '';
    return ((await loc.textContent()) || '').trim();
  };

  const summaryParagraphs = page.locator('#finalClose #priorityList p');
  const summaryCount = await summaryParagraphs.count();

  return {
    heroPhenotype: await text('#heroPhenotype'),
    activePhenotypeTitle: await text('#activePhenotypeTitle'),
    activePhenotypeDesc: await text('#activePhenotypeDesc'),
    axisSugarInterp: await text('#axisSugarInterp'),
    masldCat: await text('#masldCat'),
    lgciCat: await text('#lgciCat'),
    finalNarrative: await text('#finalClose #priorityList'),
    summaryCount,
  };
}

function expectNoRuntimeErrors(errors) {
  const relevant = errors.filter((e) => !/favicon/i.test(e));
  expect(relevant, `Runtime errors:\n${relevant.join('\n')}`).toEqual([]);
}

function expectSingleNonEmptyNarrative(state) {
  expect(state.summaryCount).toBe(1);
  expect(state.finalNarrative.length).toBeGreaterThan(30);
}

test.describe('AlphaLab unified smoke test', () => {
  test('Maria calm control stays calm', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.maria);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.heroPhenotype || state.activePhenotypeTitle).toContain('Φυσιολογική');
    expect(state.heroPhenotype).not.toContain('αντίσταση στην ινσουλίνη');
    expect(state.finalNarrative).not.toMatch(/ήπαρ|ινσουλίν/i);
  });

  test('Alexandra borderline IR is softened and does not drift to liver', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.alexandra);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.heroPhenotype).toBe('Πιθανή ήπια αντίσταση στην ινσουλίνη');
    expect(state.axisSugarInterp).toMatch(/Ήπια|Ήπια προς μέτρια/);
    expect(state.masldCat).toMatch(/Καθόλου|Ήπια/);
    expect(state.finalNarrative).not.toMatch(/ήπαρ/i);
    expect(state.heroPhenotype).not.toBe('Κυρίως αντίσταση στην ινσουλίνη');
  });

  test('Clearly IR-dominant control remains strong', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.panagiotis);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.heroPhenotype).toMatch(/Κυρίως αντίσταση στην ινσουλίνη|Κυρίως διαταραχή ρύθμισης σακχάρου-ινσουλίνης/);
  });

  test('Real liver participation remains liver-led', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.manolis);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.heroPhenotype).toContain('ήπατος');
    expect(state.finalNarrative).toMatch(/ήπαρ/i);
  });

  test('False liver drift is blocked when sugars and inflammation are present without hepatic support', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.myrto);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.masldCat).toMatch(/Καθόλου|Ήπια/);
    expect(state.lgciCat).not.toBe('Προς εκτίμηση');
    expect(state.finalNarrative).not.toMatch(/ήπαρ/i);
  });

  test('LGCI-visible case preserves LGCI wording and classification', async ({ page }) => {
    const errors = await loadPersona(page, PERSONAS.sofia);
    const state = await collectReportState(page);

    expectSingleNonEmptyNarrative(state);
    expectNoRuntimeErrors(errors);
    expect(state.lgciCat).toMatch(/Ήπια προς μέτρια|Μέτρια|Σημαντική/);
  });
});
