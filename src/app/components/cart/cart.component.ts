import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { Product } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';  // Importar Router
import { PurchaseService } from '../../services/purchase.service'; // Importa el servicio


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CartComponent implements OnInit {
  cartProducts: CartItem[] = [];
  subtotal: number = 0;
  total: number = 0;
  discountCode: string = '';
  discountRate: number = 0;
  discountApplied: boolean = false;
  discountUsed: boolean = false;
  showAllProducts: boolean = false;
  discountCodeVisible: boolean = false;
  favorites: Product[] = [];
  
  private userChangedSubscription: Subscription = new Subscription();
  private favoritesSubscription: Subscription = new Subscription(); 
  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;
  private readonly userKeyPrefix: string = 'userCart_';

  constructor(
    private cartService: CartService, 
    private purchaseService: PurchaseService, // Inyectar el servicio
    private favoritesService: FavoritesService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Cargar recibos al inicializar la sesión
ngOnInit(): void {
  this.purchaseService.loadAllReceiptsFromLocalStorage();
  this.loadCart();
  this.checkDiscountStatus();

  this.favoritesSubscription = this.favoritesService.favoriteProducts$.subscribe(favorites => {
    this.favorites = favorites;
  });

  this.userChangedSubscription = this.userService.userChanged$.subscribe(() => {
    this.favoritesService.loadFavorites();
    this.getReceiptsForCurrentUser(); // Cargar recibos del usuario actual al cambiar de cuenta
  });
}

// Método para cargar recibos por usuario y mostrar en el frontend si se necesita
getReceiptsForCurrentUser(): void {
  const userId = this.getCurrentUserName();
  const userReceipts = this.purchaseService.getPurchasedReceipts(userId);
  console.log(`Recibos para ${userId}:`, userReceipts);
}

  loadCart(): void {
    const username = this.getCurrentUserName();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const savedCart = localStorage.getItem(`${this.userKeyPrefix}${username}`);
      if (savedCart) {
        this.cartProducts = JSON.parse(savedCart);
      } else {
        this.cartProducts = this.cartService.getCart();
      }
    } else {
      this.cartProducts = this.cartService.getCart();
    }
    this.calculateTotals();
  }

  checkDiscountStatus(): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getCurrentUserName();
      const discountUsedStatus = localStorage.getItem(`${this.userKeyPrefix}${username}_discountUsed`);
      
      if (discountUsedStatus === 'true') {
        this.discountUsed = true;
        this.discountApplied = false;
        this.discountRate = 0;
      } else {
        const discountAppliedStatus = localStorage.getItem(`${this.userKeyPrefix}${username}_discountApplied`);
        if (discountAppliedStatus === 'true') {
          this.discountApplied = true;
          this.discountRate = this.discountPercentage;
        }
      }
      this.calculateTotals();
    }
  }

  applyDiscount(): void {
    if (this.discountCode === this.validDiscountCode && !this.discountApplied && !this.discountUsed) {
      this.discountRate = this.discountPercentage;
      this.discountApplied = true;
      this.calculateTotals();
      this.saveDiscountStatus();
    } else if (this.discountUsed) {
      alert("El código de descuento ya ha sido usado y no puede aplicarse nuevamente.");
    } else {
      alert("Código de descuento inválido o ya ha sido usado.");
    }
  }

  private saveDiscountStatus(): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getCurrentUserName();
      localStorage.setItem(`${this.userKeyPrefix}${username}_discountApplied`, 'true');
    }
  }

  private markDiscountAsUsed(): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getCurrentUserName();
      localStorage.setItem(`${this.userKeyPrefix}${username}_discountUsed`, 'true');
      localStorage.removeItem(`${this.userKeyPrefix}${username}_discountApplied`);
      this.discountUsed = true;
    }
  }

  buy(): void {
    const userId = this.getCurrentUserName();
    const totalAmount = this.calculateTotal();
    const productDetails: CartItem[] = this.cartProducts.map(cartProduct => ({
      product: { ...cartProduct.product },
      selectedSize: cartProduct.selectedSize,
      quantity: cartProduct.quantity,
      stock: cartProduct.stock,
    }));
  
    // Guardar el recibo en `PurchaseService`
    this.purchaseService.setPurchasedReceipt(userId, productDetails, totalAmount);
  
    // Limpiar el carrito después de la compra
    this.cartService.clearCart();
    this.discountApplied = false;
    this.discountRate = 0;
    this.loadCart();
  }

  private savePurchasedProducts(productDetails: CartItem[], totalAmount: number): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getCurrentUserName();
      const receipt = { date: new Date().toISOString(), products: productDetails, totalAmount: totalAmount };
  
      // Cargar recibos previos, si existen, y añadir el nuevo recibo al historial
      const storedReceipts = localStorage.getItem(`${this.userKeyPrefix}${username}_purchasedProducts`);
      const receipts = storedReceipts ? JSON.parse(storedReceipts) : [];
  
      receipts.push(receipt); // Añadir el nuevo recibo al historial
      localStorage.setItem(`${this.userKeyPrefix}${username}_purchasedProducts`, JSON.stringify(receipts));
    }
  }
  
  private calculateTotal(): number {
    return this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  calculateTotals(): void {
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    if (this.discountApplied && this.discountRate > 0) {
      this.total = this.subtotal * (1 - this.discountRate);
    } else {
      this.total = this.subtotal;
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getCurrentUserName(): string {
    const user = this.userService.getStoredUser();
    return user ? user.username : ''; // Retornamos una cadena vacía si no se encuentra el usuario
  }

  clearCart(): void {
    const username = this.getCurrentUserName(); // Usar getCurrentUserName() aquí también
    this.cartService.clearCart();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      localStorage.removeItem(`${this.userKeyPrefix}${username}`);
    }
    this.loadCart();
  }

  viewMore(): void {
    this.showAllProducts = true;
  }

  getVisibleProducts(): any[] {
    return this.showAllProducts ? this.cartProducts : this.cartProducts.slice(0, 3);
  }

  toggleDiscountCode(): void {
    this.discountCodeVisible = !this.discountCodeVisible;
  }

  // Método para incrementar la cantidad de un producto en el carrito sin loadStock
  incrementQuantity(cartProduct: CartItem): void {
    if (cartProduct.quantity < cartProduct.stock.cantidad) {
      cartProduct.quantity += 1;
      this.cartService.updateCart(cartProduct);
      this.calculateTotals();
    } else {
      console.log('No hay suficiente stock para aumentar la cantidad');
    }
  }

  decrementQuantity(cartProduct: CartItem): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;
      this.cartService.updateCart(cartProduct);
      this.calculateTotals();
    }
  }

  removeFromCart(cartProduct: CartItem): void {
    const index = this.cartProducts.indexOf(cartProduct);
    if (index > -1) {
      this.cartProducts.splice(index, 1);
      this.cartService.updateCart(cartProduct);
      this.calculateTotals();
    }
  }

  ngOnDestroy(): void {
    this.userChangedSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
  }

  toggleFavorite(product: Product): void {
    this.favoritesService.toggleFavorite(product);
  }

  isFavorite(product: Product): boolean {
    return this.favoritesService.isFavorite(product);
  }

  clearFavorites(): void {
    this.favoritesService.clearFavorites();
  }
}
