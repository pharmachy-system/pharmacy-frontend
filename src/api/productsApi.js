import axiosClient from '../utils/axiosClient';
import { CATEGORIES, BRANDS } from '../data/mockProducts';

export const getAllProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.search) params.append('q', filters.search);
    if (filters.inStock) params.append('inStock', 'true');

    const { data } = await axiosClient.get(`/medicines?${params.toString()}`);
    const products = data.medicines || data.products || data.data || [];
    return {
      success: true,
      products,
      total: data.total || data.pagination?.total || data.pagination?.totalItems || products.length,
      source: 'backend',
    };
  } catch (error) {
    console.warn('[productsApi] Backend unavailable, using mock:', error.message);
    if (USE_MOCK_FALLBACK) return applyFiltersToMock(filters);
    return { success: false, products: [], total: 0, error: error.message };
  }
};

export const getProductById = async (id) => {
  try {
    const { data } = await axiosClient.get(`/medicines/${id}`);
    return { success: true, product: data.medicine || data.product || data, source: 'backend' };
  } catch (error) {
    return { success: false, product: null, error: error.message };
  }
};

export const getProductsByCategory = async (categoryId) =>
  getAllProducts({ category: categoryId });

export const searchProducts = async (query) =>
  getAllProducts({ search: query });

export const getCategories = async () => {
  try {
    const { data } = await axiosClient.get('/categories');
    return { success: true, categories: data.categories || data, source: 'backend' };
  } catch {
    return { success: true, categories: CATEGORIES, source: 'mock' };
  }
};

export const getBrands = async () => {
  try {
    const { data } = await axiosClient.get('/brands');
    return { success: true, brands: data.brands || data, source: 'backend' };
  } catch {
    return { success: true, brands: BRANDS, source: 'mock' };
  }
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories,
  getBrands,
};