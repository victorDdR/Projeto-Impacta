import { useEffect, useState } from "react";
import styles from "./TelaCaixa.module.css";
import { vender } from "../../services/saleService";

import { Product } from "../../types/Product";
import { CartItem } from "../../types/CartItem";

const TelaCaixa: React.FC = () => {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");
  const [quantidadeDesejada, setQuantidadeDesejada] = useState<number>(1);
  const [valorPago, setValorPago] = useState<number | "">("");
  const [dataHora, setDataHora] = useState<Date>(new Date());

  // --- NOVOS ESTADOS PARA O HISTÓRICO DE VENDAS ---
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);

  const [estoque, setEstoque] = useState<Product[]>(() => {
    const salvos = localStorage.getItem("produtos");
    return salvos ? (JSON.parse(salvos) as Product[]) : [];
  });

  useEffect(() => {
    const timer = setInterval(() => setDataHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const adicionarItem = (): void => {
    if (produtoSelecionado === "" || quantidadeDesejada <= 0) {
      alert("Selecione um produto válido.");
      return;
    }

    const produtoNoEstoque = estoque.find(
      p => p.id === produtoSelecionado
    );

    if (!produtoNoEstoque) {
      alert("Produto não encontrado.");
      return;
    }

    if (quantidadeDesejada > produtoNoEstoque.stock) {
      alert(`Estoque insuficiente! Temos ${produtoNoEstoque.stock} unidades.`);
      return;
    }

    const itemNoCarrinho = carrinho.find(
      item => item.id === produtoNoEstoque.id
    );

    if (itemNoCarrinho) {
      if (itemNoCarrinho.quantity + quantidadeDesejada > produtoNoEstoque.stock) {
        alert("Quantidade excede o estoque disponível.");
        return;
      }

      setCarrinho(prev =>
        prev.map(item =>
          item.id === produtoNoEstoque.id
            ? { ...item, quantity: item.quantity + quantidadeDesejada }
            : item
        )
      );
    } else {
      const novoItem: CartItem = {
        id: produtoNoEstoque.id,
        name: produtoNoEstoque.productName,
        unit_price: produtoNoEstoque.price,
        quantity: quantidadeDesejada
      };

      setCarrinho(prev => [...prev, novoItem]);
    }

    setProdutoSelecionado("");
    setQuantidadeDesejada(1);
  };

  const totalCompra = carrinho.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0
  );

  const totalItens = carrinho.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const troco =
    valorPago !== "" && valorPago >= totalCompra
      ? valorPago - totalCompra
      : 0;

  const finalizarCompra = async (): Promise<void> => {
    if (carrinho.length === 0) {
      alert("O carrinho está vazio.");
      return;
    }

    if (valorPago === "" || valorPago < totalCompra) {
      alert("Valor pago é insuficiente!");
      return;
    }

    try {
      await vender(carrinho);
      alert(`Venda finalizada com sucesso! Troco: R$ ${troco.toFixed(2)}`);
      
      // Quando finalizar, já adiciona no histórico local para testes
      const novaVendaFeita = {
        id: `#${Math.floor(Math.random() * 9000) + 1000}`,
        total: totalCompra,
        data: new Date().toLocaleTimeString()
      };
      setHistoricoVendas(prev => [novaVendaFeita, ...prev]);

      setCarrinho([]);
      setValorPago("");
    } catch (error) {
      alert("Erro ao finalizar a venda.");
    }
  };

  // --- NOVA FUNÇÃO PARA ABRIR O HISTÓRICO ---
  const carregarHistorico = () => {
    setMostrarHistorico(!mostrarHistorico);
  };

  return (
    <div className={styles.pdvContainer}>
      <div className={styles.pdvEsquerda}>
        <h2 className={styles.pdvTitulo}>Impacta Store</h2>

        <div className={styles.tabelaContainer}>
          <table className={styles.tabelaPdv}>
            <thead>
              <tr>
                <th>DESCRIÇÃO</th>
                <th>QUANT</th>
                <th>PREÇO UNIT</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>R$ {item.unit_price.toFixed(2)}</td>
                  <td>
                    R$ {(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pdvControles}>
          <div className={styles.pdvCampo}>
            <label>Escolher Produto</label>
            <select
              value={produtoSelecionado}
              onChange={e =>
                setProdutoSelecionado(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            >
              <option value="">Selecione...</option>
              {estoque.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.productName} (Est. {produto.stock})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pdvCampoPequeno}>
            <label>Quant.</label>
            <input
              type="number"
              min={1}
              value={quantidadeDesejada}
              onChange={e => setQuantidadeDesejada(Number(e.target.value))}
            />
          </div>

          <button className={styles.btnAddItem} onClick={adicionarItem}>
            Adicionar
          </button>
        </div>
      </div>

      <div className={styles.pdvDireita}>
        <div className={styles.pdvDetalhes}>
          <p>
            <span>QUANT PRODUTOS</span>
            <strong>{totalItens}</strong>
          </p>
          <p>
            <span>HORA</span>
            <strong>{dataHora.toLocaleTimeString()}</strong>
          </p>
        </div>

        <div className={styles.pdvFechamento}>
          <div className={styles.pdvTotal}>
            TOTAL <span>R$ {totalCompra.toFixed(2)}</span>
          </div>

          <div className={styles.pdvPagamento}>
            <input
              type="number"
              placeholder="Valor Recebido"
              value={valorPago}
              onChange={e =>
                setValorPago(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
            />
            <button className={styles.btnPagar} onClick={finalizarCompra}>
              Pagar
            </button>
          </div>

          <div className={styles.pdvTroco}>
            TROCO <span>R$ {troco.toFixed(2)}</span>
          </div>
        </div>

        {/* --- NOVO BLOCO DO HISTÓRICO DE VENDAS --- */}
        <button 
          className={styles.btnPagar} 
          style={{ marginTop: '20px', width: '100%', backgroundColor: '#555' }} 
          onClick={carregarHistorico}
        >
          {mostrarHistorico ? "Esconder Histórico" : "Ver Histórico de Vendas"}
        </button>

        {mostrarHistorico && (
          <div className={styles.tabelaContainer} style={{ marginTop: '20px' }}>
            <table className={styles.tabelaPdv}>
              <thead>
                <tr>
                  <th>CÓDIGO</th>
                  <th>HORA</th>
                  <th>TOTAL DA VENDA</th>
                </tr>
              </thead>
              <tbody>
                {historicoVendas.length === 0 ? (
                   <tr><td colSpan={3} style={{textAlign: 'center'}}>Nenhuma venda finalizada ainda.</td></tr>
                ) : (
                  historicoVendas.map((venda, index) => (
                    <tr key={index}>
                      <td>{venda.id}</td>
                      <td>{venda.data}</td>
                      <td>R$ {venda.total.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* --- FIM DO NOVO BLOCO --- */}

      </div>
    </div>
  );
};

export default TelaCaixa;