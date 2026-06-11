import {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "./api/produtoApi";

function toProduct(api) {
  if (!api) return null;
  return {
    id: api.produto_id,
    name: api.nome,
    description: api.descricao ?? "",
    link: api.link_produto ?? "",
    // imageName = nome do arquivo (p/ o form); image = URL resolvida (p/ exibir)
    imageName: api.imagem_nome ?? "",
    image: api.imagem_url ?? "",
  };
}

function toProdutoPayload(form) {
  return {
    nome: form.name,
    descricao: form.description ?? "",
    link_produto: form.link || "",
    imagem_nome: form.imageName || "",
  };
}

export async function getAllProducts() {
  const data = await listarProdutos();
  return data.map(toProduct);
}

export async function getProductById(id) {
  const data = await buscarProduto(id);
  return toProduct(data);
}

export async function createProduct(productData) {
  const data = await criarProduto(toProdutoPayload(productData));
  return toProduct(data);
}

export async function updateProduct(id, updates) {
  const data = await atualizarProduto(id, toProdutoPayload(updates));
  return toProduct(data);
}

export async function deleteProduct(id) {
  await deletarProduto(id);
  return true;
}

export async function fetchAllProducts() {
  return getAllProducts();
}

export async function fetchProductById(id) {
  return getProductById(id);
}

export async function handleCreateProduct(data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, error: "Nome do produto é obrigatório." };
  }

  try {
    const product = await createProduct(data);
    return { success: true, product };
  } catch (err) {
    return { success: false, error: resolveError(err, "Não foi possível criar o produto.") };
  }
}

export async function handleUpdateProduct(id, data) {
  if (!data.name || !data.name.trim()) {
    return { success: false, error: "Nome do produto é obrigatório." };
  }

  try {
    const product = await updateProduct(id, data);
    return { success: true, product };
  } catch (err) {
    return { success: false, error: resolveError(err, "Não foi possível atualizar o produto.") };
  }
}

export async function handleDeleteProduct(id) {
  try {
    await deleteProduct(id);
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: resolveError(err, "Não foi possível excluir o produto.") };
  }
}

function resolveError(err, fallback) {
  const status = err?.response?.status;
  if (status === 401 || status === 403) {
    return "Sessão expirada ou sem permissão. Faça login novamente.";
  }
  return err?.response?.data?.detail || fallback;
}
