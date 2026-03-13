import React, { useState } from 'react';
import './CadastroProduto.css'; // Reaproveita o estilo do formulário

const RegistroCompras = ({ listaProdutos }) => {
  const [compra, setCompra] = useState({ idProduto: '', quantidade: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Encontrar o produto selecionado para pegar o nome
    const produtoSelecionado = listaProdutos.find(p => p.id == compra.idProduto);
    
    if (produtoSelecionado) {
        const total = produtoSelecionado.preco * compra.quantidade;
        alert(`Venda Registrada!\nProduto: ${produtoSelecionado.nome}\nTotal: R$ ${total.toFixed(2)}`);
    } else {
        alert("Selecione um produto!");
    }
  };

  return (
    <div className="cadastro-container">
      <div className="form-box">
        <h2>Registrar Venda</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Selecione o Produto</label>
            <select 
              className="input-padrao" // Adicione uma classe CSS se quiser estilizar
              value={compra.idProduto} 
              onChange={(e) => setCompra({...compra, idProduto: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              {listaProdutos.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.nome} - R$ {prod.preco}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Quantidade</label>
            <input 
              type="number" 
              min="1" 
              value={compra.quantidade} 
              onChange={(e) => setCompra({...compra, quantidade: e.target.value})} 
              required 
            />
          </div>

          <button type="submit" className="btn-cadastrar" style={{backgroundColor: '#e67e22'}}>
            Finalizar Venda
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegistroCompras;