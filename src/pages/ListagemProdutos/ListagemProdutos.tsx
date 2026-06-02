import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './ListagemProdutos.module.css';

import { Product } from '../../types/Product';
import { Page } from '../../types/Page';

import { buscarProdutos } from '../../services/productService';

function ListagemProdutos() {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const carregarProdutos = async (): Promise<void> => {
        try {
            const page: Page<Product> = await buscarProdutos();

            setProdutos(page.content);
            localStorage.setItem('produtos', JSON.stringify(page.content));
        } 
        catch (erro) {
            console.error("Erro ao carregar produtos:", erro);

            const cache = localStorage.getItem('produtos');
            if (cache) {
            setProdutos(JSON.parse(cache) as Product[]);
            }
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    // Aqui nós chamamos a API oficial (a rota que o seu colega criou)
    fetch('/impacta/products')
      .then((resposta) => resposta.json())
      .then((dadosReais) => {
        setProdutos(dadosReais); // Salva os produtos do banco na tela!
        setLoading(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar produtos da API:", erro);
        setLoading(false);
      });
  }, []);
  
    if (loading) {
    return (
        <div className={styles.container}>
        <p className={styles.emptyMessage}>Carregando produtos...</p>
        </div>
    );
    }

    if (produtos.length === 0) {
    return (
        <div className={styles.container}>
        <p className={styles.emptyMessage}>
            Não há produtos em estoque no momento.
        </p>
        </div>
    );
    }

    const handleDelete = async () => {
    await carregarProdutos();
    };

    return (
    <div className={styles.container}>
        <div className={styles.grid}>
        {produtos.map((produto) => (
            <ProductCard
            key={produto.id}
            produto={produto}
            onDelete={handleDelete}
            />
        ))}
        </div>
    </div>
    );
    }

export default ListagemProdutos;