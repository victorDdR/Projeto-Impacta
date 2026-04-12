import { useEffect, useState } from 'react';
import { buscarCategorias, criarProduto } from '../../api/ProductAPI';
import styles from './CadastroProduto.module.css';
import { CATEGORIAS_INICIAIS } from '../../data/categoria';

function CadastroProduto() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const data = await buscarCategorias();
        //const categorias = CATEGORIAS_INICIAIS;
        setCategorias(data);

        localStorage.setItem('categorias', JSON.stringify(data));
      } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);

        const cache = localStorage.getItem('categorias');
        if (cache) {
          setCategorias(JSON.parse(cache));
        }
      }
    };

    carregarCategorias();
  }, []);
  

  const [form, setForm] = useState({
    name: '',
    category: '',
    stock: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await criarProduto({
        ...form,
        stock: Number(form.stock),
        price: Number(form.price)
      });

      alert('Produto cadastrado com sucesso!');

      setForm({
        name: '',
        category: '',
        stock: '',
        price: ''
      });

    } catch (erro) {
      console.error('Erro ao cadastrar produto:', erro);
      alert('Erro ao cadastrar produto');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Cadastrar Produto</h2>

        <div className={styles.field}>
          <label className={styles.label}>Nome</label>
          <input
            className={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Digite o nome do produto"
          />
        </div>

        <div className={styles.field}>
        <label className={styles.label}>Categoria</label>

        <select
            className={styles.select}
            name="category"
            value={form.category}
            onChange={handleChange}
        >
            <option value="">Selecione uma categoria</option>

            {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
                {categoria.name}
            </option>
            ))}
        </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Estoque</label>
          <input
            className={styles.input}
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Quantidade em estoque"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Preço</label>
          <input
            className={styles.input}
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Preço do produto"
          />
        </div>

        <button type="submit" className={styles.button}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;