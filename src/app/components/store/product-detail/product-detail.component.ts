import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  private readonly userKeyPrefix: string = 'user_'; // Definir el prefijo para la clave de usuario

  constructor(
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
    this.loadCart();  // Cargar el carrito al inicializar el componente
  }

  // Obtener los detalles del producto
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

  // Obtener el stock del producto
  getStock(productoId: string) {
    this.productService.getStockByProductoId(productoId).subscribe(response => {
      if (response) {
        this.stock = response;
      }
    });
  }

  // Verificar si una talla está disponible
  isTallaDisponible(talla: string): boolean {
    return this.stock.some(item => item.talla === talla && item.cantidad > 0);
  }

  // Seleccionar la talla
  seleccionarTalla(talla: string): void {
    this.selectedSize = talla;
    console.log(`Talla seleccionada: ${talla}`);
  }

  addToCart(): void {
    // Verificar si el producto y la talla seleccionada no son nulos
    if (this.product && this.selectedSize) {
      const selectedStock = this.stock.find(item => item.talla === this.selectedSize);
      
      if (selectedStock) {
        // Comprobar si ya existe un artículo con el mismo producto y talla en el carrito
        const existingCartItem = this.cartProducts.find(item => 
          item.product.id === this.product.id && item.selectedSize === this.selectedSize);
    
        if (existingCartItem) {
          // Si ya existe un producto con la misma talla, solo mostramos un mensaje
          console.log('El producto con esta talla ya está en el carrito.');
        } else {
          // Si no existe, agregamos el producto con la talla seleccionada al carrito como un nuevo artículo
          const cartItem: CartItem = {
            product: this.product,
            quantity: 1,
            stock: selectedStock,
            selectedSize: this.selectedSize  // Agregamos la talla seleccionada
          };
          
          // Añadir el artículo al carrito
          this.cartService.addToCart(cartItem);
          this.loadCart();  // Actualizamos el carrito después de agregar el nuevo producto
          this.cartVisible = true;  // Mostramos el carrito
        }
      } else {
        console.log('Stock no encontrado para la talla seleccionada');
      }
    } else {
      // Si no hay un producto seleccionado o una talla, mostrar un mensaje de error
      console.log('Selecciona un producto y una talla antes de agregar al carrito');
    }
  }

  // Cerrar la ventana del carrito
  closeCart(): void {
    this.cartVisible = false;
  }

  // Comprar productos
  buy(): void {
    alert("Compra realizada con éxito");
    this.clearDiscount();
    this.cartService.clearCart();
    this.loadCart();
  }

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
  
  // Cargar el código de descuento si ya se ha aplicado en una sesión anterior
  loadDiscountCode(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedDiscountCode = localStorage.getItem('discountCode');
      if (storedDiscountCode === this.validDiscountCode) {
        this.discountCode = storedDiscountCode;
        this.discountRate = this.discountPercentage;
        this.calculateTotals();
      }
    }
  }

  // Aplicar el descuento
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

  // Guardar el código de descuento en localStorage
  saveDiscountCode(): void {
    if (isPlatformBrowser(this.platformId) && this.discountCode === this.validDiscountCode) {
      localStorage.setItem('discountCode', this.discountCode);
    } else if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('discountCode');
    }
  }

  // Limpiar el código de descuento después de la compra
  clearDiscount(): void {
    localStorage.removeItem('discountCode');
    this.discountRate = 0;
    this.discountCode = '';
  }

  // Calcular los totales (con descuento aplicado)
  calculateTotals(): void {
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    this.total = this.cartProducts.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * this.discountRate);
      return total + (discountedPrice * item.quantity);
    }, 0);
  }

  // Método que obtiene el nombre de usuario (para ser implementado)
  private getUsername(): string {
    // Implementa la lógica de cómo obtener el nombre de usuario
    return 'usuario'; // Puedes obtener esto desde un servicio de usuario, como un UserService
  }

  // Verificar si el almacenamiento local está disponible
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
}
