import { deletarProduto } from '../../api/ProductAPI';
import styles from './ProductCard.module.css';

function ProductCard({ produto, onDelete}) {
  const precoFormatado = Number(produto.price).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

  const remover = async () => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir?');
    if (!confirmacao) return;

    try {
      await deletarProduto(produto.id);
      alert(`Produto: ${produto.id}: ${produto.productName} Deletado.`)
      onDelete();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.card}>
      <span className={styles.id}>ID: #{produto.id}</span>

      <h4 className={styles.title}>{produto.productName}</h4>

      <p className={styles.details}>
        <strong>Categoria:</strong> {produto.category.name}
      </p>

      <p className={styles.stock}>
        <strong>Estoque:</strong> {produto.stock} unidades
      </p>

      <p className={styles.price}>
        R$ {precoFormatado}
      </p>

      <button
        className={styles.deleteButton}
        onClick={remover}
      >
        Excluir Produto
      </button>
    </div>
  );
}

export default ProductCard;