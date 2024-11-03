import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../services/stock.service';
import { Product } from '../../interfaces/product.interface';
import { Stock } from '../../interfaces/stock.interfaces'; // Importación de la interfaz Stock
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class StoreComponent implements OnInit, OnDestroy, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  stock: Stock[] = []; // Almacenará los datos de inventario de tallas
  selectedColor: string = '';
  selectedTalla: string = ''; // Añadido: propiedad de talla seleccionada
  selectedGender: string = '';
  selectedMarca: string = '';
  selectedSort: string = ''; 
  showFilters: boolean = true;

  uniqueColors: string[] = [];
  uniqueGenders: string[] = [];
  uniqueMarcas: string[] = [];
  uniqueTallas: string[] = []; // Añadido: propiedad para las tallas únicas
  productsPerRow: number = 4;

  currentSlideIndex: number = 0;
  private carouselInterval?: any;
  private isReversed: boolean = false;
  carouselImages: string[] = [
    "/img/Nike Air Max Plus Drift.png",
    "/img/Air%20Force%201%20SP.png",
    "/img/Nike-AIR_FORCE_1_07_amarilla.png",
    "/img/Nike-AIR_FORCE_1_07.png"
  ];

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private stockService: StockService, // Usar servicio StockService en lugar de ProductService para inventario
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadStock(); // Cargar inventario de tallas
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startCarousel();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = products;
        this.uniqueColors = this.getUniqueColors(this.products);
        this.uniqueGenders = this.getUniqueGenders(this.products);
        this.uniqueMarcas = this.getUniqueMarcas(this.products);
      },
      error: (error: unknown) => { // Cambio: especificar el tipo de error
        console.error('Error al cargar productos', error);
      },
    });
  }

  // Método para cargar el stock de tallas desde el servicio de inventario
  loadStock() {
    this.stockService.getStocks().subscribe({ // Usar servicio de inventario StockService
      next: (stockData: Stock[]) => {
        this.stock = stockData;
        this.uniqueTallas = this.getUniqueTallas(this.stock); // Generar tallas únicas desde el inventario
      },
      error: (error: unknown) => { // Cambio: especificar el tipo de error
        console.error('Error al cargar el stock', error);
      },
    });
  }

  startCarousel() {
    this.resetCarouselInterval(5000);
  }

  resetCarouselInterval(intervalTime: number) {
    clearInterval(this.carouselInterval);
    this.carouselInterval = setInterval(() => {
      this.moveSlide();
    }, intervalTime);
  }

  moveSlide() {
    if (!this.isReversed) {
      if (this.currentSlideIndex < this.carouselImages.length - 1) {
        this.currentSlideIndex++;
      } else {
        this.isReversed = true;
        this.currentSlideIndex--;
      }
    } else {
      if (this.currentSlideIndex > 0) {
        this.currentSlideIndex--;
      } else {
        this.isReversed = false;
        this.currentSlideIndex++;
      }
    }
    this.cdr.detectChanges();
  }

  nextSlide() {
    clearInterval(this.carouselInterval);
    this.isReversed = false;
    if (this.currentSlideIndex < this.carouselImages.length - 1) {
      this.currentSlideIndex++;
    } else {
      this.isReversed = true;
      this.currentSlideIndex--;
    }
    this.cdr.detectChanges();
    this.resetCarouselInterval(5000);
  }

  previousSlide() {
    clearInterval(this.carouselInterval);
    this.isReversed = true;
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    } else {
      this.isReversed = false;
      this.currentSlideIndex++;
    }
    this.cdr.detectChanges();
    this.resetCarouselInterval(5000);
  }

  ngOnDestroy() {
    clearInterval(this.carouselInterval);
  }

  getUniqueColors(products: Product[]): string[] {
    return Array.from(new Set(products.map(product => product.color).flat()));
  }

  getUniqueGenders(products: Product[]): string[] {
    return Array.from(new Set(products.map(product => product.gender)));
  }

  getUniqueMarcas(products: Product[]): string[] {
    return Array.from(new Set(products.map(product => product.marca)));
  }

  getUniqueTallas(stock: Stock[]): string[] {  // Obtener tallas únicas desde el inventario
    return Array.from(new Set(stock.map(item => item.talla)));
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  setProductsPerRow(n: number) {
    this.productsPerRow = n;
    this.applyFilters();
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }

  buyNow() {
    const productToBuy = this.products.find(product => product.imageUrl === this.carouselImages[this.currentSlideIndex]);
    
    if (productToBuy) {
      this.cartService.addItem(productToBuy);
      this.router.navigate(['/cart']);
    } else {
      console.error('Producto no encontrado');
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const productStock = this.stock.find(stockItem => stockItem.productoId === product.id && stockItem.talla === this.selectedTalla);
      
      return (
        (this.selectedColor ? product.color.includes(this.selectedColor) : true) &&
        (this.selectedTalla ? productStock !== undefined : true) && // Filtra por existencia de talla en stock
        (this.selectedGender ? product.gender === this.selectedGender : true) &&
        (this.selectedMarca ? product.marca === this.selectedMarca : true)
      );
    });

    if (this.selectedSort === 'recent') {
      this.filteredProducts.sort((a, b) => 0);
    } else if (this.selectedSort === 'priceHighLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.selectedSort === 'priceLowHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    }
  }
}
