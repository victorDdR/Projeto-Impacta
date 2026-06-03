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

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        
        // Agora procuramos se o texto digitado bate com alguma categoria existente
        const categoriaSelecionada = categorias.find(
            (c) => c.name.toLowerCase() === form.category.toLowerCase()
        );

        // Se achou na lista, pegamos o ID dela. Se for uma palavra nova, mandamos o ID 0
        const idDaCategoria = categoriaSelecionada ? Number(categoriaSelecionada.id) : 0;
        const nomeDaCategoria = categoriaSelecionada ? categoriaSelecionada.name : form.category;

        if (!nomeDaCategoria.trim()) {
            alert('Por favor, informe uma categoria válida.');
            return;
        }

        try {
            await criarProduto({
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                categoryId: idDaCategoria,
                categoryName: nomeDaCategoria,
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

                {/* --- AQUI ESTÁ A MÁGICA DA CATEGORIA --- */}
                <div className={styles.field}>
                    <label className={styles.label}>Categoria</label>
                    <input
                        className={styles.select}
                        list="lista-categorias"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Selecione ou digite uma categoria"
                        autoComplete="off"
                    />
                    <datalist id="lista-categorias">
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.name} />
                        ))}
                    </datalist>
                </div>
                {/* -------------------------------------- */}

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