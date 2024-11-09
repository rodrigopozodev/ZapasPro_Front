import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product.interface';
import { CartItem } from '../../../interfaces/cart.interface';  // Asegúrate de importar la interfaz CartItem
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  stock: any[] = [];
  cartProducts: CartItem[] = [];  // Cambiar el tipo a CartItem[]
  cartVisible: boolean = false;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  selectedSize: string = '';  // Para almacenar la talla seleccionada
  discountCode: string = '';
  discountRate: number = 0;

  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProduct(id);
      this.getStock(id);
    }
    this.loadDiscountCode();  // Cargar el código de descuento al iniciar
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

  // Agregar al carrito
  addToCart(): void {
    if (this.product && this.selectedSize) {
      const selectedStock = this.stock.find(item => item.talla === this.selectedSize);
  
      if (selectedStock) {
        const cartItem: CartItem = {
          product: this.product,
          quantity: 1,
          stock: selectedStock  // Agregar el stock seleccionado aquí
        };
        this.cartService.addToCart(cartItem);  // Pasar el CartItem con stock al servicio
        this.loadCart();
        this.cartVisible = true;
      } else {
        console.log('Stock no encontrado para la talla seleccionada');
      }
    } else {
      console.log('Selecciona un producto y una talla antes de agregar al carrito');
    }
  }
  

  // Cerrar la ventana del carrito
  closeCart(): void {
    this.cartVisible = false;
  }

  // Comprar productos
  buy() {
    // Lógica de compra
  }

  // Cargar el carrito y calcular los totales
  loadCart(): void {
    this.cartProducts = this.cartService.getCart();  // Obtener CartItem[] del carrito
    this.calculateTotals(); // Recalcular los totales
  }

  // Cargar el código de descuento
  loadDiscountCode(): void {
    const storedDiscountCode = localStorage.getItem('discountCode');
    if (storedDiscountCode === this.validDiscountCode) {
      this.discountCode = storedDiscountCode;
      this.discountRate = this.discountPercentage;
    }
  }

  // Aplicar el descuento
  applyDiscount(): void {
    if (this.discountCode === this.validDiscountCode) {
      this.discountRate = this.discountPercentage;
      this.calculateTotals();
      this.saveDiscountCode(); // Guardar el código de descuento
    } else {
      alert("Código de descuento inválido");
      this.discountRate = 0;
      this.calculateTotals();
      localStorage.removeItem('discountCode'); // Eliminar el código de descuento si es inválido
    }
  }

  // Guardar el código de descuento
  saveDiscountCode(): void {
    if (this.discountCode === this.validDiscountCode) {
      localStorage.setItem('discountCode', this.discountCode); // Guardar en localStorage
    } else {
      localStorage.removeItem('discountCode'); // Eliminar el código si es inválido
    }
  }

  // Calcular los totales (con descuento aplicado)
  calculateTotals(): void {
    this.subtotal = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    // Calcular el total con descuento
    this.total = this.cartProducts.reduce((total, item) => {
      const discountedPrice = item.product.price - (item.product.price * this.discountRate); // Precio con descuento
      return total + (discountedPrice * item.quantity); // Sumar el precio con descuento de cada producto
    }, 0);
  }
}
