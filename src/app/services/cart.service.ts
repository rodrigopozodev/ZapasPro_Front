import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface'; // Asegúrate de que la ruta a la interfaz Product sea correcta
import { CartItem } from '../interfaces/cart.interface'; // Asegúrate de que la ruta a la interfaz CartItem sea correcta
import { BehaviorSubject } from 'rxjs'; // Importa BehaviorSubject para gestionar los cambios en el carrito
import { UserService } from './user.service'; // Importar el servicio de usuario

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = []; // Cambiar el tipo a CartItem
  private cartCountSubject = new BehaviorSubject<number>(0); // Subject para el conteo de productos en el carrito

  constructor(private userService: UserService) {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.loadCart(user.username); // Cargar el carrito específico del usuario
      this.cartCountSubject.next(this.getTotalItems()); // Inicializa el conteo de productos
    }
  }

  // Al agregar un nuevo producto al carrito
  addToCart(cartItem: CartItem): void { // Cambiar el parámetro a CartItem
    const user = this.userService.getCurrentUser();
    if (user) {
      // Primero obtenemos el carrito actual
      this.cart = this.loadCart(user.username);
      const existingProduct = this.cart.find(item => item.product.id === cartItem.product.id);
      if (existingProduct) {
        existingProduct.quantity += cartItem.quantity; // Aumentar la cantidad si el producto ya está en el carrito
      } else {
        this.cart.push(cartItem); // Agregar nuevo producto al carrito
      }
      this.saveCart(user.username); // Guardar el carrito específico del usuario
      this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
    }
  }

  // Método para eliminar un producto del carrito
  removeItem(productId: number): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.cart.filter(item => item.product.id !== productId); // Filtrar el carrito para eliminar el producto
      this.saveCart(user.username); // Guardar el carrito actualizado
      this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
    }
  }

  // Método para limpiar el carrito
  clearCart(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = []; // Reiniciar el carrito
      this.saveCart(user.username); // Guardar el carrito vacío
      this.cartCountSubject.next(this.getTotalItems()); // Emitir el nuevo conteo de productos
    }
  }

  // Guardar el carrito en localStorage con una clave única por usuario
  private saveCart(username: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${username}`, JSON.stringify(this.cart)); // Guardar el carrito del usuario en localStorage
    }
  }

  // Método para cargar el carrito desde localStorage
  private loadCart(username: string): CartItem[] { // Cambiar el tipo de retorno a CartItem[]
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem(`cart_${username}`);
      return cartData ? JSON.parse(cartData) : []; // Cargar el carrito del usuario desde localStorage
    }
    return []; // Retornar un array vacío si no es navegador
  }

  // Método para obtener el total de ítems en el carrito
  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0); // Sumar todas las cantidades
  }

  // Obtener un observable para el conteo de productos
  getCartCount() {
    return this.cartCountSubject.asObservable(); // Retornar el observable del conteo
  }

  // Obtener el carrito completo
  getCart(): CartItem[] { // Cambiar el tipo de retorno a CartItem[]
    const user = this.userService.getCurrentUser();
    if (user) {
      return this.loadCart(user.username); // Cargar el carrito específico del usuario
    }
    return []; // Retornar un carrito vacío si no hay usuario
  }

  // Agrega este método en cart.service.ts
  getItemCount(productId: number): number {
    const user = this.userService.getCurrentUser();
    if (user) {
      const productInCart = this.cart.find(item => item.product.id === productId);
      return productInCart ? productInCart.quantity : 0; // Retorna la cantidad del producto o 0 si no está en el carrito
    }
    return 0; // Si no hay usuario, retorna 0
  }

  logout(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      // Elimina el carrito del usuario del localStorage al cerrar sesión
      localStorage.removeItem(`cart_${user.username}`);
    }
  }
}
