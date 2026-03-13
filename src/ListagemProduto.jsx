import React from 'react';

const ListagemProdutos = ({ produtos, aoComprar, aoRemover }) => {
  return (
    <div className="secao-lista">
      <h3>Vitrine de Produtos</h3>
      {produtos.length === 0 ? (
        <p className="vazio">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid-produtos">
          {produtos.map((item) => (
            <div key={item.id} className="card-item">
              <div className="info">
                <h4>{item.nome}</h4>
                <span className="tipo-tag">{item.tipo}</span>
                <p><strong>Marca:</strong> {item.marca}</p>
                <p className="preco-destaque">
                  {Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
              
              <div className="botoes-card">
                {/* BOTÃO COMPRAR - Usa a prop aoComprar */}
                <button className="btn-comprar" onClick={() => aoComprar(item)}>
                  Adicionar ao Carrinho
                </button>
                
                {/* BOTÃO REMOVER - Usa a prop aoRemover */}
                <button className="btn-remover" onClick={() => aoRemover(item.id)}>
                  Excluir do Catálogo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListagemProdutos;