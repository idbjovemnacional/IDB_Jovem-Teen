import { test, expect } from '../helpers/testWithCoverage.js';
import { loginAsAdmin } from '../helpers/adminAuth';

test.describe('Admin - Gerenciamento de Voluntários', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/voluntarios', { waitUntil: 'domcontentloaded' });
  });

  test('deve exibir a lista de eventos para voluntários', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Voluntários', exact: true })).toBeVisible();

    // Espera os cards carregarem
    const grid = page.locator('div.grid');
    if (await grid.isVisible()) {
      await expect(page.getByRole('link', { name: 'Voluntários Inscritos' }).first()).toBeVisible();
    }
  });

  test('deve navegar para a tela de detalhes de um evento', async ({ page }) => {
    const firstEventBtn = page.getByRole('link', { name: 'Voluntários Inscritos' }).first();
    await firstEventBtn.click();

    await expect(page).toHaveURL(/\/admin\/voluntarios\/\d+/);
  });
});

test.describe('Admin - Voluntários Detalhes da Tabela', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    // Vai direto para um evento
    await page.goto('/admin/voluntarios/1');
  });

  test('deve exibir as estatísticas (cards numéricos)', async ({ page }) => {
    await expect(page.getByText('Total de Inscritos')).toBeVisible();
    await expect(page.getByText('Aprovados', { exact: true })).toBeVisible();
    await expect(page.getByText('Pendentes')).toBeVisible();
  });

  test('deve exibir a tabela com dados dos voluntários e link pro forms', async ({ page }) => {
    // Header da tabela
    await expect(page.getByText('Nome', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Email', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Status', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Formulário', { exact: true }).first()).toBeVisible();

    // Link Abrir Formulário do primeiro
    const linkForms = page.getByRole('link', { name: /Abrir Formulário/i }).first();
    await expect(linkForms).toBeVisible();
  });

  test('deve permitir alterar o status no dropdown do StatusBadge para Aprovado', async ({ page }) => {
    // Acha o botão do dropdown
    const dropdownBtn = page.getByRole('button', { name: 'Pendente' }).first();
    await dropdownBtn.click();
    
    // Clica no novo status
    await page.locator('.absolute').getByRole('button', { name: 'Aprovado' }).click();
    
    await expect(page.getByRole('button', { name: 'Aprovado' }).first()).toBeVisible();
  });

  test('deve permitir alterar o status no dropdown do StatusBadge para Reprovado', async ({ page }) => {
    // Acha o botão do dropdown
    const dropdownBtn = page.getByRole('button', { name: 'Pendente' }).first();
    await dropdownBtn.click();
    
    // Clica no novo status
    await page.locator('.absolute').getByRole('button', { name: 'Reprovado' }).click();
    
    await expect(page.getByRole('button', { name: 'Reprovado' }).first()).toBeVisible();
  });

  test('deve ter botão de voltar na seção title', async ({ page }) => {
    const btnVoltar = page.locator('button[title="Voltar"]').first();
    await expect(btnVoltar).toBeVisible();
    await btnVoltar.click();
    await expect(page).toHaveURL(/\/admin\/voluntarios/);
  });

  test('deve abrir formulário em nova aba', async ({ page }) => {
    const linkForms = page.getByRole('link', { name: /Abrir Formulário/i }).first();
    await expect(linkForms).toBeVisible();

    // Verifica atributos target e rel
    await expect(linkForms).toHaveAttribute('target', '_blank');
    await expect(linkForms).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

test.describe('Admin - Voluntários Detalhes - Evento Não Encontrado', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('deve exibir mensagem de Evento não encontrado para ID inválido', async ({ page }) => {
    await page.goto('/admin/voluntarios/999999');
    
    await expect(page.getByText('Evento não encontrado.')).toBeVisible();
    await page.getByRole('button', { name: 'Voltar para Voluntários' }).click();
    
    await expect(page).toHaveURL(/\/admin\/voluntarios/);
  });
});

test.describe('Admin - Voluntários - Branch de linkFormularioVoluntarios', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('deve verificar atributo href do link Abrir Formulário (Details.jsx L86)', async ({ page }) => {
    // Visita voluntários de um evento existente
    await page.goto('/admin/voluntarios/1');
    
    const linkForms = page.getByRole('link', { name: /Abrir Formulário/i }).first();
    await expect(linkForms).toBeVisible();
    
    // Verifica se tem href (pode ser o link real ou '#' dependendo do mock)
    const href = await linkForms.getAttribute('href');
    expect(href).toBeTruthy();
  });
});
