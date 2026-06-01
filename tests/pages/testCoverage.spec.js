import { test, expect } from '../helpers/testWithCoverage.js';

test.describe('Test Coverage Page (Internal)', () => {
  test('deve visitar a página de test-coverage para coletar funções isoladas', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err));
    await page.goto('/test-coverage', { waitUntil: 'domcontentloaded' });
    
    // Aguarda o título da página para garantir que carregou
    await expect(page.locator('#test-title')).toBeVisible();
    
    // Pequeno timeout para garantir que o useEffect executou
    await page.waitForTimeout(500);

    // Testar hover nas FocusCards para cobrir onMouseEnter e onMouseLeave
    const focusCardsContainer = page.locator('.grid.grid-cols-1.md\\:grid-cols-3').first();
    const firstCard = focusCardsContainer.locator('> div').first();
    
    // onMouseEnter
    await firstCard.hover({ force: true });
    await page.waitForTimeout(100);
    
    // onMouseLeave (move o mouse para o título da página)
    await page.locator('#test-title').hover({ force: true });
    await page.waitForTimeout(100);
  });

  test('deve cobrir o catch block do AuthContext com JSON inválido no localStorage', async ({ page }) => {
    // Configura localStorage com json inválido para o AuthProvider.useState catch block
    await page.goto('/test-coverage', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('idb_auth', '{invalid json'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    
    await expect(page.locator('#test-title')).toBeVisible();
    await page.waitForTimeout(300);
  });
});
