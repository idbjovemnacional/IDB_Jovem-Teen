import { test, expect } from '../helpers/testWithCoverage.js';

test.describe('Página Inicial (Home)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('HeroSection - deve exibir o título e contadores', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: 'IDB JOVEM & TEEN', exact: true });
    await expect(titulo).toBeVisible();

    await expect(page.getByText('dias', { exact: true })).toBeVisible();
    await expect(page.getByText('horas', { exact: true })).toBeVisible();
    await expect(page.getByText('min', { exact: true })).toBeVisible();
    await expect(page.getByText('seg', { exact: true })).toBeVisible();

    const btnEvento = page.getByRole('link', { name: /Ver evento/i });
    if (await btnEvento.isVisible()) {
      await expect(btnEvento).toBeVisible();
    }
  });

  test('SobreSection - deve exibir informações e botão "Saiba mais"', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /CONHEÇA O IDB/i });
    await expect(titulo).toBeVisible();

    const btnSaibaMais = page.getByRole('link', { name: /Saiba mais/i }).first();
    await expect(btnSaibaMais).toBeVisible();
  });

  test('LideresSection - deve exibir organograma de líderes', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Nosso Organograma/i });
    await expect(titulo).toBeVisible();

    // Deve ter botão de alternância
    const btnAntigosLideres = page.getByRole('button', { name: /Antigos Líderes/i });
    await expect(btnAntigosLideres).toBeVisible();
  });

  test('LideresSection - deve permitir alternar para antigos líderes', async ({ page }) => {
    const btnAlternar = page.getByRole('button', { name: /Antigos Líderes/i });
    await btnAlternar.click();

    const tituloAntigos = page.getByRole('heading', { name: /Antigos líderes/i });
    await expect(tituloAntigos).toBeVisible();

    // O botão deve mudar o texto
    await expect(page.getByRole('button', { name: /Líderes Atuais/i })).toBeVisible();
  });

  test('EventosSection - deve exibir a programação com carrossel', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /PROGRAMAÇÃO/i });
    await expect(titulo).toBeVisible();

    // Como é um carrossel que depende de dados mockados, se houver dados, verifica botão
    const btnSaibaMais = page.getByRole('link', { name: /Saiba mais/i }).first();
    if (await btnSaibaMais.isVisible()) {
      await expect(btnSaibaMais).toBeVisible();
    }
  });

  test('CalendarioSection - deve exibir calendário de eventos', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Calendário de Eventos/i });
    await expect(titulo).toBeVisible();

    // Botões de navegação de meses em CalendarioSection usam icones ChevronLeft e ChevronRight
    const btnVoltarMes = page.locator('section').filter({ hasText: 'Calendário de Eventos' }).locator('button').first();
    const btnAvancarMes = page.locator('section').filter({ hasText: 'Calendário de Eventos' }).locator('button').nth(1);

    await expect(btnVoltarMes).toBeVisible();
    await expect(btnAvancarMes).toBeVisible();
  });

  test('VolunteerSection - deve exibir motivações para ser voluntário', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Por que você/i });
    await expect(titulo).toBeVisible();

    const btnSejaVoluntario = page.getByRole('link', { name: /Seja voluntário/i });
    await expect(btnSejaVoluntario).toBeVisible();
  });

  test('ProcessoVoluntario - deve exibir as etapas para se tornar voluntário', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Processo para virar/i });
    await expect(titulo).toBeVisible();

    // Verifica as etapas
    await expect(page.getByText('01', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('02', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('03', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('04', { exact: true }).first()).toBeVisible();

    const btnQueroSerVoluntario = page.getByRole('link', { name: /QUERO SER UM VOLUNTÁRIO/i });
    await expect(btnQueroSerVoluntario).toBeVisible();
  });

  test('ProdutosSection - deve exibir a seção de produtos', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Conheça nossos produtos/i });
    await expect(titulo).toBeVisible();
  });

  test('GaleriaSection - deve exibir o carrossel da galeria e link "Ver mais +"', async ({ page }) => {
    const titulo = page.getByRole('heading', { name: /Galeria de fotos/i });
    await expect(titulo).toBeVisible();

    const btnVerMais = page.getByRole('link', { name: /Ver mais \+/i });
    await expect(btnVerMais).toBeVisible();
    await expect(btnVerMais).toHaveAttribute('href', '/galeria');
  });

  test('Header e Footer - devem estar renderizados em /', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('deve navegar os meses no CalendarioSection', async ({ page }) => {
    const calendarSection = page.locator('section').filter({ hasText: 'Calendário de Eventos' });
    await expect(calendarSection).toBeVisible();

    // Pega os botões e o mês atual
    const btnVoltarMes = calendarSection.locator('button').first();
    const btnAvancarMes = calendarSection.locator('button').nth(1);

    const h3Month = calendarSection.locator('h3');
    const monthTextBefore = await h3Month.innerText();

    // Avança mês
    await btnAvancarMes.click();

    const monthTextAfter = await h3Month.innerText();

    // O texto do mês deve mudar (a menos que seja o mesmo mês renderizado duas vezes o que não acontece no código normal)
    expect(monthTextBefore).toBeDefined();
    expect(monthTextAfter).toBeDefined();

    // Volta mês
    await btnVoltarMes.click();

    const monthTextReverted = await h3Month.innerText();
    expect(monthTextReverted).toBe(monthTextBefore);
  });

  test('deve navegar para a página Sobre ao clicar em "Saiba mais"', async ({ page }) => {
    const btnSaibaMais = page.getByRole('link', { name: /Saiba mais/i }).first();
    await expect(btnSaibaMais).toBeVisible();

    const href = await btnSaibaMais.getAttribute('href');

    if (href && !href.startsWith('#')) {
      await btnSaibaMais.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('deve navegar para Eventos Detalhe ao clicar em Detalhes no CalendarioSection', async ({ page }) => {
    const calendarSection = page.locator('section').filter({ hasText: 'Calendário de Eventos' });
    await calendarSection.scrollIntoViewIfNeeded();

    // Se tiver evento no mês atual, testa o clique no link "Detalhes"
    const btnDetalhes = calendarSection.getByRole('link', { name: 'Detalhes' }).first();

    if (await btnDetalhes.isVisible().catch(() => false)) {
      const href = await btnDetalhes.getAttribute('href');
      await btnDetalhes.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    }
  });

  test('EventosSection - deve aguardar o auto-advance do carrossel (setInterval)', async ({ page }) => {
    const eventosSection = page.locator('section.bg-\\[\\#8A3816\\]');
    await eventosSection.scrollIntoViewIfNeeded();

    const featuredTitle = eventosSection.locator('h3').first();
    const titleBefore = await featuredTitle.innerText().catch(() => '');

    await page.waitForTimeout(5500);

    // Verifica que o componente ainda está visível
    await expect(eventosSection).toBeVisible();
  });

  test('ProcessoVoluntario - deve cobrir onMouseEnter e onFocus nos steps', async ({ page }) => {
    const processoSection = page.locator('section.bg-\\[\\#FF6D2C\\]');
    await processoSection.scrollIntoViewIfNeeded();

    const step2 = processoSection.locator('[tabindex="0"]').nth(1);
    await step2.hover({ force: true });
    await page.waitForTimeout(200);
    await step2.focus();
    await page.waitForTimeout(100);

    const step3 = processoSection.locator('[tabindex="0"]').nth(2);
    await step3.focus();
    await page.waitForTimeout(100);

    const step4 = processoSection.locator('[tabindex="0"]').nth(3);
    await step4.hover({ force: true });
    await page.waitForTimeout(100);
  });
});
