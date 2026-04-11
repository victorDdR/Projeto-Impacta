import React, { useState, useEffect } from 'react';

const CadastroProduto = ({ aoCadastrar }) => {
  const [form, setForm] = useState({ nome: '', categoria: '', preco: '', estoque: '' });
  const [categoriasSalvas, setCategoriasSalvas] = useState([]);

  // 1. AQUI É ONDE VOCÊ BUSCA AS CATEGORIAS DO BANCO DE DADOS
  useEffect(() => {
    // Quando o Back-end estiver rodando, você vai trocar a simulação abaixo por isso:
    // fetch('http://localhost:8080/categorias')
    //   .then(resposta => resposta.json())
    //   .then(dados => setCategoriasSalvas(dados));

    // SIMULAÇÃO TEMPORÁRIA (Para a tela não ficar vazia hoje)
    const categoriasSimuladas = ["Hardware", "Software", "Periféricos", "Monitores", "Acessórios"];
    setCategoriasSalvas(categoriasSimuladas);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoCadastrar(form);
    setForm({ nome: '', categoria: '', preco: '', estoque: '' }); // Limpa o formulário
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
          <label>Categoria (Vinda do Banco)</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} required>
            <option value="">Selecione a categoria...</option>
            {/* O React vai criar uma opção para cada categoria que vier do banco */}
            {categoriasSalvas.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
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