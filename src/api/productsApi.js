import axiosClient from './axios';
import {
  mockProducts,
  CATEGORIES,
  BRANDS,
  getProductById as getMockById,
} from '../data/mockProducts';

const USE_MOCK_FALLBACK = true;

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
    return {
      success: true,
      products: data.products || data.data || data,
      total: data.total || (data.products?.length ?? 0),
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
    return { success: true, product: data.product || data, source: 'backend' };
  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      const product = getMockById(id);
      return product
        ? { success: true, product, source: 'mock' }
        : { success: false, product: null, error: 'Product not found' };
    }
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

const applyFiltersToMock = (filters) => {
  let result = [...mockProducts];

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.brand) {
    const brands = Array.isArray(filters.brand) ? filters.brand : [filters.brand];
    result = result.filter((p) => brands.includes(p.brand));
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.inStock);
  }
  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    case 'bestseller':
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      break;
  }

  return { success: true, products: result, total: result.length, source: 'mock' };
};

export default {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  getCategories,
  getBrands,
};