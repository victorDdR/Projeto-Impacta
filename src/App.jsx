import React, { useState, useEffect } from 'react';
import CadastroProduto from './cadastroProduto';
import ListagemProdutos from './ListagemProduto';
import Carrinho from './Carrinho';
import './App.css';
import { PRODUTOS_INICIAIS } from './data/produtos';
import { buscarProdutos } from './services/productService';

function App() {
  const [tela, setTela] = useState('cadastro');
  
  // Lista de produtos cadastrados (Persistente)
  const [listaProdutos, setListaProdutos] = useState(() => {
    const dados = localStorage.getItem('meusProdutos');
    return dados ? JSON.parse(dados) : PRODUTOS_INICIAIS;
  });

  // Itens que estão no carrinho
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const data = await buscarProdutos();
        console.log(data);
        setListaProdutos(data);
      } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
      }
    };

    carregarProdutos();
  }, []);

  useEffect(() => {
    localStorage.setItem('meusProdutos', JSON.stringify(listaProdutos));
  }, [listaProdutos]);  

  // FUNÇÃO 1: Adicionar ao catálogo (vinda do Cadastro)
  const adicionarAoCatalogo = (novo) => {
    setListaProdutos([...listaProdutos, { ...novo, id: Date.now() }]);
    setTela('listagem');
  };

  // FUNÇÃO 2: Remover do catálogo (vinda da Vitrine)
  const removerDoCatalogo = (id) => {
    setListaProdutos(listaProdutos.filter(p => p.id !== id));
  };

  // FUNÇÃO 3: Adicionar ao Carrinho (vinda da Vitrine)
  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, { ...produto, cartId: Date.now() }]);
    alert(`${produto.nome} foi para o carrinho!`);
  };

  // FUNÇÃO 4: Remover do Carrinho (vinda da tela Carrinho)
  const removerDoCarrinho = (cartId) => {
    setCarrinho(carrinho.filter(item => item.cartId !== cartId));
  };

  return (
    <div className="App">
      <nav className="menu-navegacao">
        <button onClick={() => setTela('cadastro')} className={tela === 'cadastro' ? 'active' : ''}>Cadastrar</button>
        <button onClick={() => setTela('listagem')} className={tela === 'listagem' ? 'active' : ''}>Vitrine ({listaProdutos.length})</button>
        <button onClick={() => setTela('carrinho')} className={tela === 'carrinho' ? 'active' : ''}>
          🛒 Carrinho ({carrinho.length})
        </button>
      </nav>

      <main className="conteudo-principal">
        {tela === 'cadastro' && (
          <CadastroProduto aoCadastrar={adicionarAoCatalogo} />
        )}
        
        {tela === 'listagem' && (
          <ListagemProdutos 
            produtos={listaProdutos} 
            aoComprar={adicionarAoCarrinho} 
            aoRemover={removerDoCatalogo} 
          />
        )}
        
        {tela === 'carrinho' && (
          <Carrinho itens={carrinho} aoRemover={removerDoCarrinho} />
        )}
      </main>
    </div>
  );
}

export default App;