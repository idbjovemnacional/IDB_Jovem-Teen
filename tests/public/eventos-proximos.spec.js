import { test, expect } from '../helpers/testWithCoverage.js';
import { setupApiMock } from '../helpers/apiMock';

test.describe('Página Eventos Próximos', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
    await page.goto('/eventos-proximos');
  });

  test('deve exibir o título corretamente', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: 'Eventos mais Próximos de Você' });
    await expect(titulo).toBeVisible();
  });

  test('deve possuir um mapa (Leaflet) carregado', async ({ page }) => {
    // O mapa agora é renderizado com Leaflet (não mais um iframe do Google)
    const mapa = page.locator('.leaflet-container');
    await expect(mapa).toBeVisible({ timeout: 15000 });
  });

  test('deve possuir um botão para voltar', async ({ page }) => {
    // Vamos de / para /eventos-proximos para testar navegação de volta
    await page.goto('/');
    await page.goto('/eventos-proximos');

    const btnVoltar = page.getByLabel('Voltar');
    await expect(btnVoltar).toBeVisible();
    
    await btnVoltar.click();
    await expect(page).toHaveURL('/');
  });
});
