import { Category } from '../types/Category';
import { Page } from '../types/Page';

const API_URL = '/impacta/categories';

export const buscarCategorias = async (): Promise<Page<Category>> => {
  const response = await fetch(`${API_URL}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar categorias');
  }

  const data: Page<Category> = await response.json();
  return data;
};