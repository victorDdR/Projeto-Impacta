import React from 'react';

const ListagemProdutos = ({ produtos, aoRemover }) => {
  return (
    <div className="container-vitrine">
      <div className="grid-produtos">
        {produtos.length === 0 ? (
          <p className="msg-vazia">Não há produtos em estoque no momento.</p>
        ) : (
          produtos.map(p => (
            <div key={p.id} className="card-item">
              <div className="card-info">
                <span className="id-tag">ID: #{p.id}</span>
                <h4>{p.nome}</h4>
                <p className="detalhes">
                  <strong>Marca:</strong> {p.marca} <br/>
                  <strong>Categoria:</strong> {p.categoria}
                </p>
                <p className="estoque-label">
                  <strong>Estoque:</strong> {p.estoque} unidades
                </p>
                <p className="preco-destaque">
                  R$ {Number(p.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <button className="btn-excluir" onClick={() => aoRemover(p.id)}>
                Excluir Produto
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListagemProdutos;