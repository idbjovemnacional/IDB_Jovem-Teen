import { test, expect } from '../helpers/testWithCoverage.js';

test.describe('Página de Galeria', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/galeria');
  });

  test('deve exibir o título da galeria corretamente', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Galeria de fotos/i });
    await expect(titulo).toBeVisible();
    await expect(page.getByText('dos eventos')).toBeVisible();
  });

  test('deve exibir botão de voltar e funcionar corretamente', async ({ page }) => {
    // Vamos de outra página para testar o history.back()
    await page.goto('/');
    await page.goto('/galeria');

    const btnVoltar = page.getByLabel('Voltar');
    await expect(btnVoltar).toBeVisible();

    await btnVoltar.click();
    await expect(page).toHaveURL('/');
  });

  test('deve renderizar os cards de fotos no grid', async ({ page }) => {
    // Aguarda o grid carregar
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    // Verifica as imagens do mock local
    const imagens = gridContainer.locator('img');
    const count = await imagens.count();

    // Se mockGallery for populado, vai ter > 0
    if (count > 0) {
      await expect(imagens.first()).toBeVisible();

      // Verifica textos nos cards de galeria (evento e location mocados)
      const nomesEventos = gridContainer.locator('h3');
      await expect(nomesEventos.first()).toBeVisible();
    }
  });

  test('deve exibir localização nos cards de galeria', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    // Verifica os parágrafos de localização (photo.location)
    const locations = gridContainer.locator('p');
    const count = await locations.count();

    // Os 9 cards do mock devem ter localização
    expect(count).toBeGreaterThan(0);

    // Verifica localizações específicas do mock
    await expect(gridContainer.getByText('São Paulo, SP').first()).toBeVisible();
    await expect(gridContainer.getByText('Brasília, DF')).toBeVisible();
    await expect(gridContainer.getByText('Moçoro, RN')).toBeVisible();
  });

  test('deve ter alt text correto nas imagens da galeria', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    const imagens = gridContainer.locator('img');
    const count = await imagens.count();

    expect(count).toBeGreaterThan(0);

    // Alt text segue o padrão: "${photo.event} - ${photo.location}"
    for (let i = 0; i < count; i++) {
      const alt = await imagens.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      // Deve conter " - " separando evento e localização
      expect(alt).toContain(' - ');
    }

    // Verifica alt text específico
    await expect(imagens.first()).toHaveAttribute('alt', 'IDB Jovem & Teens One - São Paulo, SP');
  });

  test('deve renderizar todos os 9 cards de galeria do mock', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    // O mock useGallery tem 9 fotos
    const imagens = gridContainer.locator('img');
    expect(await imagens.count()).toBe(9);

    // Verifica nomes de eventos no grid
    const eventNames = gridContainer.locator('h3');
    expect(await eventNames.count()).toBe(9);

    // Verifica nomes de eventos específicos
    await expect(gridContainer.getByText('Teen Camp').first()).toBeVisible();
    await expect(gridContainer.getByText('ES NE AJO').first()).toBeVisible();
    await expect(gridContainer.getByText('Imersão 2025')).toBeVisible();
    await expect(gridContainer.getByText('Conferência SP')).toBeVisible();
    await expect(gridContainer.getByText('Encontro Manaus')).toBeVisible();
    await expect(gridContainer.getByText('Culto Jovem')).toBeVisible();
    await expect(gridContainer.getByText('Retiro Norte')).toBeVisible();
  });
});
