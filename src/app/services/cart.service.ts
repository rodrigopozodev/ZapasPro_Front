import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart.interface';
import { UserService } from './user.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private cart: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);

 constructor(
    private userService: UserService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const user = this.userService.getCurrentUser();
    if (user && isPlatformBrowser(this.platformId)) {
      this.cart = this.loadCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }

  // Agregar producto al carrito
  addToCart(cartItem: CartItem): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.loadCart(user.username);
      const existingProduct = this.cart.find(item => item.product.id === cartItem.product.id);
      if (existingProduct) {
        existingProduct.quantity += cartItem.quantity;
      } else {
        this.cart.push(cartItem);
      }
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }

  // Eliminar producto del carrito
  removeItem(productId: number): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.cart.filter(item => item.product.id !== productId);
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }

  // Limpiar carrito
  clearCart(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = [];
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
    }
  }

  // Guardar carrito en localStorage
  private saveCart(username: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(this.cart));
    }
  }

  // Cargar carrito desde localStorage
  private loadCart(username: string): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const cartData = localStorage.getItem(`cart_${username}`);
      return cartData ? JSON.parse(cartData) : [];
    }
    return [];
  }

  // Obtener total de productos en el carrito
  getTotalItems(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Observable para el contador de productos
  getCartCount() {
    return this.cartCountSubject.asObservable();
  }

  // Obtener el carrito completo
  getCart(): CartItem[] {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.loadCart(user.username); // Refrescar el carrito desde localStorage
      return this.cart;
    }
    return [];
  }

  // Obtener la cantidad de un producto específico en el carrito
  getItemCount(productId: number): number {
    const user = this.userService.getCurrentUser();
    if (user) {
      const productInCart = this.cart.find(item => item.product.id === productId);
      return productInCart ? productInCart.quantity : 0;
    }
    return 0;
  }

  // Logout: elimina el carrito del usuario de localStorage
  logout(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      localStorage.removeItem(`cart_${user.username}`);
    }
  }
}
