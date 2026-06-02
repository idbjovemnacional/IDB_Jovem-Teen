import { test, expect } from '../helpers/testWithCoverage.js';
import { loginAsAdmin } from '../helpers/adminAuth';

test.describe('Admin Route Guards', () => {
  test('deve redirecionar para login se não estiver autenticado e tentar acessar /admin', async ({ page }) => {
    // Limpa estado
    await page.goto('/admin');

    // O PrivateRoute/AdminRoute joga para login
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve redirecionar para login se não estiver autenticado e tentar acessar subrotas', async ({ page }) => {
    await page.goto('/admin/eventos');
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve permitir acesso ao /admin se o auth helper estiver ativo', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin');

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
