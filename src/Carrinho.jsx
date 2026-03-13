import React, { useState } from 'react';

const Carrinho = ({ itens, aoRemover }) => {
  const [pagamento, setPagamento] = useState('');

  const total = itens.reduce((acc, item) => acc + Number(item.preco), 0);

  const finalizarCompra = () => {
    if (!pagamento) return alert("Selecione uma forma de pagamento!");
    alert(`Compra de ${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} finalizada!`);
  };

  return (
    <div className="card-cadastro" style={{ maxWidth: '500px', color: '#333' }}>
      <h2 style={{ color: '#333' }}>Meu Carrinho</h2>
      
      {itens.length === 0 ? (
        <p style={{ color: '#666' }}>O carrinho está vazio.</p>
      ) : (
        <>
          <div className="lista-carrinho">
            {itens.map((item) => (
              <div key={item.cartId} className="item-carrinho">
                <div className="item-info">
                  <span className="item-nome">{item.nome}</span>
                  <span className="item-preco">
                    {Number(item.preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                  </span>
                </div>
                <button className="btn-remover-mini" onClick={() => aoRemover(item.cartId)}>
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="resumo-total">
            <h3>Total: {total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</h3>
          </div>

          <div className="campo">
            <label style={{ color: '#333' }}>Forma de Pagamento:</label>
            <select value={pagamento} onChange={(e) => setPagamento(e.target.value)}>
              <option value="">Escolha...</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Pix">Pix</option>
              <option value="Boleto">Boleto</option>
            </select>
          </div>

          <button className="btn-comprar" onClick={finalizarCompra} style={{ backgroundColor: '#28a745', marginTop: '10px' }}>
            Finalizar Pedido
          </button>
        </>
      )}
    </div>
  );
};

export default Carrinho;