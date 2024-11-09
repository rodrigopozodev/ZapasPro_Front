import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  discountApplied: boolean = false; // Para verificar si ya se aplicó el descuento

  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
    this.checkDiscountStatus(); // Verificar si el descuento ya ha sido aplicado.
  }

  // Cargar el carrito y calcular los totales
  loadCart(): void {
    this.cartProducts = this.cartService.getCart(); // Obtener CartItem[] del carrito
    this.calculateTotals(); // Recalcular los totales
  }

  // Verificar si el descuento ya ha sido aplicado
  checkDiscountStatus(): void {
    const storedDiscountCode = localStorage.getItem('discountCode');
    if (storedDiscountCode === this.validDiscountCode) {
      this.discountApplied = true;
      this.discountRate = this.discountPercentage;
      this.calculateTotals(); // Recalcular totales si el descuento está aplicado
    }
  }

  // Aplicar el descuento solo si no se ha aplicado previamente
  applyDiscount(): void {
    if (this.discountApplied) {
      alert("Este código de descuento ya se ha aplicado y no se puede usar nuevamente.");
      return;
    }

    if (this.discountCode === this.validDiscountCode) {
      this.discountRate = this.discountPercentage;
      this.discountApplied = true;
      this.calculateTotals();
      localStorage.setItem('discountCode', this.discountCode); // Guardar el código en localStorage
    } else {
      alert("Código de descuento inválido");
      this.discountRate = 0;
      this.calculateTotals();
    }
  }

  // Limpiar el carrito
  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart(); // Recargar los productos del carrito
  }

  // Realizar la compra
  buy(): void {
    this.clearDiscount(); // Limpiar el descuento después de la compra
  }

  // Limpiar el código de descuento después de la compra
  clearDiscount(): void {
    localStorage.removeItem('discountCode');
    this.discountApplied = false;
    this.discountRate = 0;
  }

  // Agregar un producto al carrito
  addProductToCart(product: CartItem): void {
    this.cartService.addToCart(product); // Añadir el producto al carrito
    this.loadCart(); // Recargar los productos del carrito
    this.calculateTotals(); // Recalcular los totales después de agregar el producto
  }

  // Calcular los totales (con descuento aplicado)
  calculateTotals(): void {
    // Subtotal: solo los precios originales (sin descuento)
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    // Total: aplicar el descuento solo aquí
    this.total = this.cartProducts.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * this.discountRate); // Precio con descuento
      return total + (discountedPrice * item.quantity); // Sumar el precio con descuento de cada producto
    }, 0);
  }
}
