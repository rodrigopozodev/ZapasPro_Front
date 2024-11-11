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
import { RouterModule } from '@angular/router';

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
  private favoritesSubscription: Subscription = new Subscription(); // Suscripción a favoritos
  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;
  private readonly userKeyPrefix: string = 'userCart_';

  constructor(
    private cartService: CartService, 
    private favoritesService: FavoritesService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.checkDiscountStatus();

     // Suscribirse al stream de productos favoritos
     this.favoritesSubscription = this.favoritesService.favoriteProducts$.subscribe(favorites => {
      this.favorites = favorites;
    });

    // Suscribirse a los cambios de usuario para actualizar los favoritos
    this.userChangedSubscription = this.userService.userChanged$.subscribe(() => {
      this.favoritesService.loadFavorites(); // Actualizar los favoritos al cambiar de usuario
    });
  }

  loadCart(): void {
    const username = this.getUsername();
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
      const username = this.getUsername();
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
      const username = this.getUsername();
      localStorage.setItem(`${this.userKeyPrefix}${username}_discountApplied`, 'true');
    }
  }

  private markDiscountAsUsed(): void {
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const username = this.getUsername();
      localStorage.setItem(`${this.userKeyPrefix}${username}_discountUsed`, 'true');
      localStorage.removeItem(`${this.userKeyPrefix}${username}_discountApplied`);
      this.discountUsed = true;
    }
  }

  buy(): void {
    this.cartService.clearCart();
    this.markDiscountAsUsed();
    this.discountApplied = false;
    this.discountRate = 0;
    this.loadCart();
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

  private getUsername(): string {
    return 'user123';  // Reemplaza con la lógica para obtener el nombre de usuario real
  }

  clearCart(): void {
    const username = this.getUsername();
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
      this.calculateTotals(); // Recalcular totales sin recargar el carrito completo
    } else {
      console.log('No hay suficiente stock para aumentar la cantidad');
    }
  }

  decrementQuantity(cartProduct: CartItem): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;
      this.cartService.updateCart(cartProduct);
      this.calculateTotals(); // Recalcular totales sin recargar el carrito completo
    }
  }

  removeFromCart(cartProduct: CartItem): void {
    const index = this.cartProducts.indexOf(cartProduct);
    if (index > -1) {
      this.cartProducts.splice(index, 1);
      this.cartService.updateCart(cartProduct);  // Usa cartProduct, no cartItem
      this.calculateTotals(); // Recalcula los totales después de eliminar el producto
    }
  }

  ngOnDestroy(): void {
    // Cancelar las suscripciones para evitar memory leaks
    this.userChangedSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
  }

  toggleFavorite(product: Product): void {
    // Cambiar el estado de favorito de un producto
    this.favoritesService.toggleFavorite(product);
  }

  isFavorite(product: Product): boolean {
    return this.favoritesService.isFavorite(product);
  }

  clearFavorites(): void {
    // Limpiar los favoritos
    this.favoritesService.clearFavorites();
  }
}
