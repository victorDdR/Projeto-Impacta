import { Routes, Route } from "react-router-dom";
import styles from "./styles/App.module.css";

import Menu from "./components/Menu/Menu";
import ListagemProdutos from "./pages/ListagemProdutos/ListagemProdutos";
import CadastroProduto from "./pages/CadastroProdutos/CadastroProduto";
import TelaCaixa from "./pages/TelaCaixa/TelaCaixa";
import { PageContainer } from "./components/Layout/PageContainer";

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <Menu />

      <Routes>
        <Route path="/" element={<ListagemProdutos />} />
        <Route path="/produtos" element={<ListagemProdutos />} />
        <Route path="/cadastro" element={<CadastroProduto />} />

        <Route
          path="/compras"
          element={
            <PageContainer>
              <TelaCaixa />
            </PageContainer>
          }
        />
      </Routes>
    </div>
  );
};

export default App;