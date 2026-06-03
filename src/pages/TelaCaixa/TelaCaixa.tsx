import { useEffect, useState } from "react";
import styles from "./TelaCaixa.module.css";
import { vender } from "../../services/saleService";
import { buscarProdutos } from "../../services/productService"; // <-- IMPORTAÇÃO ADICIONADA AQUI

import { Product } from "../../types/Product";
import { CartItem } from "../../types/CartItem";

const TelaCaixa: React.FC = () => {
  const [carrinho, setCarrinho] = useState<CartItem[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");
  const [quantidadeDesejada, setQuantidadeDesejada] = useState<number>(1);
  const [valorPago, setValorPago] = useState<number | "">("");
  const [dataHora, setDataHora] = useState<Date>(new Date());

  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState<boolean>(false);
  
  const [vendaSelecionada, setVendaSelecionada] = useState<any | null>(null);

  // --- ALTERAÇÃO AQUI: Começa vazio em vez de puxar do cache direto ---
  const [estoque, setEstoque] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Relógio do caixa
    const timer = setInterval(() => setDataHora(new Date()), 1000);
    
    // 2. Busca o estoque real e fresco na API!
    const carregarEstoque = async () => {
      try {
        const page = await buscarProdutos();
        setEstoque(page.content); // Pega os produtos oficiais do banco
      } catch (error) {
        // Se a API falhar (Back-end desligado), usa o cache de segurança para não quebrar a tela
        const salvos = localStorage.getItem("produtos");
        if (salvos) setEstoque(JSON.parse(salvos) as Product[]);
      }
    };
    
    carregarEstoque();

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
      
      const novaVendaFeita = {
        id: `#${Math.floor(Math.random() * 9000) + 1000}`,
        total: totalCompra,
        data: new Date().toLocaleTimeString(),
        itens: [...carrinho] 
      };
      
      setHistoricoVendas(prev => [novaVendaFeita, ...prev]);

      setCarrinho([]);
      setValorPago("");
    } catch (error) {
      alert("Erro ao finalizar a venda.");
    }
  };

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
                  <th>TOTAL DA VENDA</th>
                  <th>AÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {historicoVendas.length === 0 ? (
                   <tr><td colSpan={3} style={{textAlign: 'center'}}>Nenhuma venda finalizada.</td></tr>
                ) : (
                  historicoVendas.map((venda, index) => (
                    <tr key={index}>
                      <td>{venda.id}</td>
                      <td>R$ {venda.total.toFixed(2)}</td>
                      <td>
                        <button 
                          onClick={() => setVendaSelecionada(venda)}
                          style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                        >
                          Ver Itens
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {vendaSelecionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', color: '#333', padding: '25px', borderRadius: '8px', width: '450px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ textAlign: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '10px', marginTop: 0 }}>
              CUPOM FISCAL - {vendaSelecionada.id}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px' }}>
              <span><strong>Data/Hora:</strong> {vendaSelecionada.data}</span>
              <span><strong>Operador:</strong> Admin</span>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '5px' }}>Qtd</th>
                  <th style={{ paddingBottom: '5px' }}>Descrição</th>
                  <th style={{ paddingBottom: '5px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {vendaSelecionada.itens?.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0' }}>{item.quantity}x</td>
                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>
                      R$ {(item.unit_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <h2 style={{ textAlign: 'right', marginTop: '20px', color: '#000' }}>
              Total: R$ {vendaSelecionada.total.toFixed(2)}
            </h2>
            
            <button 
              onClick={() => setVendaSelecionada(null)}
              style={{ width: '100%', padding: '12px', marginTop: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
            >
              Fechar Recibo
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TelaCaixa;