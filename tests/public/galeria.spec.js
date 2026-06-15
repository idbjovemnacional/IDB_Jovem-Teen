import { test, expect } from '../helpers/testWithCoverage.js';
import { setupApiMock } from '../helpers/apiMock';

test.describe('Página de Galeria', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
    await page.goto('/galeria');
  });

  test('deve exibir o título da galeria corretamente', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Galeria de fotos/i });
    await expect(titulo).toBeVisible();
    await expect(page.getByText('dos eventos')).toBeVisible();
  });

  test('deve exibir botão de voltar e funcionar corretamente', async ({ page }) => {
    // Vamos de outra página para testar o historico
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

    // Verifica as imagens agregadas dos eventos com galeria
    const imagens = gridContainer.locator('img');
    await expect(imagens.first()).toBeVisible();

    // Verifica textos nos cards de galeria
    const nomesEventos = gridContainer.locator('h3');
    await expect(nomesEventos.first()).toBeVisible();
  });

  test('deve exibir localização nos cards de galeria', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    // Os cards devem ter localização
    const locations = gridContainer.locator('p');
    const count = await locations.count();
    expect(count).toBeGreaterThan(0);

    // Localizações específicas das fixtures
    await expect(gridContainer.getByText('Sítio Boa Vista').first()).toBeVisible();
    await expect(gridContainer.getByText('Centro de Convenções')).toBeVisible();
  });

  test('deve ter alt text correto nas imagens da galeria', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    const imagens = gridContainer.locator('img');
    const count = await imagens.count();
    expect(count).toBeGreaterThan(0);

    // Alt text segue o padrão "Evento - Local"
    for (let i = 0; i < count; i++) {
      const alt = await imagens.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt).toContain(' - ');
    }

    // Verifica alt text específico (primeira foto do evento 1)
    await expect(imagens.first()).toHaveAttribute('alt', 'Retiro de Verão - Sítio Boa Vista');
  });

  test('deve agregar as fotos dos eventos que possuem galeria', async ({ page }) => {
    const gridContainer = page.locator('section > div.grid');
    await expect(gridContainer).toBeVisible();

    // As fixtures têm 2 fotos do evento 1 e 1 foto do evento 3 → 3 cards
    const imagens = gridContainer.locator('img');
    expect(await imagens.count()).toBe(3);

    const eventNames = gridContainer.locator('h3');
    expect(await eventNames.count()).toBe(3);

    await expect(gridContainer.getByText('Retiro de Verão').first()).toBeVisible();
    await expect(gridContainer.getByText('Congresso 2020').first()).toBeVisible();
  });
});
