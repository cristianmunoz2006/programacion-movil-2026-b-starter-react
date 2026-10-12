import { describe, it, expect } from 'vitest';
import {
  filterProducts,
  toProductView,
  validateProduct,
  type Product,
  type ProductInput,
} from '../domain/product';

describe('validateProduct', () => {
  it('validateProduct_whenFieldsInvalid_returnsOneErrorPerField', () => {
    // Arrange
    const input: ProductInput = { name: '   ', price: 0, category: 'Otra', stock: -1 };

    // Act
    const result = validateProduct(input);

    // Assert
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      name: 'name es obligatorio',
      price: 'price debe ser un número mayor que 0',
      category: 'category debe ser una de: Bebidas, Snacks, Aseo, Hogar',
      stock: 'stock debe ser un entero mayor o igual que 0',
    });
  });

  it('validateProduct_whenInputValid_returnsIsValid', () => {
    // Arrange
    const input: ProductInput = { name: 'Agua 600 ml', price: 2500, category: 'Bebidas', stock: 10 };

    // Act
    const result = validateProduct(input);

    // Assert
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('toProductView', () => {
  it('toProductView_whenStockVaries_returnsLabelAndPrice', () => {
    // Arrange
    const base: Product = { id: 1, name: '  Arroz  ', price: 1250000, category: 'Hogar', stock: 0 };

    // Act
    const soldOut = toProductView({ ...base, stock: 0 });
    const low = toProductView({ ...base, stock: 3 });
    const available = toProductView({ ...base, stock: 5 });

    // Assert
    expect(soldOut.stockLabel).toBe('Agotado');
    expect(soldOut.isOutOfStock).toBe(true);
    expect(low.stockLabel).toBe('Pocas unidades');
    expect(low.isLowStock).toBe(true);
    expect(available.stockLabel).toBe('Disponible');
    expect(available.isLowStock).toBe(false);
    expect(available.priceLabel).toBe('$ 1.250.000');
    expect(available.name).toBe('Arroz');
  });
});

describe('filterProducts', () => {
  it('filterProducts_whenSearchAndCategory_returnsMatches', () => {
    // Arrange
    const products: Product[] = [
      { id: 1, name: 'Cola Zero', price: 3000, category: 'Bebidas', stock: 8 },
      { id: 2, name: 'Cola Chips', price: 2000, category: 'Snacks', stock: 4 },
      { id: 3, name: 'Jugo de mango', price: 3500, category: 'Bebidas', stock: 6 },
    ];

    // Act
    const result = filterProducts(products, { search: ' COLA ', category: 'Bebidas' });

    // Assert
    expect(result).toEqual([products[0]]);
    expect(result).not.toBe(products);
  });
});