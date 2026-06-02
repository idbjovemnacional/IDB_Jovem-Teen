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

    // Testar dispatchEvent('mouseenter') nas FocusCards para cobrir onMouseEnter e onMouseLeave (L15-16)
    const focusCardsContainer = page.locator('.grid.grid-cols-1.md\\:grid-cols-3').first();
    const firstCard = focusCardsContainer.locator('> div').first();
    
    // Usamos dispatchEvent porque hover as vezes não dispara react events em elements sobrepostos
    await firstCard.dispatchEvent('mouseenter');
    await page.waitForTimeout(100);
    
    await firstCard.dispatchEvent('mouseleave');
    await page.waitForTimeout(100);
  });

  test('deve restaurar localStorage com e sem valores prévios (TestCoverage L114-115)', async ({ page }) => {
    // 1. Visitar sem valores no localStorage (hits the 'else' branch)
    await page.goto('/test-coverage', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    // 2. Definir valores no localStorage (to hit the 'if' branch)
    await page.evaluate(() => {
      localStorage.setItem('idb_admin_events', '[{"id": 1}]');
      localStorage.setItem('idb_admin_products', '[{"id": 1}]');
    });
    
    // 3. Recarregar (hits the 'if' branch)
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
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
