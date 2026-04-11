import { Routes, Route } from 'react-router-dom';

import Menu from './components/Menu/Menu';
import ListagemProdutos from './pages/ListagemProdutos/ListagemProdutos';

function App() {
  return (
    <div>
      <Menu />

      <Routes>
        <Route path="/" element={<ListagemProdutos />} />
        <Route path="/produtos" element={<ListagemProdutos />} />
      </Routes>
    </div>
  );
}

export default App;