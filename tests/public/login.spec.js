import { test, expect } from '../helpers/testWithCoverage.js';
import { mockKeycloakLogin } from '../helpers/adminAuth';
import { setupApiMock } from '../helpers/apiMock';

test.describe('Página de Login', () => {

  test.beforeEach(async ({ page }) => {
    await mockKeycloakLogin(page);
    await setupApiMock(page);
    await page.goto('/login');
  });

  test('deve carregar a página e exibir o título "Faça o seu login"', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: 'Faça o seu login' });
    await expect(titulo).toBeVisible();
  });

  test('deve exibir os labels "Seu usuário:" e "Sua senha:"', async ({ page }) => {
    await expect(page.getByText('Seu usuário:')).toBeVisible();
    await expect(page.getByText('Sua senha:')).toBeVisible();
  });

  test('deve exibir os campos de usuário e senha com placeholders corretos', async ({ page }) => {
    const campoUsuario = page.getByPlaceholder('Digite seu usuário');
    const campoSenha = page.getByPlaceholder('Digite sua senha');
    await expect(campoUsuario).toBeVisible();
    await expect(campoSenha).toBeVisible();
  });

  test('deve exibir o botão de login', async ({ page }) => {
    const botaoLogin = page.getByRole('button', { name: 'Login' });
    await expect(botaoLogin).toBeVisible();
  });

  test('deve ter campo de senha com type "password" por padrão', async ({ page }) => {
    const inputSenha = page.locator('input[name="senha"]');
    await expect(inputSenha).toHaveAttribute('type', 'password');
  });

  test('deve permitir preencher os campos de usuário e senha', async ({ page }) => {
    const campoUsuario = page.getByPlaceholder('Digite seu usuário');
    const campoSenha = page.getByPlaceholder('Digite sua senha');

    await campoUsuario.fill('meu_usuario');
    await campoSenha.fill('minha_senha_secreta');

    await expect(campoUsuario).toHaveValue('meu_usuario');
    await expect(campoSenha).toHaveValue('minha_senha_secreta');
  });

  test('deve alternar a visibilidade da senha ao clicar no ícone do olho', async ({ page }) => {
    const inputSenha = page.locator('input[name="senha"]');

    await expect(inputSenha).toHaveAttribute('type', 'password');

    // Clica para mostrar
    await page.getByLabel('Mostrar senha').click();
    await expect(inputSenha).toHaveAttribute('type', 'text');

    // Clica para ocultar novamente
    await page.getByLabel('Ocultar senha').click();
    await expect(inputSenha).toHaveAttribute('type', 'password');
  });

  test('deve exibir mensagem de erro ao logar com credenciais inválidas', async ({ page }) => {
    await page.getByPlaceholder('Digite seu usuário').fill('usuario_errado');
    await page.getByPlaceholder('Digite sua senha').fill('senha_errada');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verifica se a mensagem de erro aparece
    await expect(page.getByText('Usuário ou senha inválidos')).toBeVisible();
  });

  test('deve fazer login com credenciais válidas e redirecionar para /admin', async ({ page }) => {
    await page.getByPlaceholder('Digite seu usuário').fill('idbjovem');
    await page.getByPlaceholder('Digite sua senha').fill('idbjovem');
    await page.getByRole('button', { name: 'Login' }).click();

    // Deve redirecionar para o painel admin
    await expect(page).toHaveURL(/\/admin/);
  });

  test('deve ter o header visível (MainLayoutNoFooter)', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('não deve ter footer na página de login', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toHaveCount(0);
  });
});
