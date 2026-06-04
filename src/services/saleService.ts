import { CartItem } from "../types/CartItem";
import { Page } from "../types/Page";
import { SaleRequest } from "../types/SaleRequest";
import { SaleResponse } from "../types/SaleResponse";

const API_URL = "/impacta/sales";

export async function vender(carrinho: CartItem[]): Promise<void> {
  const saleRequest: SaleRequest = {
    items: carrinho.map(item => ({
      productId: item.id,
      productPrice: item.unit_price,
      quantity: item.quantity
    }))
  };

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(saleRequest)
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar venda");
  }
}

// CORRIGIMOS O NOME AQUI: de buscarProdutos para buscarVendas!
export const buscarVendas = async (): Promise<Page<SaleResponse>> => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar vendas");
  }

  const data: Page<SaleResponse> = await response.json();
  return data;
}