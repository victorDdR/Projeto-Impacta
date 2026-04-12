import styles from './ProductCard.module.css';

function ProductCard({ produto, aoRemover }) {
  const precoFormatado = Number(produto.price).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

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
        onClick={() => aoRemover(produto.id)}
      >
        Excluir Produto
      </button>
    </div>
  );
}

export default ProductCard;