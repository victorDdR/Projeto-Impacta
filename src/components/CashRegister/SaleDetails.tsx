import styles from "../../pages/TelaCaixa/TelaCaixa.module.css";
interface DetalhesVendaProps {
  totalItens: number;
  horaAtual: string;
}

export const SaleDetails: React.FC<DetalhesVendaProps> = ({
  totalItens,
  horaAtual
}) => {
  return (
    <div className={styles.pdvDetalhes}>
      <p>
        <span>QUANT PRODUTOS</span>
        <strong>{totalItens}</strong>
      </p>
      <p>
        <span>HORA</span>
        <strong>{horaAtual}</strong>
      </p>
    </div>
  );
};

export default SaleDetails;