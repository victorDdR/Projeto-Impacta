const API_URL = "/impacta";

export async function vender(carrinho) {
    const saleRequest = {
        "items": []
    }
    carrinho.forEach(item => {
        saleRequest.items.push({
            "quantity": item.quantidade,
            "productDTO": {
                "id": item.id,
                "price": item.preco,
                "stock": 0
            }
        })
    });

  const response = await fetch(API_URL + "/sales/register", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saleRequest)
  });

  if (!response.ok) {
    throw new Error("Erro ao Registrar Venda");
  }
}