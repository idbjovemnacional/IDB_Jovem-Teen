import { test, expect } from '../helpers/testWithCoverage.js';

test.describe('Página de Detalhes do Evento', () => {
  test('deve carregar informações de um evento válido', async ({ page }) => {
    await page.goto('/eventos/evento-1'); // mock data slug

    // Hero Section
    const titulo = page.getByRole('heading', { name: 'IDB TEEN CAMP' });
    await expect(titulo).toBeVisible();

    const desc = page.getByText(/Um acampamento incrível para jovens/i);
    await expect(desc).toBeVisible();

    const loc = page.getByText('Brasília, DF');
    await expect(loc).toBeVisible();

    // Botão voltar do Hero
    const btnVoltar = page.getByLabel('Voltar');
    await expect(btnVoltar).toBeVisible();

    // Seção de Speakers (Line-up)
    await expect(page.getByRole('heading', { name: 'Palestrantes' })).toBeVisible();

    // Seção de Schedule (Programação)
    await expect(page.getByRole('heading', { name: 'Programação do evento' })).toBeVisible();

    // Seção de Galeria de Fotos
    await expect(page.getByRole('heading', { name: 'Galeria do evento' })).toBeVisible();
  });

  test('deve exibir mensagem de "Evento não encontrado" para slug inválido', async ({ page }) => {
    await page.goto('/eventos/slug-que-nao-existe');

    const tituloErro = page.getByRole('heading', { name: 'Evento não encontrado' });
    await expect(tituloErro).toBeVisible();

    const textoErro = page.getByText('O evento que você procura não existe ou foi removido.');
    await expect(textoErro).toBeVisible();

    const btnVerTodos = page.getByRole('link', { name: 'Ver todos os eventos' });
    await expect(btnVerTodos).toBeVisible();

    // Testar se o link redireciona
    await btnVerTodos.click();
    await expect(page).toHaveURL(/\/eventos$/);
  });

  test('deve navegar para trás ao clicar no botão Voltar do Hero', async ({ page }) => {
    // Navega primeiro para /eventos, depois para detalhes para ter histórico
    await page.goto('/eventos');
    await page.goto('/eventos/evento-1');

    const btnVoltar = page.getByLabel('Voltar');
    await expect(btnVoltar).toBeVisible();

    await btnVoltar.click();
    await expect(page).toHaveURL(/\/eventos$/);
  });

  test('deve renderizar os cards de speakers com nome e profissão', async ({ page }) => {
    await page.goto('/eventos/evento-1');

    // Seção de speakers deve existir
    const speakerSection = page.locator('section').filter({ hasText: 'Palestrantes' });
    await expect(speakerSection).toBeVisible();

    // Deve renderizar 4 speakers (dados do mock evento-1)
    const speakerNames = speakerSection.locator('h3');
    const count = await speakerNames.count();
    expect(count).toBe(4);

    // Cada speaker deve ter role (profissão)
    const speakerRoles = speakerSection.locator('p');
    const rolesCount = await speakerRoles.count();
    expect(rolesCount).toBe(4);

    // Speaker images devem ter alt text
    const speakerImages = speakerSection.locator('img');
    const imgCount = await speakerImages.count();
    expect(imgCount).toBe(4);

    for (let i = 0; i < imgCount; i++) {
      await expect(speakerImages.nth(i)).toHaveAttribute('alt', /./);
    }
  });

  test('deve renderizar a programação com horários e atividades', async ({ page }) => {
    await page.goto('/eventos/evento-1');

    const scheduleSection = page.locator('section').filter({ hasText: 'Programação do evento' });
    await expect(scheduleSection).toBeVisible();

    // evento-1 tem 4 atividades: Abertura, Louvor, Ministração, Encerramento
    await expect(scheduleSection.getByText('Abertura')).toBeVisible();
    await expect(scheduleSection.getByText('Louvor')).toBeVisible();
    await expect(scheduleSection.getByText('Ministração')).toBeVisible();
    await expect(scheduleSection.getByText('Encerramento')).toBeVisible();

    // Verifica os horários
    await expect(scheduleSection.getByText('17:00 - 18:00')).toBeVisible();
    await expect(scheduleSection.getByText('18:00 - 19:00')).toBeVisible();
    await expect(scheduleSection.getByText('19:00 - 20:30')).toBeVisible();
    await expect(scheduleSection.getByText('20:30 - 21:00')).toBeVisible();
  });

  test('deve renderizar a galeria do evento quando existem fotos', async ({ page }) => {
    await page.goto('/eventos/evento-1');

    // evento-1 tem galeria com 1 foto
    const galeriaSection = page.locator('section').filter({ hasText: 'Galeria do evento' });
    await expect(galeriaSection).toBeVisible();

    const imgs = galeriaSection.locator('img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);

    // Alt text deve ser do padrão "Foto X do evento"
    await expect(imgs.first()).toHaveAttribute('alt', /Foto \d+ do evento/);
  });

  test('não deve renderizar galeria quando não existem fotos', async ({ page }) => {
    // evento-2 tem galeria vazia
    await page.goto('/eventos/evento-2');

    // Speakers e Schedule devem estar visíveis 
    await expect(page.getByRole('heading', { name: 'Palestrantes' })).toBeVisible();

    // Galeria do evento NÃO deve aparecer (gallery vazia retorna null)
    const galeriaHeading = page.getByRole('heading', { name: 'Galeria do evento' });
    await expect(galeriaHeading).not.toBeVisible();
  });

  test('deve carregar informações do evento-em-destaque com schedule completo', async ({ page }) => {
    await page.goto('/eventos/evento-em-destaque');

    const titulo = page.getByRole('heading', { name: 'IMERSÃO 2025' });
    await expect(titulo).toBeVisible();

    await expect(page.getByText('São Paulo, SP')).toBeVisible();

    // 4 speakers
    const speakerSection = page.locator('section').filter({ hasText: 'Palestrantes' });
    const speakerNames = speakerSection.locator('h3');
    expect(await speakerNames.count()).toBe(4);

    // 8 atividades na programação
    const scheduleSection = page.locator('section').filter({ hasText: 'Programação do evento' });
    await expect(scheduleSection.getByText('Atividade').first()).toBeVisible();
  });
});
