import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Product[] = [];

  constructor() {}

  // Método para agregar un producto al carrito
  addToCart(product: Product) {
    this.cart.push(product);
    this.saveCart();
  }

  // Obtener todos los productos del carrito
  getCart(): Product[] {
    return this.loadCart();
  }

  // Guardar el carrito en el almacenamiento local
  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Cargar el carrito desde el almacenamiento local
  private loadCart(): Product[] {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
    this.saveCart();
  }
}
