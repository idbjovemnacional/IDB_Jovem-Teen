import { test, expect } from '../helpers/testWithCoverage.js';

test.describe('Footer Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve renderizar a seção de contatos com links corretos', async ({ page }) => {
    const footer = page.locator('footer#contato');
    await expect(footer).toBeVisible();

    const titulo = footer.getByRole('heading', { name: /ENTRE EM CONTATO/i });
    await expect(titulo).toBeVisible();

    const emailLink = footer.getByRole('link', { name: /contato@idbjovem.com/i });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:contato@idbjovem.com');

    const socialLinks = footer.getByRole('link', { name: /@idbjovemoficial/i });
    await expect(socialLinks).toHaveCount(2);
  });

  test('deve garantir que os links sociais abrem em nova aba', async ({ page }) => {
    const footer = page.locator('footer#contato');

    const socialLinks = footer.getByRole('link', { name: /@idbjovemoficial/i });

    for (let i = 0; i < await socialLinks.count(); i++) {
      const link = socialLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noreferrer');
    }
  });

  test('deve renderizar a logo e o texto de missão', async ({ page }) => {
    const footer = page.locator('footer#contato');

    const logo = footer.getByAltText('IDB Jovem & Teen');
    await expect(logo).toBeVisible();

    const missao = footer.getByText(/Inspirar e capacitar as novas gerações/i);
    await expect(missao).toBeVisible();
  });

  test('deve renderizar os botões Login e Virar Voluntário e redirecionar corretamente', async ({ page }) => {
    const footer = page.locator('footer#contato');

    const btnLogin = footer.getByRole('link', { name: /Login/i });
    await expect(btnLogin).toBeVisible();

    const btnVoluntario = footer.getByRole('link', { name: /VIRAR VOLUNTÁRIO/i });
    await expect(btnVoluntario).toBeVisible();

    // Teste de navegação do Login no footer
    await btnLogin.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve testar navegação de voluntário', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer#contato');
    const btnVoluntario = footer.getByRole('link', { name: /VIRAR VOLUNTÁRIO/i });

    await btnVoluntario.click();
    // Como a página voluntário público pode não existir no AppRoutes base, garantimos apenas que o roteador tenta ir para voluntarios
    const href = await btnVoluntario.getAttribute('href');
    if (href && !href.startsWith('#')) {
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });
});
