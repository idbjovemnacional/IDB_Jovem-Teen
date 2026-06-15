import { test, expect } from '../helpers/testWithCoverage.js';
import { loginAsAdmin } from '../helpers/adminAuth';
import { setupApiMock } from '../helpers/apiMock';

test.describe('Dashboard Admin', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);
    await page.goto('/admin');
  });

  test('deve exibir o título do Dashboard e sidebar ativa', async ({ page }) => {
    // Título da página
    const titulo = page.getByRole('heading', { name: 'Dashboard' });
    await expect(titulo).toBeVisible();

    // Sidebar text active (Dashboard)
    const sidebarTitle = page.locator('aside').getByText('Dashboard');
    await expect(sidebarTitle).toBeVisible();
  });

  test('deve renderizar o card de Próximos Eventos com lista e link Ver Todos', async ({ page }) => {
    const cardProximos = page.locator('div').filter({ hasText: /^Próximos EventosVer todos/ }).first();
    await expect(cardProximos).toBeVisible();

    const btnVerTodos = cardProximos.getByRole('link', { name: /Ver todos/i }).first();
    await expect(btnVerTodos).toBeVisible();

    // Testa navegação de "Ver todos"
    await btnVerTodos.click();
    await expect(page).toHaveURL(/\/admin\/eventos/);
  });

  test('deve renderizar o card de Eventos Anteriores com lista e link Ver Todos', async ({ page }) => {
    const cardAnteriores = page.locator('div').filter({ hasText: /^Eventos AnterioresVer todos/ }).first();
    await expect(cardAnteriores).toBeVisible();

    const btnVerTodos = cardAnteriores.getByRole('link', { name: /Ver todos/i }).first();
    await expect(btnVerTodos).toBeVisible();
    
    await btnVerTodos.click();
    await expect(page).toHaveURL(/\/admin\/eventos/);
  });

  test('deve exibir o mini calendário e verificar a navegação', async ({ page }) => {
    // Mês atual visível
    const mesAtual = page.locator('h3', { hasText: 'Calendário' });
    await expect(mesAtual).toBeVisible();
    
    // Verificar se algum dia da semana aparece
    await expect(page.getByText('DOM', { exact: true })).toBeVisible();
    
    // O calendário mini não tem botões de navegar meses, mostra só a semana atual. 
    // Logo, verificamos os horários.
    await expect(page.getByText('8:00')).toBeVisible();
    await expect(page.getByText('12:00')).toBeVisible();
    await expect(page.getByText('17:00')).toBeVisible();
  });

  test('deve testar os itens (Event Rows) da lista de eventos', async ({ page }) => {
    const cardProximos = page.locator('div').filter({ hasText: /^Próximos EventosVer todos/ }).first();
    
    // Verifica primeiro evento da lista
    const firstRowTitle = cardProximos.locator('.font-semibold.text-sm.text-\\[\\#1E1E1E\\].truncate').first();
    await expect(firstRowTitle).toBeVisible();
    
    // O botão Detalhes e Gerenciar Voluntários
    const btnDetalhes = cardProximos.getByRole('link', { name: 'Detalhes' }).first();
    const btnVols = cardProximos.getByRole('link', { name: 'Gerenciar Voluntários' }).first();
    
    await expect(btnDetalhes).toBeVisible();
    await expect(btnVols).toBeVisible();
  });

  test('deve exibir grid de Produtos Cadastrados com botão Ver Todos', async ({ page }) => {
    const cardProdutos = page.locator('div').filter({ hasText: /^Produtos CadastradosVer todos/ }).first();
    await expect(cardProdutos).toBeVisible();

    // Cards de produtos no grid
    const imgs = cardProdutos.locator('img');
    await expect(imgs.first()).toBeVisible();

    // Verifica que cada card tem um botão Detalhes
    const btnCardDetalhes = cardProdutos.getByRole('button', { name: 'Detalhes' }).first();
    await expect(btnCardDetalhes).toBeVisible();

    const btnVerTodos = cardProdutos.getByRole('link', { name: /Ver todos/i });
    await expect(btnVerTodos).toBeVisible();

    await btnVerTodos.click();
    await expect(page).toHaveURL(/\/admin\/produtos/);
  });
});
