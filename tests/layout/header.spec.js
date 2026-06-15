import { test, expect } from '../helpers/testWithCoverage.js';
import { setupApiMock } from '../helpers/apiMock';

test.describe('Header e Navegação Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
    await page.goto('/');
  });

  test('deve renderizar o logotipo corretamente e direcionar para home', async ({ page }) => {

    await page.setViewportSize({ width: 1280, height: 720 });
    const logoLink = page.locator('header').getByRole('link', { name: /IDB JOVEM/i });
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await expect(page).toHaveURL('/');
  });

  test('deve navegar pelos links mobile e fechar o menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Abre o menu
    const btnMenu = page.getByLabel('Menu');
    await btnMenu.click();
    await expect(page.locator('nav').last()).toBeVisible();

    // Clica em um link mobile
    const produtosMobileLink = page.locator('nav').last().locator('a', { hasText: 'Produtos' });
    await expect(produtosMobileLink).toBeVisible();
    await produtosMobileLink.click();

    // Menu fecha (aguarda animação)
    await page.waitForTimeout(500);

    // Abre novamente e clica em Eventos Próximos
    await btnMenu.click();
    const btnEventosProximos = page.locator('button', { hasText: 'Eventos próximos' }).last();
    await btnEventosProximos.click();
    await expect(page).toHaveURL(/.*eventos-proximos/);
  });

  test('deve exibir barra de pesquisa no desktop, permitir buscar e limpar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const searchInput = page.locator('input[placeholder="Pesquisar eventos..."]').first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('retiro');

    const clearBtn = page.locator('svg.lucide-x-circle').first();
    await clearBtn.waitFor({ state: 'visible' });
    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
  });

  test('deve abrir o evento correspondente ao pesquisar e pressionar Enter', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const searchInput = page.locator('input[placeholder="Pesquisar eventos..."]').first();
    await searchInput.fill('Camp');
    await searchInput.press('Enter');

    // A busca abre a página do primeiro evento sugerido (Acampamento Jovem)
    await expect(page).toHaveURL(/\/eventos\/\d+/);
  });

  test('deve exibir o botão "Eventos próximos" no desktop e redirecionar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const btnProxEventos = page.getByRole('button', { name: /Eventos próximos/i });
    await expect(btnProxEventos).toBeVisible();

    await btnProxEventos.click();
    await expect(page).toHaveURL(/\/eventos-proximos/);
  });

  test('deve navegar pelos links de navegação principais (Eventos, Galeria, Produtos, Contato)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const nav = page.locator('nav').first();

    // Eventos
    await nav.getByText('Eventos', { exact: true }).click();
    await expect(page).toHaveURL(/\/eventos/);

    // Galeria
    await nav.getByText('Galeria de fotos', { exact: true }).click();
    await expect(page).toHaveURL(/\/galeria/);

    // Contato
    await nav.getByText('Contato', { exact: true }).click();
    // O menu de contato usa scrollIntoView com preventDefault, a url não muda

    // Produtos (se a página existisse para usuário final seria testado, mas o click não deve quebrar)
    await page.goto('/');
    await nav.getByText('Produtos', { exact: true }).click();
  });

  test('deve navegar para home e rolar até a seção ao clicar em link hash partindo de outra página', async ({ page }) => {
    // Começa em outra página
    await page.goto('/eventos');
    await page.setViewportSize({ width: 1280, height: 720 });

    // Clica no link Contato (que é um hash link /#contato)
    const nav = page.locator('nav').first();
    await nav.getByText('Contato', { exact: true }).click();

    // Deve redirecionar para a home
    await expect(page).toHaveURL(/.*\/$/);

    // Aguarda o setTimeout de 100ms do header
    await page.waitForTimeout(200);
  });

  test('deve exibir o ícone de login na navegação que direciona para /login', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const btnLogin = page.locator('nav').first().getByRole('button');
    await expect(btnLogin).toBeVisible();

    await btnLogin.click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Menu Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMock(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
  });

  test('deve abrir o menu mobile e renderizar links e botão próximos eventos', async ({ page }) => {
    const btnMenu = page.getByLabel('Menu');
    await expect(btnMenu).toBeVisible();

    await btnMenu.click();

    const mobilePanel = page.locator('div.fixed.right-0').filter({ hasText: 'Eventos próximos' });
    await expect(mobilePanel).toBeVisible();

    await expect(mobilePanel.getByPlaceholder('Pesquisar eventos...')).toBeVisible();

    await expect(mobilePanel.getByText('Eventos', { exact: true })).toBeVisible();
    await expect(mobilePanel.getByText('Galeria de fotos', { exact: true })).toBeVisible();
    await expect(mobilePanel.getByText('Produtos', { exact: true })).toBeVisible();
    await expect(mobilePanel.getByText('Contato', { exact: true })).toBeVisible();

    const btnMobileProx = mobilePanel.getByRole('button', { name: /Eventos próximos/i });
    await expect(btnMobileProx).toBeVisible();
    await btnMobileProx.click();
    await expect(page).toHaveURL(/\/eventos-proximos/);
  });

  test('deve fechar o menu mobile ao clicar no overlay', async ({ page }) => {
    const btnMenu = page.getByLabel('Menu');
    await btnMenu.click();


    const overlay = page.locator('.fixed.inset-0.z-40');
    await expect(overlay).toBeVisible();

    // Fecha o menu clicando no overlay
    await overlay.click({ position: { x: 10, y: 100 } });

    // Menu e overlay desaparecem
    await expect(overlay).not.toBeVisible();
  });

  test('deve realizar busca no menu mobile e redirecionar', async ({ page }) => {
    const btnMenu = page.getByLabel('Menu');
    await btnMenu.click();

    const mobilePanel = page.locator('div.fixed.right-0').filter({ hasText: 'Eventos próximos' });
    const searchInput = mobilePanel.getByPlaceholder('Pesquisar eventos...');

    await searchInput.fill('Camp');
    await searchInput.press('Enter');

    // A busca abre a página do primeiro evento sugerido
    await expect(page).toHaveURL(/\/eventos\/\d+/);
  });

  test('deve redirecionar para login pelo ícone no cabeçalho mobile', async ({ page }) => {
    // Botão de login no mobile fica no header
    const btnLoginMobile = page.locator('.flex.lg\\:hidden a[href="/login"]');
    await expect(btnLoginMobile).toBeVisible();

    await btnLoginMobile.click();
    await expect(page).toHaveURL(/\/login/);
  });
});
