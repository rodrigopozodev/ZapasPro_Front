import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product.interface';
import { CartItem } from '../../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product = {} as Product;
  stock: any[] = [];
  cartProducts: CartItem[] = [];
  cartVisible: boolean = false;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  selectedSize: string = '';
  discountCode: string = '';
  discountRate: number = 0;

  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;
  private readonly userKeyPrefix: string = 'user_';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProduct(id);
      this.getStock(id);
    }
    this.loadDiscountCode();
    this.loadCart();
  }

  getProduct(id: string) {
    this.productService.getProductById(id).subscribe(response => {
      if (response.success) {
        const productData = response.product;
        if (productData.imageUrl && !productData.imageUrl.startsWith('http')) {
          productData.imageUrl = `${productData.imageUrl}`;
        }
        this.product = productData;
      }
    });
  }

  getStock(productoId: string) {
    this.productService.getStockByProductoId(productoId).subscribe(response => {
      if (response) {
        this.stock = response;
      }
    });
  }

  isTallaDisponible(talla: string): boolean {
    return this.stock.some(item => item.talla === talla && item.cantidad > 0);
  }

  seleccionarTalla(talla: string): void {
    this.selectedSize = talla;
    console.log(`Talla seleccionada: ${talla}`);
  }

  addToCart(): void {
    if (this.product && this.selectedSize) {
      const selectedStock = this.stock.find(item => item.talla === this.selectedSize);
  
      if (selectedStock) {
        const existingCartItem = this.cartProducts.find(item => 
          item.product.id === this.product.id && item.selectedSize === this.selectedSize
        );
  
        let cartItem: CartItem;  // Declaramos la variable cartItem fuera del if
  
        if (existingCartItem) {
          // Si ya existe, solo incrementa la cantidad en 1
          existingCartItem.quantity += 1;
          cartItem = existingCartItem;  // Asignamos el item existente a cartItem
        } else {
          // Si no existe, agrega un nuevo producto con cantidad 1
          cartItem = {
            product: this.product,
            quantity: 1,
            stock: selectedStock,
            selectedSize: this.selectedSize
          };
          this.cartProducts.push(cartItem);
        }
  
        // Aquí ya tenemos cartItem correctamente definido
        this.cartService.addToCart(cartItem);  // Pasa el producto actualizado
        this.loadCart();
        this.cartVisible = true;
      } else {
        console.log('Stock no encontrado para la talla seleccionada');
      }
    } else {
      console.log('Selecciona un producto y una talla antes de agregar al carrito');
    }
  }
  
  

  closeCart(): void {
    this.cartVisible = false;
  }

  buy(): void {
    alert("Compra realizada con éxito");
    this.clearDiscount();
    this.cartService.clearCart();
    this.loadCart();
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
    this.calculateTotals();  // Asegúrate de calcular los totales después de cargar el carrito
  }
  
  
  loadDiscountCode(): void {
    if (isPlatformBrowser(this.platformId)) {
      const discountUsedStatus = localStorage.getItem(`${this.userKeyPrefix}${this.getUsername()}_discountUsed`);
      if (discountUsedStatus === 'true') {
        this.discountRate = 0;
        this.discountCode = '';
      } else {
        const storedDiscountCode = localStorage.getItem('discountCode');
        if (storedDiscountCode === this.validDiscountCode) {
          this.discountCode = storedDiscountCode;
          this.discountRate = this.discountPercentage;
        }
      }
      this.calculateTotals();
    }
  }

  applyDiscount(): void {
    if (this.discountCode === this.validDiscountCode) {
      this.discountRate = this.discountPercentage;
      this.calculateTotals();
      this.saveDiscountCode();
    } else {
      alert("Código de descuento inválido");
      this.discountRate = 0;
      this.calculateTotals();
      localStorage.removeItem('discountCode');
    }
  }

  saveDiscountCode(): void {
    if (isPlatformBrowser(this.platformId) && this.discountCode === this.validDiscountCode) {
      localStorage.setItem('discountCode', this.discountCode);
    } else if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('discountCode');
    }
  }

  clearDiscount(): void {
    localStorage.removeItem('discountCode');
    this.discountRate = 0;
    this.discountCode = '';
  }

  calculateTotals(): void {
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    this.total = this.cartProducts.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * this.discountRate);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  private getUsername(): string {
    return 'usuario';
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Método para incrementar la cantidad de un producto en el carrito
  incrementQuantity(cartProduct: CartItem): void {
    const selectedStock = this.stock.find(item => item.talla === cartProduct.selectedSize);
    if (selectedStock && cartProduct.quantity < selectedStock.cantidad) {
      cartProduct.quantity += 1;
      this.cartService.updateCart(cartProduct);  // Método para actualizar el carrito en el servicio
      this.loadCart();
    } else {
      console.log('No hay suficiente stock para aumentar la cantidad');
    }
  }

  // Método para decrementar la cantidad de un producto en el carrito
  decrementQuantity(cartProduct: CartItem): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity -= 1;
      this.cartService.updateCart(cartProduct);  // Método para actualizar el carrito en el servicio
      this.loadCart();
    }
  }

  goToCart() {
    // Si estás utilizando Angular Router para navegar a la página del carrito
    this.router.navigate(['/cart']);
  }

  removeFromCart(cartProduct: CartItem): void {
    const index = this.cartProducts.indexOf(cartProduct);
    if (index > -1) {
      this.cartProducts.splice(index, 1);
      this.cartService.updateCart(cartProduct);  // Usa cartProduct, no cartItem
      this.calculateTotals(); // Recalcula los totales después de eliminar el producto
    }
  }
}
