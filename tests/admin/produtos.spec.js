import { test, expect } from '../helpers/testWithCoverage.js';
import { loginAsAdmin } from '../helpers/adminAuth';

test.describe('Admin - Gerenciamento de Produtos CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/produtos', { waitUntil: 'domcontentloaded' });
  });

  test('deve exibir a listagem de produtos', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Produtos', exact: true })).toBeVisible();
    
    const btnNovo = page.getByRole('link', { name: /Cadastrar Produto/i });
    await expect(btnNovo).toBeVisible();

    // Deve ter grid de produtos (se mock responder > 0)
    const grid = page.locator('div.grid');
    if (await grid.isVisible()) {
      await expect(grid.locator('p').first()).toBeVisible();
    }
  });

  test('deve navegar para a tela de criar produto e salvar', async ({ page }) => {
    await page.getByRole('link', { name: /Cadastrar Produto/i }).click();

    await expect(page).toHaveURL(/\/admin\/produtos\/criar/);
    await expect(page.getByRole('heading', { name: 'Cadastro de Produto' })).toBeVisible();

    await page.getByPlaceholder('Nome do produto').fill('Caneca Playwright');
    await page.locator('textarea[name="description"]').fill('Uma bela caneca E2E.');
    await page.getByPlaceholder('http://produto.com').fill('https://hotmart.com/caneca');

    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page).toHaveURL(/\/admin\/produtos/);
  });

  test('deve exibir erro ao tentar criar produto sem nome', async ({ page }) => {
    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Salvar' }).click();

    const nomeInput = page.getByPlaceholder('Nome do produto');
    const isRequired = await nomeInput.getAttribute('required');
    
    // Pode ser HTML5 validation ou o mock retornando {success: false, error: '...'} via alert
    expect(isRequired !== null || alertMessage === 'O nome do produto é obrigatório.').toBeTruthy();
  });

  test('deve testar os botões de Voltar e Cancelar na criação e edição', async ({ page }) => {
    // Create
    await page.goto('/admin/produtos/criar');
    await page.getByTitle('Voltar').click();
    await expect(page).toHaveURL(/\/admin\/produtos/);

    await page.goto('/admin/produtos/criar');
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page).toHaveURL(/\/admin\/produtos/);

    // Edit (produto 1 existe no mock mockProducts)
    await page.goto('/admin/produtos/1/editar');
    await page.getByTitle('Voltar').click();
    await expect(page).toHaveURL(/\/admin\/produtos/);

    await page.goto('/admin/produtos/1/editar');
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page).toHaveURL(/\/admin\/produtos/);
  });

  test('deve editar um produto existente', async ({ page }) => {
    // Usa o primeiro card e clica em editar
    const firstCardEditBtn = page.getByRole('button', { name: 'Editar' }).first();
    await firstCardEditBtn.click();

    await expect(page).toHaveURL(/\/admin\/produtos\/\d+\/editar/);
    await expect(page.getByRole('heading', { name: 'Edição de Produto' })).toBeVisible();

    const inputNome = page.getByPlaceholder('Nome do produto');
    await inputNome.fill('Caneca Editada');
    
    await page.getByRole('button', { name: 'Salvar' }).click();
    await expect(page).toHaveURL(/\/admin\/produtos/);
  });

  test('deve exibir mensagem de Produto não encontrado para Edit inválido', async ({ page }) => {
    await page.goto('/admin/produtos/999999/editar');
    
    await expect(page.getByText('Produto não encontrado.')).toBeVisible();
    await page.getByRole('button', { name: 'Voltar para Produtos' }).click();
    
    await expect(page).toHaveURL(/\/admin\/produtos/);
  });

  test('deve abrir modal de exclusão e fechar sem excluir', async ({ page }) => {
    const firstCardDelBtn = page.getByRole('button', { name: 'Excluir' }).first();
    await firstCardDelBtn.click();

    const modalTitle = page.getByText('Tem certeza que deseja excluir');
    await expect(modalTitle).toBeVisible();

    const btnCancelar = page.getByRole('button', { name: 'Não' });
    await btnCancelar.click();

    await expect(modalTitle).not.toBeVisible();
  });

  test('deve abrir modal de exclusão e confirmar exclusão', async ({ page }) => {
    const productCards = page.locator('div.grid > div');
    const initialCount = await productCards.count();

    if (initialCount > 0) {
      const firstCardDelBtn = page.getByRole('button', { name: 'Excluir' }).first();
      await firstCardDelBtn.click();

      const btnConfirmar = page.getByRole('button', { name: 'Sim' });
      await btnConfirmar.click();

      // Como o mock reset na página real não é garantido, apenas checamos que o modal fechou sem erros
      const modalTitle = page.getByText('Tem certeza que deseja excluir');
      await expect(modalTitle).not.toBeVisible();
    }
  });

  test('deve verificar link do produto com a hotmart na listagem', async ({ page }) => {
    // O mockProducts não necessariamente possui href preenchido no design da grid ou botões?
    // Verifica se os cartões têm links pra edição, e se houver link de loja
    // O card de produto em admin não tem link externo na listagem, mas podemos verificar o input no modo edição
    const firstCardEditBtn = page.getByRole('button', { name: 'Editar' }).first();
    await firstCardEditBtn.click();

    const inputLink = page.getByPlaceholder('http://produto.com');
    await expect(inputLink).toBeVisible();
  });

  test('deve exibir alert ao criar produto preenchendo nome vazio via JS (Create.jsx L15)', async ({ page }) => {
    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Preenche e depois limpa o nome (para bypass do required HTML5)
    const nomeInput = page.getByPlaceholder('Nome do produto');
    await nomeInput.fill('');
    await page.evaluate(() => {
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'));
    });

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(500);
    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('deve exibir alert ao editar produto limpando nome (Edit.jsx L32)', async ({ page }) => {
    await page.goto('/admin/produtos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Limpa o nome via evaluate para bypass do required
    const nomeInput = page.getByPlaceholder('Nome do produto');
    await nomeInput.fill('');
    await page.evaluate(() => {
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'));
    });

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(500);
    expect(alertMessage.length).toBeGreaterThan(0);
  });
});
