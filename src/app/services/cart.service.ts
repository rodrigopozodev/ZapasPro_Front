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
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cart);

  constructor(
    private userService: UserService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const user = this.userService.getCurrentUser();
    if (user && isPlatformBrowser(this.platformId)) {
      this.cart = this.loadCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
      this.cartItemsSubject.next(this.cart); // Emitir carrito al iniciar
    }
  }

  // Añadir un producto al carrito
  addToCart(cartItem: CartItem): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.loadCart(user.username); // Recargar el carrito antes de añadir

      // Buscar si el producto ya existe en el carrito
      const existingProduct = this.cart.find(item =>
        item.product.id === cartItem.product.id && item.selectedSize === cartItem.selectedSize
      );

      if (existingProduct) {
        // Incrementar la cantidad del producto existente
        existingProduct.quantity += 1;
      } else {
        // Agregar el nuevo producto
        this.cart.push(cartItem);
      }

      // Guardar y emitir los cambios
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
      this.cartItemsSubject.next(this.cart); // Emitir carrito actualizado
    }
  }

  // Eliminar un producto del carrito
  removeItem(productId: number): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = this.cart.filter(item => item.product.id !== productId);
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
      this.cartItemsSubject.next(this.cart); // Emitir carrito actualizado
    }
  }

  // Limpiar todo el carrito
  clearCart(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.cart = [];
      this.saveCart(user.username);
      this.cartCountSubject.next(this.getTotalItems());
      this.cartItemsSubject.next(this.cart); // Emitir carrito vacío
    }
  }

  // Guardar el carrito en localStorage
  saveCart(username: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`cart_${username}`, JSON.stringify(this.cart)); 
    }
  }

  // Cargar el carrito desde localStorage
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
      this.cart = this.loadCart(user.username); // Refrescar el carrito
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

  // Logout: eliminar carrito del usuario
  logout(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      localStorage.removeItem(`cart_${user.username}`);
      this.cart = [];
      this.cartCountSubject.next(0);  // Emitir contador 0 al hacer logout
      this.cartItemsSubject.next(this.cart); // Emitir carrito vacío
    }
  }

  // Actualizar carrito con un producto específico
  updateCart(cartItem: CartItem): void {
    const cartItems = this.getCart(); // Obtener carrito actual
    const existingItemIndex = cartItems.findIndex(item => item.product.id === cartItem.product.id && item.selectedSize === cartItem.selectedSize);
    
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex] = cartItem;  // Actualizar artículo
    } else {
      cartItems.push(cartItem);  // Agregar un nuevo artículo
    }

    // Guardar el carrito actualizado
    const user = this.userService.getCurrentUser();
    if (user) {
      this.saveCart(user.username);
      this.cartItemsSubject.next(cartItems); // Emitir carrito actualizado
    }
  }

  // Eliminar un artículo del carrito
  removeFromCart(cartItem: CartItem): void {
    const cart = this.getCart();
    const index = cart.findIndex(item => 
      item.product.id === cartItem.product.id && item.selectedSize === cartItem.selectedSize
    );

    if (index !== -1) {
      cart.splice(index, 1);  // Eliminar artículo
      const user = this.userService.getCurrentUser();
      if (user) {
        this.saveCart(user.username); // Guardar carrito actualizado
        this.cartItemsSubject.next(cart); // Emitir carrito actualizado
      }
    }
  }

  // Obtener observable del carrito completo
  getCartUpdates() {
    return this.cartItemsSubject.asObservable();
  }
}
