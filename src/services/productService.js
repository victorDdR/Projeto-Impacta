const API_URL = "/impacta/products";

export const buscarProdutos = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
};