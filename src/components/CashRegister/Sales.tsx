import { useEffect, useState } from "react";
import styles from "../../pages/TelaCaixa/TelaCaixa.module.css";
import { buscarVendas } from "../../services/saleService";

function Sales() {
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [vendaSelecionada, setVendaSelecionada] = useState<any | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const page = await buscarVendas();
        
        const vendasOficiais = page.content.map((venda: any) => ({
          id: venda.id,
          total: venda.totalAmount || venda.total || 0,
          data: new Date(venda.date || venda.saleDate || new Date()).toLocaleString(),
          itens: venda.items || venda.saleItems || []
        }));
        
        setHistoricoVendas(vendasOficiais);
      } catch (error) {
        console.error("Erro ao puxar da API:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando histórico...</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div className={styles.tabelaContainer}>
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
                  <td>#{venda.id}</td>
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

      {vendaSelecionada && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', color: '#333', padding: '25px', borderRadius: '8px', width: '450px', maxWidth: '90%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ textAlign: 'center', borderBottom: '1px dashed #ccc', paddingBottom: '10px', marginTop: 0 }}>
              CUPOM FISCAL - #{vendaSelecionada.id}
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
                    <td style={{ padding: '8px 0' }}>{item.name || item.productName || "Produto"}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>
                      R$ {((item.unit_price || item.price || 0) * item.quantity).toFixed(2)}
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
}

export default Sales;