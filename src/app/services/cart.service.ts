import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface'; // Asegúrate de que la ruta a la interfaz Product sea correcta
import { BehaviorSubject } from 'rxjs'; // Importa BehaviorSubject para gestionar los cambios en el carrito

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: { product: Product; quantity: number }[] = []; // Estructura del carrito
  private cartCountSubject = new BehaviorSubject<number>(0); // Subject para el conteo de productos en el carrito

  constructor() {
    this.cart = this.loadCart(); // Cargar el carrito desde localStorage al inicializar el servicio
    this.cartCountSubject.next(this.getTotalItems()); // Inicializa el conteo de productos
  }

  // Método para agregar un producto al carrito
  addToCart(product: Product) {
    const existingProduct = this.cart.find(item => item.product.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1; // Aumentar la cantidad si el producto ya está en el carrito
    } else {
      this.cart.push({ product, quantity: 1 }); // Agregar nuevo producto al carrito
    }
    this.saveCart(); // Guardar el carrito actualizado
    this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
  }

  // Método alias para agregar un producto
  addItem(product: Product) {
    this.addToCart(product); // Redirigir a addToCart
  }

  // Método para eliminar un producto del carrito
  removeItem(productId: number) {
    this.cart = this.cart.filter(item => item.product.id !== productId); // Filtrar el carrito para eliminar el producto
    this.saveCart(); // Guardar los cambios en el carrito
    this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
  }

  // Aumentar la cantidad de un producto en el carrito
  increaseQuantity(productId: number) {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    if (existingProduct) {
      existingProduct.quantity += 1; // Aumentar la cantidad
      this.saveCart(); // Guardar los cambios
      this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
    }
  }

  // Disminuir la cantidad de un producto en el carrito
  decreaseQuantity(productId: number) {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1; // Disminuir la cantidad
      } else {
        this.removeItem(productId); // Eliminar el producto si la cantidad llega a 0
      }
      this.saveCart(); // Guardar los cambios
      this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
    }
  }

  // Limpiar el carrito
  clearCart() {
    this.cart = []; // Reiniciar el carrito
    this.saveCart(); // Guardar el carrito vacío
    this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
  }

  // Obtener todos los productos en el carrito
  getCart(): { product: Product; quantity: number }[] {
    return this.cart; // Retornar el carrito
  }

  // Obtener el total de ítems en el carrito
  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0); // Sumar todas las cantidades
  }

  // Obtener la cantidad de un producto específico en el carrito
  getItemCount(productId: number): number {
    const existingProduct = this.cart.find(item => item.product.id === productId);
    return existingProduct ? existingProduct.quantity : 0; // Retornar la cantidad del producto o 0
  }

  // Obtener un observable para el conteo de productos
  getCartCount() {
    return this.cartCountSubject.asObservable(); // Retornar el observable del conteo
  }

  // Guardar el carrito en el localStorage
  private saveCart() {
    if (typeof window !== 'undefined') { // Verificar si el entorno es navegador
      localStorage.setItem('cart', JSON.stringify(this.cart)); // Guardar el carrito en localStorage
    }
  }

  // Cargar el carrito desde el localStorage
  private loadCart(): { product: Product; quantity: number }[] {
    if (typeof window !== 'undefined') { // Verificar si el entorno es navegador
      const cartData = localStorage.getItem('cart'); // Obtener los datos del carrito
      return cartData ? JSON.parse(cartData) : []; // Parsear los datos o retornar un array vacío
    }
    return []; // Retornar un array vacío si no es navegador
  }

  removeFromCart(productId: number) {
    this.removeItem(productId); // Llama al método removeItem para eliminar el producto
}
}
