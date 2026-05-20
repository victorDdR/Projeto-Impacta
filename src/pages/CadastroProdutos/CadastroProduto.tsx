import { useEffect, useState } from 'react';
import styles from './CadastroProduto.module.css';
import { criarProduto } from '../../services/productService';
import { buscarCategorias } from '../../services/categoryService';
import { Category } from '../../types/Category';

function CadastroProduto() {
    const [categorias, setCategorias] = useState<Category[]>([]);

    const carregarCategorias = async (): Promise<void> => {
    try {
        const page = await buscarCategorias(); 

        setCategorias(page.content);
        localStorage.setItem('categorias', JSON.stringify(page.content));
    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);

        const cache = localStorage.getItem('categorias');
        if (cache) {
        setCategorias(JSON.parse(cache) as Category[]);
        }
    }
    };

    useEffect(() => {
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
    const categoriaSelecionada = categorias.find(
        (c) => c.id === Number(form.category)
    );

    if (!categoriaSelecionada) {
        alert('Categoria inválida');
        return;
    }

    try {
        await criarProduto({
            name: form.name,
            price: Number(form.price),
            stock: Number(form.stock),
            categoryId: Number(categoriaSelecionada.id),
            categoryName: categoriaSelecionada.name,
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