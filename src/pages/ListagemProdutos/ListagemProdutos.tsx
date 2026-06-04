import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import styles from './ListagemProdutos.module.css';

import { Product } from '../../types/Product';
import { Page } from '../../types/Page';

import { buscarProdutos } from '../../services/productService';

function ListagemProdutos() {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // --- ESTADOS DA PAGINAÇÃO ---
    const [paginaAtual, setPaginaAtual] = useState<number>(1);
    const itensPorPagina = 6; // Mude aqui se quiser mais ou menos produtos por página

    const carregarProdutos = async (): Promise<void> => {
        try {
            // Aqui usamos o serviço oficial do seu colega
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
        carregarProdutos(); // Limpamos aquele fetch antigo e usamos a função certa!
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

    // --- LÓGICA MATEMÁTICA DA PAGINAÇÃO ---
    const indiceUltimoProduto = paginaAtual * itensPorPagina;
    const indicePrimeiroProduto = indiceUltimoProduto - itensPorPagina;
    
    // Pegamos apenas o "pedaço" da lista que pertence a esta página
    const produtosDaPagina = produtos.slice(indicePrimeiroProduto, indiceUltimoProduto);
    const totalPaginas = Math.ceil(produtos.length / itensPorPagina);

    const irParaProximaPagina = () => {
        if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
    };

    const irParaPaginaAnterior = () => {
        if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Agora fazemos o map apenas nos produtosDaPagina, não em todos! */}
                {produtosDaPagina.map((produto) => (
                    <ProductCard
                        key={produto.id}
                        produto={produto}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* --- CONTROLES DE PAGINAÇÃO --- */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px', 
                marginTop: '30px', 
                marginBottom: '20px',
                alignItems: 'center' 
            }}>
                <button 
                    onClick={irParaPaginaAnterior} 
                    disabled={paginaAtual === 1}
                    style={{ 
                        padding: '10px 20px', 
                        cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer',
                        opacity: paginaAtual === 1 ? 0.5 : 1,
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Anterior
                </button>
                
                <span style={{ fontWeight: 'bold' }}>
                    Página {paginaAtual} de {totalPaginas}
                </span>
                
                <button 
                    onClick={irParaProximaPagina} 
                    disabled={paginaAtual === totalPaginas}
                    style={{ 
                        padding: '10px 20px', 
                        cursor: paginaAtual === totalPaginas ? 'not-allowed' : 'pointer',
                        opacity: paginaAtual === totalPaginas ? 0.5 : 1,
                        backgroundColor: '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}

export default ListagemProdutos;