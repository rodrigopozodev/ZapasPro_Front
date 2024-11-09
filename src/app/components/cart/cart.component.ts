import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CartComponent implements OnInit {
  cartProducts: CartItem[] = [];
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  discountCode: string = '';
  discountRate: number = 0;
  discountApplied: boolean = false;

  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;
  private readonly userKeyPrefix: string = 'userCart_'; // Prefijo para la clave de localStorage

  constructor(
    private cartService: CartService, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.checkDiscountStatus();
  }

  // Cargar el carrito y calcular los totales
  loadCart(): void {
    const username = this.getUsername(); // Aquí se puede obtener el nombre de usuario
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const savedCart = localStorage.getItem(`${this.userKeyPrefix}${username}`);
      if (savedCart) {
        this.cartProducts = JSON.parse(savedCart);
      } else {
        this.cartProducts = this.cartService.getCart(); // Si no hay datos, se carga el carrito normal
      }
    } else {
      this.cartProducts = this.cartService.getCart(); // En caso de no estar en un entorno de navegador
    }
    this.calculateTotals();
  }

  // Verificar si el descuento ya ha sido aplicado en una sesión anterior
  checkDiscountStatus(): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getUsername();
      const discountCode = localStorage.getItem(`${this.userKeyPrefix}${username}_discountCode`);
      if (discountCode === this.validDiscountCode) {
        this.discountRate = this.discountPercentage;
        this.discountApplied = true;
        this.calculateTotals();
      }
    }
  }

  // Aplicar el descuento solo si no se ha aplicado previamente
  applyDiscount(): void {
    if (this.discountCode === this.validDiscountCode) {
      this.discountRate = this.discountPercentage;
      this.discountApplied = true;
      this.calculateTotals();
      if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
        const username = this.getUsername();
        localStorage.setItem(`${this.userKeyPrefix}${username}_discountCode`, this.discountCode);
      }
    } else {
      alert("Código de descuento inválido");
      this.discountRate = 0;
      this.calculateTotals();
    }
  }

  // Limpiar el carrito
  clearCart(): void {
    const username = this.getUsername();
    this.cartService.clearCart();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      localStorage.removeItem(`${this.userKeyPrefix}${username}`);
    }
    this.loadCart();
  }

  // Realizar la compra y limpiar el descuento
  buy(): void {
    this.clearDiscount();
  }

  // Limpiar el código de descuento después de la compra
  clearDiscount(): void {
    const username = this.getUsername();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      localStorage.removeItem(`${this.userKeyPrefix}${username}_discountCode`);
    }
    this.discountApplied = false;
    this.discountRate = 0;
  }

  // Agregar un producto al carrito
  addProductToCart(product: CartItem): void {
    this.cartService.addToCart(product);
    this.loadCart();
    this.calculateTotals();
  }

  // Calcular los totales (con descuento aplicado)
  calculateTotals(): void {
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    this.total = this.cartProducts.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * this.discountRate);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  // Verificar si localStorage está disponible
  private isLocalStorageAvailable(): boolean {
    try {
      // Intentar usar localStorage solo si está disponible
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      throw new Error('localStorage no está disponible en este entorno.');
    }
  }

  // Obtener el nombre de usuario para asociar el carrito
  private getUsername(): string {
    // Aquí puedes obtener el nombre de usuario actual (por ejemplo, desde un servicio de autenticación)
    // Este es un ejemplo simple, debes sustituirlo con tu lógica de obtención del nombre de usuario
    return 'user123'; // Este es un ejemplo estático
  }
}
