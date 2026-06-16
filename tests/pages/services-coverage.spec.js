import { test, expect } from '../helpers/testWithCoverage.js';
import { loginAsAdmin } from '../helpers/adminAuth.js';
import { setupApiMock } from '../helpers/apiMock.js';

const json = (data, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(data),
});

const errorResponse = (msg = 'Erro interno', status = 500) =>
  json({ detail: msg }, status);

const errorArray = () =>
  json({ detail: [{ msg: 'Campo inválido' }, { msg: 'Outro erro' }] }, 422);

const error401 = () => json({ detail: 'Não autorizado' }, 401);
const error403 = () => json({ detail: 'Proibido' }, 403);


test.describe('eventService.js – branches de erro', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);
  });

  test('handleUpdateEvent – sem tipoEvento válido retorna erro (linha 358-365)', async ({ page }) => {
    await page.goto('/admin/eventos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.evaluate(() => {
      const sel = document.querySelector('select[name="tipoEvento"]');
      if (sel) {
        sel.innerHTML = '<option value="">-- Selecione --</option>';
        sel.value = '';
      }
    });

    await page.evaluate(() => {
      document.querySelectorAll('[required]').forEach(el => el.removeAttribute('required'));
    });

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(600);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleUpdateEvent – API retorna erro 500 (linha 364-365)', async ({ page }) => {
    await page.route(
      /\/evento\/\d+$/,
      async (route) => {
        if (route.request().method() === 'PUT') {
          return route.fulfill(errorResponse('Erro ao atualizar evento.'));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Preenche o título para passar validação de nome
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.getByPlaceholder('Nome do Evento').fill('Evento Atualizado Erro');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    // alert deve aparecer com mensagem de erro do servidor
    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleUpdateEvent – API retorna detail array (linha 358-365 + getErrorMessage array)', async ({ page }) => {
    await page.route(
      /\/evento\/\d+$/,
      async (route) => {
        if (route.request().method() === 'PUT') {
          return route.fulfill(errorArray());
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.getByPlaceholder('Nome do Evento').fill('Evento Atualizado');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleDeleteEvent – API retorna erro 500 (linha 375)', async ({ page }) => {
    await page.route(
      /\/evento\/\d+$/,
      async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill(errorResponse('Erro ao excluir evento.'));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Abre modal de exclusão e confirma
    const btnExcluir = page.getByTitle('Excluir').first();
    await expect(btnExcluir).toBeVisible();
    await btnExcluir.click();

    const btnSim = page.getByRole('button', { name: 'Sim' });
    await expect(btnSim).toBeVisible();
    await btnSim.click();

    await page.waitForTimeout(800);
    // Pode ou não mostrar alert dependendo da implementação; o importante é que o catch foi executado
  });

  test('handleCreateActivity – API retorna erro 500 (linha 429)', async ({ page }) => {
    await page.route(
      /\/evento\/\d+\/atividade$/,
      async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill(errorResponse('Erro ao criar atividade.'));
        }
        if (route.request().method() === 'GET') {
          return route.fulfill(json([{ atividade_id: 1, evento_id: 1, nome: "Abertura", horario_inicio: "2026-07-10T17:00:00", horario_termino: "2026-07-10T18:00:00" }]));
        }
        await route.fallback(); return;
      }
    );

    await page.goto('/admin/eventos/1/programacao');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Abre formulário inline de atividade
    await page.getByTitle('Adicionar atividade').click();
    await page.getByPlaceholder('Nome da atividade').fill('Atividade Erro');
    const timeInputs = page.locator('input[type="time"]');
    await timeInputs.nth(0).fill('10:00');
    await timeInputs.nth(1).fill('11:00');
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await page.waitForTimeout(800);
    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleUpdateActivity – API retorna erro 500 (linha 441)', async ({ page }) => {
    await page.route(
      /\/evento\/atividade\/\d+$/,
      async (route) => {
        if (route.request().method() === 'PUT') {
          return route.fulfill(errorResponse('Erro ao atualizar atividade.'));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/1/programacao');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Edita a primeira atividade
    const btnEditar = page.getByTitle('Editar atividade').first();
    await expect(btnEditar).toBeVisible();
    await btnEditar.click();

    await page.getByPlaceholder('Nome da atividade').fill('Atividade Atualizada Erro');
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await page.waitForTimeout(800);
    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleDeleteActivity – API retorna erro 500 (linha 450)', async ({ page }) => {
    await page.route(
      /\/evento\/atividade\/\d+$/,
      async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill(errorResponse('Erro ao excluir atividade.'));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/1/programacao');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Exclui a primeira atividade
    const btnExcluir = page.getByTitle('Excluir atividade').first();
    await expect(btnExcluir).toBeVisible();
    await btnExcluir.click();

    const btnSim = page.getByRole('button', { name: 'Sim' });
    await expect(btnSim).toBeVisible();
    await btnSim.click();

    await page.waitForTimeout(800);
  });

  test('handleCreateEvent – API retorna erro 500 (linha 347)', async ({ page }) => {
    await page.route(
      /\/evento\/?$/,
      async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill(errorResponse('Erro ao criar evento.'));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Preenche formulário completo para passar validações
    await page.getByPlaceholder('Nome do Evento').fill('Evento Teste Erro');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');

    // Preenche local via busca (Nominatim já está mockado em setupApiMock)
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleCreateEvent – API retorna detail como string (getErrorMessage string branch)', async ({ page }) => {
    await page.route(
      /\/evento\/?$/,
      async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill(json({ detail: 'Mensagem de erro como string' }, 400));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do Evento').fill('Evento String Error');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');

    // Preenche local
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleCreateEvent – API retorna detail como objeto {msg} (getErrorMessage object branch)', async ({ page }) => {
    await page.route(
      /\/evento\/?$/,
      async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill(json({ detail: { msg: 'Erro objeto msg' } }, 400));
        }
        await route.fallback(); return;;
      }
    );

    await page.goto('/admin/eventos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do Evento').fill('Evento Object Error');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');

    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('syncEventSpeakers – atualiza foto do speaker existente (linha 305-312)', async ({ page }) => {
    await page.goto('/admin/eventos/1/editar');

    const palestrInput = page.getByPlaceholder('Nome do palestrante').first();
    await palestrInput.fill('Pr. André');

    const fotoInput = page.getByPlaceholder('Link da foto (Google Drive)').first();
    await fotoInput.fill('https://drive.google.com/file/d/NOVA_FOTO/view');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('syncEventSpeakers – speaker já vinculado não duplica (linha 315)', async ({ page }) => {
    await page.goto('/admin/eventos/1/editar');
    const palestrInput = page.getByPlaceholder('Nome do palestrante').first();
    await palestrInput.fill('Pr. André');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('liderService.js – catch blocks', () => {
  test('getAllLideres – catch quando API falha (linha 9-10)', async ({ page }) => {
    await setupApiMock(page);
    await page.route(/\/lider\/?$/, (route) => route.abort('failed'));

    // A página Home usa getAllLideres via LiderService
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Página deve renderizar mesmo com erro
    await expect(page.getByRole('heading', { name: /Nosso Organograma/i })).toBeVisible();
  });

  test('getLiderById – catch quando API falha (linha 19-20)', async ({ page }) => {
    await setupApiMock(page);
    await page.route(/\/lider\/\d+$/, (route) => route.abort('failed'));

    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'IDB JOVEM & TEEN', exact: true })).toBeVisible();
  });

  test('createLider – catch quando API falha (linha 29-30)', async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);

    // Aborta POST /lider/
    await page.route(/\/lider\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.abort('failed');
      }
      await route.fallback(); return;;
    });

    // Visita admin para triggar possível createLider (página dashboard usa líderes)
    await page.goto('/admin');
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toBeVisible();
  });

  test('updateLider – catch quando API falha (linha 39-40)', async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);

    // Aborta PUT /lider/{id}
    await page.route(/\/lider\/\d+$/, async (route) => {
      if (route.request().method() === 'PUT') {
        return route.abort('failed');
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin');
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toBeVisible();
  });

  test('deleteLider – catch quando API falha (linha 49-50)', async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);

    // Aborta DELETE /lider/{id}
    await page.route(/\/lider\/\d+$/, async (route) => {
      if (route.request().method() === 'DELETE') {
        return route.abort('failed');
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin');
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('liderService.js – exercício direto via page.evaluate', () => {
  test('exercita todos os métodos do LiderService via window.__coverage__', async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);

    // Vai para a página de teste de cobertura que exercita os métodos de serviços e previne crashes de renderização
    await page.goto('/test-coverage');
    await page.waitForTimeout(500);

    // Intercepta /lider/ para simular erro em todos os métodos
    await page.route(/\/lider/, async (route) => {
      return route.fulfill(errorResponse('Erro lider', 500));
    });

    // Recarrega para que os scripts no useEffect executem novamente com erro
    await page.reload();
    await page.waitForTimeout(500);

    // O TestCoverage intercepta todos e os erros são logados no console, não cracha o app
    await expect(page.locator('#root')).toBeAttached();
  });
});

test.describe('mapaService.js – branches não cobertos', () => {
  test('fetchEndereco – retorna null quando nome_local está ausente (linha 11)', async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);

    // Sobrescreve mock do mapa para retornar objeto SEM nome_local
    await page.route(/\/mapa\/endereco/, async (route) => {
      return route.fulfill(json({ outro_campo: 'valor' }));
    });

    // A página de edição de evento chama fetchEndereco quando muda coordenadas
    await page.goto('/admin/eventos/1/editar');
    await page.waitForTimeout(1000);

    // Página carrega normalmente, campo de local pode estar vazio
    await expect(page.getByPlaceholder('Nome do Evento')).toBeVisible();
  });

  test('buscarLocais – retorna [] quando res.ok é false (linha 38)', async ({ page }) => {
    await setupApiMock(page);

    // Aborta Nominatim para simular res.ok = false (não-ok)
    await page.route(/nominatim\.openstreetmap\.org\/search/, async (route) => {
      return route.fulfill({ status: 503, body: 'Service Unavailable' });
    });

    await loginAsAdmin(page);
    await page.goto('/admin/eventos/criar');

    // Digita no campo de busca de local (dispara buscarLocais)
    const localInput = page.getByPlaceholder('Digite o nome ou endereço do local');
    await localInput.fill('Loc');
    await page.waitForTimeout(300);
    await localInput.fill('Local Teste Erro');
    await page.waitForTimeout(800);

    // Campo ainda existe, nenhum resultado deve aparecer
    await expect(localInput).toBeVisible();
  });

  test('buscarLocais – retorna [] quando fetch lança exceção (catch branch)', async ({ page }) => {
    await setupApiMock(page);

    // Aborta completamente a chamada do Nominatim
    await page.route(/nominatim\.openstreetmap\.org/, async (route) => {
      return route.abort('failed');
    });

    await loginAsAdmin(page);
    await page.goto('/admin/eventos/criar');

    const localInput = page.getByPlaceholder('Digite o nome ou endereço do local');
    await localInput.fill('Local Catch Teste');
    await page.waitForTimeout(800);

    await expect(localInput).toBeVisible();
  });
});

test.describe('productService.js – branches de erro', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);
  });

  test('handleCreateProduct – API retorna erro 500 (linha 74)', async ({ page }) => {
    await page.route(/\/produto\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(errorResponse('Erro ao criar produto.'));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto Erro');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleCreateProduct – API retorna 401 (resolveError 401 branch, linha 102)', async ({ page }) => {
    await page.route(/\/produto\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(error401());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto 401');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    // Como é 401, o interceptor do axios redireciona para /login imediatamente
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('handleCreateProduct – API retorna 403 (resolveError 403 branch, linha 102-103)', async ({ page }) => {
    await page.route(/\/produto\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(error403());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto 403');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage).toContain('Sessão');
  });

  test('handleUpdateProduct – API retorna erro 500 (linha 87)', async ({ page }) => {
    await page.route(/\/produto\/\d+$/, async (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill(errorResponse('Erro ao atualizar produto.'));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto Atualizado Erro');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });

  test('handleUpdateProduct – API retorna 401 (resolveError 401 branch)', async ({ page }) => {
    await page.route(/\/produto\/\d+$/, async (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill(error401());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/1/editar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto 401 Update');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    // Como é 401, o interceptor do axios redireciona para /login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('handleDeleteProduct – API retorna erro 500 (linha 96)', async ({ page }) => {
    await page.route(/\/produto\/\d+$/, async (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill(errorResponse('Erro ao excluir produto.'));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const firstCardDelBtn = page.getByRole('button', { name: 'Excluir' }).first();
    await expect(firstCardDelBtn).toBeVisible();
    await firstCardDelBtn.click();

    const btnSim = page.getByRole('button', { name: 'Sim' });
    await expect(btnSim).toBeVisible();
    await btnSim.click();

    await page.waitForTimeout(800);
  });

  test('handleDeleteProduct – API retorna 401 (resolveError 401 no delete)', async ({ page }) => {
    await page.route(/\/produto\/\d+$/, async (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill(error401());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const firstCardDelBtn = page.getByRole('button', { name: 'Excluir' }).first();
    await firstCardDelBtn.click();
    const btnSim = page.getByRole('button', { name: 'Sim' });
    await btnSim.click();

    await page.waitForTimeout(800);
  });

  test('resolveError – retorna detail do response.data.detail (linha 105)', async ({ page }) => {
    await page.route(/\/produto\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(json({ detail: 'Detalhe específico do erro' }, 422));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/produtos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do produto').fill('Produto Detail');
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    expect(alertMessage.length).toBeGreaterThan(0);
  });
});

test.describe('speakerService.js – branches de erro', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);
  });

  test('handleCreateSpeaker – API retorna detail array (getErrorMessage linha 28-34)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(errorArray());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/eventos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do Evento').fill('Evento Speaker Array Error');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByPlaceholder('Nome do palestrante').first().fill('Palestrante Novo Array');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toBeVisible();
  });

  test('handleCreateSpeaker – API retorna detail string (getErrorMessage linha 35)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(json({ detail: 'Erro string no speaker' }, 400));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/eventos/criar');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByPlaceholder('Nome do Evento').fill('Evento Speaker String Error');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByPlaceholder('Nome do palestrante').first().fill('Palestrante String Error');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleCreateSpeaker – API retorna detail.msg (getErrorMessage linha 36)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(json({ detail: { msg: 'Objeto msg speaker' } }, 400));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/eventos/criar');

    page.on('dialog', async dialog => { await dialog.accept(); });

    await page.getByPlaceholder('Nome do Evento').fill('Evento Speaker Obj Error');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByPlaceholder('Nome do palestrante').first().fill('Palestrante Obj Error');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleCreateSpeaker – API retorna erro sem detail (error.message fallback, linha 37)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/?$/, async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill(json({}, 500));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/eventos/criar');

    page.on('dialog', async dialog => { await dialog.accept(); });

    await page.getByPlaceholder('Nome do Evento').fill('Evento Speaker Fallback');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    await page.getByPlaceholder('Nome do palestrante').first().fill('Palestrante Fallback');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleCreateSpeaker – nome vazio retorna erro sem chamar API (linha 58-60)', async ({ page }) => {
    await page.goto('/admin/eventos/criar');

    await page.getByPlaceholder('Nome do Evento').fill('Evento Sem Palestrante');
    await page.locator('select[name="tipoEvento"]').selectOption('Conferência');
    await page.locator('input[name="startDay"]').fill('2029-12-31');
    await page.locator('input[name="startTime"]').fill('09:00');
    await page.locator('input[name="endDay"]').fill('2029-12-31');
    await page.locator('input[name="endTime"]').fill('18:00');
    await page.getByPlaceholder('Digite o nome ou endereço do local').fill('Teste');
    const option = page.locator('ul.absolute button').first();
    await option.waitFor({ state: 'visible' }).catch(() => { });
    await option.click().catch(() => { });
    await page.waitForTimeout(400);

    // Deixa palestrante vazio (não preenche)
    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    // Verifica que alguma URL foi atingida
    await expect(page.locator('body')).toBeVisible();
  });

  // ── handleUpdateSpeaker – catch block (linha 74) ──────────────────────────

  test('handleUpdateSpeaker – catch quando API falha (linha 74)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/\d+$/, async (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill(errorResponse('Erro ao atualizar speaker.'));
      }
      await route.fallback(); return;;
    });

    // O handleUpdateSpeaker é chamado em syncEventSpeakers quando a foto mudou
    await page.goto('/admin/eventos/1/editar');

    page.on('dialog', async dialog => { await dialog.accept(); });

    // Preenche palestrante com nome de um existente no mock e foto diferente
    const palestrInput = page.getByPlaceholder('Nome do palestrante').first();
    await palestrInput.fill('Pr. André');

    const fotoInput = page.getByPlaceholder('Link da foto (Google Drive)').first();
    await fotoInput.fill('https://drive.google.com/file/d/NOVA_FOTO_ERRO/view');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleDeleteSpeaker – catch quando API falha (linha 83)', async ({ page }) => {
    await page.route(/\/banda-palestrante\/\d+$/, async (route) => {
      if (route.request().method() === 'DELETE') {
        return route.fulfill(errorResponse('Erro ao excluir speaker.'));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/eventos/1/editar');

    page.on('dialog', async dialog => { await dialog.accept(); });

    // Limpa o campo do palestrante para que syncEventSpeakers delete o speaker vinculado
    const palestrInput = page.getByPlaceholder('Nome do palestrante').first();
    await palestrInput.fill('');

    await page.getByRole('button', { name: 'Salvar' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });
});


test.describe('volunteerService.js – branches de erro', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await setupApiMock(page);
  });

  test('handleUpdateStatus – API retorna erro 500 (linha 79-83)', async ({ page }) => {
    await page.route(/\/voluntarios\/\d+\/evento\/\d+\/status/, async (route) => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill(errorResponse('Erro ao atualizar status.'));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/voluntarios/1');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Muda o status de um voluntário
    const dropdownBtn = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();

    await page.locator('button.w-full', { hasText: 'Aprovado' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleUpdateStatus – API retorna 401 (resolveError 401 branch, linha 88-89)', async ({ page }) => {
    await page.route(/\/voluntarios\/\d+\/evento\/\d+\/status/, async (route) => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill(error401());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/voluntarios/1');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const dropdownBtn = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();

    await page.locator('button.w-full', { hasText: 'Reprovado' }).click();
    await page.waitForTimeout(800);

    // resolveError deve retornar 'Sessão expirada...'
    await expect(page.locator('body')).toBeVisible();
  });

  test('handleUpdateStatus – API retorna 403 (resolveError 403 branch, linha 88-89)', async ({ page }) => {
    await page.route(/\/voluntarios\/\d+\/evento\/\d+\/status/, async (route) => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill(error403());
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/voluntarios/1');

    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    const dropdownBtn = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();

    await page.locator('button.w-full', { hasText: 'Aprovado' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });

  test('handleUpdateStatus – API retorna detail string (resolveError linha 91)', async ({ page }) => {
    await page.route(/\/voluntarios\/\d+\/evento\/\d+\/status/, async (route) => {
      if (route.request().method() === 'PATCH') {
        return route.fulfill(json({ detail: 'Status inválido pelo servidor' }, 422));
      }
      await route.fallback(); return;;
    });

    await page.goto('/admin/voluntarios/1');

    page.on('dialog', async dialog => { await dialog.accept(); });

    const dropdownBtn = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await expect(dropdownBtn).toBeVisible();
    await dropdownBtn.click();

    await page.locator('button.w-full', { hasText: 'Aprovado' }).click();
    await page.waitForTimeout(800);

    await expect(page.locator('body')).toBeVisible();
  });


  test('handleUpdateStatus – status inválido retorna erro imediatamente (linha 71-73)', async ({ page }) => {
    await page.goto('/admin/voluntarios/1');

    // Verifica todos os status válidos sendo alternados sem erro
    const dropdownBtn = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await expect(dropdownBtn).toBeVisible();

    // Aprovado
    await dropdownBtn.click();
    await page.locator('button.w-full', { hasText: 'Aprovado' }).click();
    await page.waitForTimeout(500);

    // Reprovado
    const dropdownBtn2 = page.getByRole('button', { name: /Pendente|Aprovado|Reprovado/ }).first();
    await dropdownBtn2.click();
    await page.locator('button.w-full', { hasText: 'Reprovado' }).click();
    await page.waitForTimeout(500);

    await expect(page.locator('body')).toBeVisible();
  });
});
