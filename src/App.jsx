import { Routes, Route } from 'react-router-dom';
import './styles/App.css'

import Menu from './components/Menu/Menu';
import ListagemProdutos from './pages/ListagemProdutos/ListagemProdutos';
import CadastroProduto from './pages/CadastroProdutos/CadastroProduto';
import TelaCaixa from './pages/TelaCaixa/TelaCaixa';

function App() {
  return (
    <div>
      <Menu />

      <Routes>
        <Route path="/" element={<ListagemProdutos />} />
        <Route path="/produtos" element={<ListagemProdutos />} />
        <Route path="/cadastro" element={<CadastroProduto />} />
        <Route path="/compras" element={<TelaCaixa />} />
      </Routes>
    </div>
  );
}

export default App;