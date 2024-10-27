import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: { product: Product; quantity: number }[] = [];

  constructor() {
    this.cart = this.loadCart();
  }

  // Método para agregar un producto al carrito
  addToCart(product: Product) {
    const existingProduct = this.cart.find(item => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  // Método para agregar un producto al carrito (alias para addToCart)
  addItem(product: Product) {
    this.addToCart(product);
  }

  // Método para eliminar un producto del carrito
  removeItem(productId: number) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  // Aumentar la cantidad de un producto en el carrito
  increaseQuantity(productId: number) {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
      this.saveCart();
    }
  }

  // Disminuir la cantidad de un producto en el carrito
  decreaseQuantity(productId: number) {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
      } else {
        this.removeItem(productId); // Elimina el producto si la cantidad es 0
      }
      this.saveCart();
    }
  }

  // Limpiar el carrito
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Obtener todos los productos en el carrito
  getCart(): { product: Product; quantity: number }[] {
    return this.cart;
  }

  // Obtener el total de ítems en el carrito
  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtener la cantidad de un producto específico en el carrito
  getItemCount(productId: number): number {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    return existingProduct ? existingProduct.quantity : 0;
  }

  // Guardar el carrito en el localStorage
  private saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  // Cargar el carrito desde el localStorage
  private loadCart(): { product: Product; quantity: number }[] {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : [];
    }
    return [];
  }
}
