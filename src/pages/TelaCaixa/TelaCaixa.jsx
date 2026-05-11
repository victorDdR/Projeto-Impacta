import React, { useState, useEffect } from 'react';
import './TelaCaixa.css';
import { PRODUTOS_INICIAIS } from '../../data/produtos';
import { vender } from '../../api/SaleAPI';

const TelaCaixa = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);
  const [valorPago, setValorPago] = useState('');
  const [dataHora, setDataHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDataHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [estoque, setEstoque] = useState(() => {
    //const data = PRODUTOS_INICIAIS;
    //localStorage.setItem('produtos', JSON.stringify(data));
    const salvos = localStorage.getItem('produtos');
    return salvos ? JSON.parse(salvos) : [];
  });



  const adicionarItem = () => {
    if (!produtoSelecionado || quantidadeDesejada <= 0) return alert('Selecione um produto válido.');
    
    const produtoNoEstoque = estoque.find(p => p.id === Number(produtoSelecionado));
    if (!produtoNoEstoque) return alert('Produto não encontrado.');

    if (Number(quantidadeDesejada) > Number(produtoNoEstoque.stock)) {
      return alert(`Estoque insuficiente! Temos ${produtoNoEstoque.stock} unidades.`);
    }

    const itemJaNoCarrinho = carrinho.find(item => item.id === produtoNoEstoque.id);
    
    if (itemJaNoCarrinho) {
      if (itemJaNoCarrinho.quantidade + Number(quantidadeDesejada) > produtoNoEstoque.stock) {
        return alert('Quantidade excede o estoque disponível.');
      }
      const novoCarrinho = carrinho.map(item => 
        item.id === produtoNoEstoque.id 
          ? { ...item, quantidade: item.quantidade + Number(quantidadeDesejada) } 
          : item
      );
      setCarrinho(novoCarrinho);
    } else {
      setCarrinho([...carrinho, {
          id: produtoNoEstoque.id,
          nome: produtoNoEstoque.productName,
          preco: produtoNoEstoque.price,
          quantidade: Number(quantidadeDesejada)
        }]);
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
    vender(carrinho);
    alert(`Venda finalizada com sucesso! Troco: R$ ${troco.toFixed(2)}`);
    setCarrinho([]);
    setValorPago('');
  };

  return (
    <div className="pdv-container">
      <div className="pdv-esquerda">
        <h2 className="pdv-titulo">Impacta Store</h2>
        
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
              {estoque.map(p => (
                <option key={p.id} value={p.id}>{p.productName} (Est. {p.stock})</option>
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
        <div className="pdv-detalhes">
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