import { useEffect, useState } from "react";
import styles from "./TelaCaixa.module.css";
import { vender } from "../../services/saleService";

import { Product } from "../../types/Product";
import { CartItem } from "../../types/CartItem";

import  CartTable from '../../components/CashRegister/CartTable';
import ProductsSelection from '../../components/CashRegister/ProductsSelection';
import SaleDetails from '../../components/CashRegister/SaleDetails';
import Sale from '../../components/CashRegister/Sale';
import Sales from "../../components/CashRegister/Sales";

const TelaCaixa: React.FC = () => {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");
  const [quantidadeDesejada, setQuantidadeDesejada] = useState<number>(1);
  const [valorPago, setValorPago] = useState<number | "">("");
  const [dataHora, setDataHora] = useState<Date>(new Date());

  const [estoque] = useState<Product[]>(() => {
    const produtosSalvos = localStorage.getItem("produtos");
    return produtosSalvos ? JSON.parse(produtosSalvos) : [];
  });
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setDataHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCompra = carrinho.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );

  const totalItens = carrinho.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const troco =
    valorPago !== "" && valorPago >= totalCompra
      ? valorPago - totalCompra
      : 0;

  const adicionarItem = () => {
    if (produtoSelecionado === "") return;

    const produto = estoque.find(p => p.id === produtoSelecionado);
    if (!produto || quantidadeDesejada > produto.stock) return;

    setCarrinho(prev => {
      const existente = prev.find(item => item.id === produto.id);

      if (existente) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + quantidadeDesejada }
            : item
        );
      }

      return [
        ...prev,
        {
          id: produto.id,
          name: produto.productName,
          unit_price: produto.price,
          quantity: quantidadeDesejada
        }
      ];
    });

    setProdutoSelecionado("");
    setQuantidadeDesejada(1);
  };

  const finalizarCompra = async () => {
    if (carrinho.length === 0 || valorPago === "" || valorPago < totalCompra)
      return;

    await vender(carrinho);
    setCarrinho([]);
    setValorPago("");
  };

  return (
    <div className={styles.pdvContainer}>
      <div className={styles.pdvEsquerda}>
        <h2 className={styles.pdvTitulo}>Impacta Store</h2>

        <CartTable carrinho={carrinho} />

        <ProductsSelection
          estoque={estoque}
          produtoSelecionado={produtoSelecionado}
          quantidadeDesejada={quantidadeDesejada}
          onSelecionarProduto={setProdutoSelecionado}
          onAlterarQuantidade={setQuantidadeDesejada}
          onAdicionar={adicionarItem}
        />
      </div>

      <div className={styles.pdvDireita}>
        <SaleDetails
          totalItens={totalItens}
          horaAtual={dataHora.toLocaleTimeString()}
        />

        <Sale
          totalCompra={totalCompra}
          valorPago={valorPago}
          troco={troco}
          onAlterarValorPago={setValorPago}
          onFinalizar={finalizarCompra}
        />

        <button 
        className={styles.btnPagar} 
        style={{ marginTop: '20px', width: '100%', backgroundColor: '#555' }} 
        onClick={() => setMostrarHistorico(!mostrarHistorico)}
      >
        {mostrarHistorico ? "Esconder Histórico" : "Ver Histórico de Vendas"}
      </button>
      {mostrarHistorico && <Sales />}
      </div>
    </div>
  );
};

export default TelaCaixa;