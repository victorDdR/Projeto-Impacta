import styles from "../../pages/TelaCaixa/TelaCaixa.module.css";
import { Product } from "../../types/Product";

interface ControlesProdutoProps {
  estoque: Product[];
  produtoSelecionado: number | "";
  quantidadeDesejada: number;
  onSelecionarProduto: (id: number | "") => void;
  onAlterarQuantidade: (quantidade: number) => void;
  onAdicionar: () => void;
}

export const ProductSelection: React.FC<ControlesProdutoProps> = ({
  estoque,
  produtoSelecionado,
  quantidadeDesejada,
  onSelecionarProduto,
  onAlterarQuantidade,
  onAdicionar
}) => {
  return (
    <div className={styles.pdvControles}>
      <div className={styles.pdvCampo}>
        <label>Escolher Produto</label>
        <select
          value={produtoSelecionado}
          onChange={e =>
            onSelecionarProduto(
              e.target.value ? Number(e.target.value) : ""
            )
          }
        >
          <option value="">Selecione...</option>
          {estoque.map(produto => (
            <option key={produto.id} value={produto.id}>
              {produto.productName} (Est. {produto.stock})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pdvCampoPequeno}>
        <label>Quant.</label>
        <input
          type="number"
          min={1}
          value={quantidadeDesejada}
          onChange={e => onAlterarQuantidade(Number(e.target.value))}
        />
      </div>

      <button className={styles.btnAddItem} onClick={onAdicionar}>
        Adicionar
      </button>
    </div>
  );
};

export default ProductSelection;