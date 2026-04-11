import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

function Menu() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Impacta Store</div>

      <div className={styles.buttons}>
        <Link to="/produtos" className={styles.button}>
          Produtos
        </Link>

        <Link to="/cadastro" className={styles.button}>
          Cadastrar Produto
        </Link>

        <Link to="/compras" className={styles.button}>
          Registrar Venda
        </Link>
      </div>
    </div>
  );
}

export default Menu;