const API_URL = "/impacta";

export const buscarProdutos = async () => {
  const response = await fetch(API_URL + '/products');

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
};

export const buscarCategorias = async () => {
  const response = await fetch(API_URL + '/categories');

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  return response.json();
};

export async function criarProduto(produto) {
  const productRequest = {
    "productName": produto.name,
    "price": produto.price,
    "stock": produto.stock,
    "category": {
        "id": produto.category
    }
  }

  const response = await fetch(API_URL + "/products/new", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productRequest)
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

}

export async function deletarProduto(produtoId) {
  const response = await fetch(`${API_URL}/products/${produtoId}/delete`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

}