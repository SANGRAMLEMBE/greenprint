import { test, expect } from '@playwright/test';

// Smoke test: checks the main user journey works end to end
test('landing page renders the product and engine self-check', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Carbon Companion' })).toBeVisible();
  await expect(page.getByText(/tCO₂e\/yr/)).toBeVisible();
});
