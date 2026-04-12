import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './ListagemProdutos.module.css';

import { buscarProdutos } from '../../api/ProductAPI';
import { PRODUTOS_INICIAIS } from '../../data/produtos';

function ListagemProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const carregarProdutos = async () => {
    try {
      const data = await buscarProdutos();
      //const data = PRODUTOS_INICIAIS
      setProdutos(data);

      localStorage.setItem('produtos', JSON.stringify(data));
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);

      const cache = localStorage.getItem('produtos');
      if (cache) {
        setProdutos(JSON.parse(cache));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);
  
  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyMessage}>Carregando produtos...</p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.emptyMessage}>
          Não há produtos em estoque no momento.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    await carregarProdutos();
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ListagemProdutos;