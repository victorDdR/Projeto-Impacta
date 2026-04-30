import React, { useState, useEffect } from 'react';
import './TelaCaixa.css';
// Se quiser usar o CSS Module depois, você pode criar o TelaCaixa.module.css

const TelaCaixa = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);
  const [valorPago, setValorPago] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [codVenda, setCodVenda] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  // Puxa o estoque salvo no navegador (ajuste se o seu colega mudou o nome da chave)
  const [estoque, setEstoque] = useState(() => {
    const salvos = localStorage.getItem('estoque_v5');
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    const timer = setInterval(() => setDataHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const adicionarItem = () => {
    if (!produtoSelecionado || quantidadeDesejada <= 0) return alert('Selecione um produto válido.');
    
    const produtoNoEstoque = estoque.find(p => p.id === Number(produtoSelecionado));
    if (!produtoNoEstoque) return alert('Produto não encontrado.');

    if (Number(quantidadeDesejada) > Number(produtoNoEstoque.estoque)) {
      return alert(`Estoque insuficiente! Temos ${produtoNoEstoque.estoque} unidades.`);
    }

    const itemJaNoCarrinho = carrinho.find(item => item.id === produtoNoEstoque.id);
    
    if (itemJaNoCarrinho) {
      if (itemJaNoCarrinho.quantidade + Number(quantidadeDesejada) > produtoNoEstoque.estoque) {
        return alert('Quantidade excede o estoque disponível.');
      }
      const novoCarrinho = carrinho.map(item => 
        item.id === produtoNoEstoque.id 
          ? { ...item, quantidade: item.quantidade + Number(quantidadeDesejada) } 
          : item
      );
      setCarrinho(novoCarrinho);
    } else {
      setCarrinho([...carrinho, { ...produtoNoEstoque, quantidade: Number(quantidadeDesejada) }]);
    }
    setProdutoSelecionado('');
    setQuantidadeDesejada(1);
  };

  const totalCompra = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const troco = (valorPago !== '' && Number(valorPago) >= totalCompra) ? Number(valorPago) - totalCompra : 0;

  const finalizarCompra = () => {
    if (carrinho.length === 0) return alert('O carrinho está vazio.');
    if (Number(valorPago) < totalCompra) return alert('Valor pago é insuficiente!');

    // Desconta do estoque
    const novoEstoque = [...estoque];
    carrinho.forEach(itemVendido => {
      const index = novoEstoque.findIndex(p => p.id === itemVendido.id);
      if (index !== -1) {
        novoEstoque[index].estoque = Number(novoEstoque[index].estoque) - Number(itemVendido.quantidade);
      }
    });

    setEstoque(novoEstoque);
    localStorage.setItem('estoque_v5', JSON.stringify(novoEstoque)); // Salva o novo estoque
    
    alert(`Venda finalizada com sucesso! Troco: R$ ${troco.toFixed(2)}`);
    setCodVenda(Math.floor(Math.random() * 9000) + 1000);
    setCarrinho([]);
    setValorPago('');
  };

  return (
    <div className="pdv-container">
      <div className="pdv-esquerda">
        <h2 className="pdv-titulo">SISTEMA DE VENDAS</h2>
        
        <div className="tabela-container">
          <table className="tabela-pdv">
            <thead>
              <tr>
                <th>DESCRIÇÃO</th><th>QUANT</th><th>PREÇO UNIT</th><th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td><td>{item.quantidade}</td>
                  <td>R$ {Number(item.preco).toFixed(2)}</td>
                  <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pdv-controles">
          <div className="pdv-campo">
            <label>Escolher Produto</label>
            <select value={produtoSelecionado} onChange={e => setProdutoSelecionado(e.target.value)}>
              <option value="">Selecione...</option>
              {estoque.filter(p => p.estoque > 0).map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Est. {p.estoque})</option>
              ))}
            </select>
          </div>
          <div className="pdv-campo" style={{width: '80px'}}>
            <label>Quant.</label>
            <input type="number" min="1" value={quantidadeDesejada} onChange={e => setQuantidadeDesejada(e.target.value)} />
          </div>
          <button className="btn-add-item" onClick={adicionarItem}>Adicionar</button>
        </div>
      </div>

      <div className="pdv-direita">
        <div className="pdv-logo"><h1>CAIXA LIVRE</h1></div>
        <div className="pdv-detalhes">
          <p><span>CÓD. VENDA</span> <strong>#{codVenda}</strong></p>
          <p><span>QUANT PRODUTOS</span> <strong>{totalItens}</strong></p>
          <p><span>HORA</span> <strong>{dataHora.toLocaleTimeString()}</strong></p>
        </div>
        <div className="pdv-fechamento">
          <div className="pdv-total">TOTAL <span>R$ {totalCompra.toFixed(2)}</span></div>
          <div className="pdv-pagamento">
            <input type="number" placeholder="Valor Recebido" value={valorPago} onChange={e => setValorPago(e.target.value)} />
            <button className="btn-pagar" onClick={finalizarCompra}>Pagar</button>
          </div>
          <div className="pdv-troco">TROCO <span>R$ {troco.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default TelaCaixa;