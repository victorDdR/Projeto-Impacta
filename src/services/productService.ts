import { Page } from "../types/Page";
import { Product } from "../types/Product";
import { CreateProductDTO } from "../types/ProductRequest";

const API_URL = "/impacta/products";

export const buscarProdutos = async (): Promise<Page<Product>> => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar produtos");
  }

  const data: Page<Product> = await response.json();
  return data;
};

export async function criarProduto(
  produto: CreateProductDTO
): Promise<void> {
  const productRequest = {
    productName: produto.name,
    price: produto.price,
    stock: produto.stock,
    category: {
      id: produto.categoryId,
      name: produto.categoryName
    },
  };

  const response = await fetch(`${API_URL}/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productRequest),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar produto');
  }
}

export async function deletarProduto(produtoId: number): Promise<void> {
  const response = await fetch(`${API_URL}/${produtoId}/delete`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Erro ao deletar produto');
  }
}