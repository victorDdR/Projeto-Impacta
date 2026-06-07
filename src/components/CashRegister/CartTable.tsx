import styles from "../../pages/TelaCaixa/TelaCaixa.module.css";
import { CartItem } from "../../types/CartItem";

interface CarrinhoTabelaProps {
  carrinho: CartItem[];
}

export const CartTable: React.FC<CarrinhoTabelaProps> = ({ carrinho }) => {
  return (
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
  );
};

export default CartTable;