/**
 * Converte um link do Google Drive em uma URL que renderiza em <img>.
 *
 * Links de "compartilhar" do Drive (ex.: /file/d/ID/view, open?id=ID) não
 * funcionam como src de imagem. Esta função extrai o ID do arquivo e devolve
 * o host de conteúdo (lh3.googleusercontent.com), o mais confiável para
 * hotlink. É idempotente e segura: se a URL não for do Drive (ou estiver
 * vazia), devolve a própria string sem alterar.
 *
 * Obs.: o arquivo precisa estar compartilhado como "qualquer pessoa com o link".
 *
 * @param {string} url
 * @returns {string}
 */
export function toDriveImageUrl(url) {
  if (!url || typeof url !== "string") return url || "";
  const trimmed = url.trim();
  const id = extractDriveId(trimmed);
  if (!id) return trimmed; // não é Drive → usa como está
  return `https://lh3.googleusercontent.com/d/${id}=w1200`;
}

function extractDriveId(url) {
  // já é o host de conteúdo: lh3.googleusercontent.com/d/<id>=...
  let m = url.match(/lh3\.googleusercontent\.com\/d\/([\w-]+)/);
  if (m) return m[1];
  // .../file/d/<id>/view
  m = url.match(/\/file\/d\/([\w-]+)/);
  if (m) return m[1];
  // open?id=<id>, uc?...&id=<id>, thumbnail?id=<id>
  m = url.match(/[?&]id=([\w-]+)/);
  if (m) return m[1];
  // .../d/<id>
  m = url.match(/\/d\/([\w-]+)/);
  if (m) return m[1];
  return null;
}
