import React, { useState, useEffect } from 'react';
import CadastroProduto from './cadastroProduto';
import ListagemProdutos from './ListagemProduto';
import './App.css';

function App() {
  const [tela, setTela] = useState('cadastro');
  const [listaProdutos, setListaProdutos] = useState(() => {
    const salvos = localStorage.getItem('estoque_v5');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem('estoque_v5', JSON.stringify(listaProdutos));
  }, [listaProdutos]);

  const adicionarOuSomar = (novo) => {
    const novaLista = [...listaProdutos];
    
    // Procura na lista se o produto já existe (Nome e Categoria iguais)
    const indice = novaLista.findIndex(p => 
      p.nome.trim().toLowerCase() === novo.nome.trim().toLowerCase() &&
      p.categoria === novo.categoria
    );

    if (indice !== -1) {
      // Se existe, soma a quantidade e atualiza o preço
      novaLista[indice].estoque = Number(novaLista[indice].estoque) + Number(novo.estoque);
      novaLista[indice].preco = novo.preco; 
      setListaProdutos(novaLista);
      alert("Produto já cadastrado! Estoque atualizado com sucesso.");
    } else {
      // Se não existe, cria um card novo com um ID gerado
      const produtoFinal = { 
        ...novo, 
        id: Math.floor(10000000 + Math.random() * 90000000) 
      };
      setListaProdutos([...listaProdutos, produtoFinal]);
    }
    setTela('listagem');
  };

  const remover = (id) => {
    setListaProdutos(listaProdutos.filter(p => p.id !== id));
  };

  return (
    <div className="App">
      <nav className="menu-navegacao">
        <button 
          onClick={() => setTela('cadastro')} 
          className={tela === 'cadastro' ? 'active' : ''}
        >
          Cadastrar Produto
        </button>
        <button 
          onClick={() => setTela('listagem')} 
          className={tela === 'listagem' ? 'active' : ''}
        >
          Vitrine ({listaProdutos.length})
        </button>
      </nav>
      
      <main className="conteudo-principal">
        {tela === 'cadastro' && <CadastroProduto aoCadastrar={adicionarOuSomar} />}
        {tela === 'listagem' && <ListagemProdutos produtos={listaProdutos} aoRemover={remover} />}
      </main>
    </div>
  );
}

export default App;