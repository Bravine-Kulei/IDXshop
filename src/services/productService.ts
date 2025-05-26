import axios from 'axios';
import {
  Product,
  ProductFilters,
  ProductsResponse,
  CreateProductData,
  UpdateProductData,
  BulkUpdateData,
  StockUpdateData,
  ProductStats,
  ProductCategory
} from '../types/product';

class ProductService {
  private baseURL = '/products';

  /**
   * Get products with filtering, sorting, and pagination
   */
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductData): Promise<Product> {
    try {
      const response = await axios.post(this.baseURL, data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: Partial<UpdateProductData>): Promise<Product> {
    try {
      const response = await axios.put(`${this.baseURL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Bulk delete products
   */
  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/bulk`, {
        data: { productIds: ids }
      });
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw new Error('Failed to delete products');
    }
  }

  /**
   * Bulk update products
   */
  async bulkUpdate(ids: string[], updates: Partial<Product>): Promise<void> {
    try {
      const data: BulkUpdateData = {
        productIds: ids,
        updates
      };
      await axios.patch(`${this.baseURL}/bulk`, data);
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw new Error('Failed to update products');
    }
  }

  /**
   * Update product stock
   */
  async updateStock(data: StockUpdateData): Promise<Product> {
    try {
      const response = await axios.patch(`${this.baseURL}/${data.productId}/stock`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock');
    }
  }

  /**
   * Upload product images
   */
  async uploadImages(productId: string, files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.post(
        `${this.baseURL}/${productId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Failed to upload images');
    }
  }

  /**
   * Delete product image
   */
  async deleteImage(productId: string, imageId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/${productId}/images/${imageId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const response = await axios.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Get inventory statistics
   */
  async getStats(): Promise<ProductStats> {
    try {
      const response = await axios.get(`${this.baseURL.replace('/products', '')}/admin/inventory/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error('Failed to fetch statistics');
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Export products to CSV
   */
  async exportProducts(filters: ProductFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${this.baseURL}/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting products:', error);
      throw new Error('Failed to export products');
    }
  }
}

export const productService = new ProductService();
