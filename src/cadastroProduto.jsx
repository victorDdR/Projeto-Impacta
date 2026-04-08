import React, { useState } from 'react';

const CadastroProduto = ({ aoCadastrar }) => {
  const [form, setForm] = useState({ nome: '', marca: '', categoria: '', preco: '', estoque: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoCadastrar(form);
    setForm({ nome: '', marca: '', categoria: '', preco: '', estoque: '' });
  };

  return (
    <div className="card-cadastro">
      <h2>Entrada de Estoque</h2>
      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome do Produto</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Marca</label>
          <input name="marca" value={form.marca} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Categoria</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} required>
            <option value="">Selecione...</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Periféricos">Periféricos</option>
          </select>
        </div>
        <div className="campo">
          <label>Preço Unitário (R$)</label>
          <input type="number" name="preco" step="0.01" value={form.preco} onChange={handleChange} required />
        </div>
        <div className="campo">
          <label>Quantidade Adicionada</label>
          <input type="number" name="estoque" value={form.estoque} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-cadastrar">Confirmar Entrada</button>
      </form>
    </div>
  );
};

export default CadastroProduto;