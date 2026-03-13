import React, { useState } from 'react';
import './CadastroProduto.css';

const CadastroProduto = ({ aoCadastrar }) => {
const estadoInicial = { nome: '', tipo: '', marca: '', categoria: '', preco: '' };  const [produto, setProduto] = useState(estadoInicial);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoCadastrar(produto);
    setProduto(estadoInicial);
  };

  return (
    <div className="card-cadastro">
      <h2>Cadastro de Produto</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome do Produto</label>
          <input type="text" name="nome" value={produto.nome} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Tipo</label>
          <input 
            type="text" 
            name="tipo" 
            placeholder="Ex: Digital ou Físico" // <--- Detalhe do exemplo
            value={produto.tipo} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="campo">
          <label>Marca</label>
          <input type="text" name="marca" value={produto.marca} onChange={handleChange} required />
        </div>

        <div className="campo">
          <label>Categoria</label>
          <select name="categoria" value={produto.categoria} onChange={handleChange} required>
            <option value="">Selecione...</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Periféricos">Periféricos</option> {/* <--- Opção adicionada */}
          </select>
        </div>

        <div className="campo">
          <label>Preço (R$)</label>
          <input 
            type="number" 
            name="preco" 
            step="0.01" // Permite casas decimais (centavos)
            placeholder="0.00"
            value={produto.preco} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit" className="btn-cadastrar">Cadastrar Produto</button>
      </form>
    </div>
  );
};

export default CadastroProduto;