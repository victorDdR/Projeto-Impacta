import styles from "../../pages/TelaCaixa/TelaCaixa.module.css";

interface FechamentoVendaProps {
  totalCompra: number;
  valorPago: number | "";
  troco: number;
  onAlterarValorPago: (valor: number | "") => void;
  onFinalizar: () => void;
}

export const Sale: React.FC<FechamentoVendaProps> = ({
  totalCompra,
  valorPago,
  troco,
  onAlterarValorPago,
  onFinalizar
}) => {
  return (
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
            onAlterarValorPago(
              e.target.value ? Number(e.target.value) : ""
            )
          }
        />
        <button className={styles.btnPagar} onClick={onFinalizar}>
          Pagar
        </button>
      </div>

      <div className={styles.pdvTroco}>
        TROCO <span>R$ {troco.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Sale;