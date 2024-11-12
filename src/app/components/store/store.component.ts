import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../services/stock.service';
import { Product } from '../../interfaces/product.interface';
import { Stock } from '../../interfaces/stock.interfaces';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})

export class StoreComponent implements OnInit, OnDestroy, AfterViewInit {
  // Productos y filtros
  products: Product[] = [];
  filteredProducts: Product[] = [];
  stock: Stock[] = [];
  selectedColor: string = '';
  selectedTalla: string = '';
  selectedGender: string = '';
  selectedMarca: string = '';
  selectedSort: string = '';
  showFilters: boolean = true;

  uniqueColors: string[] = [];
  uniqueGenders: string[] = [];
  uniqueMarcas: string[] = [];
  uniqueTallas: string[] = [];
  productsPerRow: number = 4;

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  paginatedProducts: Product[] = [];

  // Carousel
  currentSlideIndex: number = 0;
  private carouselInterval?: any;
  private isReversed: boolean = false;
  carouselImages: string[] = [
    "/img/nike sin fondo.png",
    "",
    "/img/Jordan Air Jordan 4 Retro Fear sin fondo.png"
  ];

  constructor(
    public cartService: CartService,
    private productService: ProductService,
    private stockService: StockService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    private favoritesService: FavoritesService  ) {}


  ngOnInit(): void {
    this.loadProducts();
    this.loadStock();
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
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
      }
    });
  }

  loadStock() {
    this.stockService.getStocks().subscribe({
      next: (stockData: Stock[]) => {
        this.stock = stockData;
        this.uniqueTallas = this.getUniqueTallas(this.stock);
      },
      error: (error) => {
        console.error('Error al cargar el stock', error);
      },
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const productStock = this.stock.find(stockItem => stockItem.productoId === product.id && stockItem.talla === this.selectedTalla);
      
      return (
        (this.selectedColor ? product.color.includes(this.selectedColor) : true) &&
        (this.selectedTalla ? productStock !== undefined : true) &&
        (this.selectedGender ? product.gender === this.selectedGender : true) &&
        (this.selectedMarca ? product.marca === this.selectedMarca : true)
      );
    });

    // Lógica de ordenación
    if (this.selectedSort === 'priceHighLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price); // Orden descendente
    } else if (this.selectedSort === 'priceLowHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price); // Orden ascendente
    }
    
    this.calculatePagination(); // Recalcular la paginación después de aplicar filtros y ordenación
  }

  resetFilters() {
    this.selectedColor = '';
    this.selectedTalla = '';
    this.selectedGender = '';
    this.selectedMarca = '';
    this.selectedSort = '';
    this.applyFilters();  // Volver a aplicar los filtros para ver todos los productos
  }
  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateProducts();
  }

  paginateProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateProducts();
    }
  }

  setProductsPerRow(n: number) {
    this.productsPerRow = n;
    this.itemsPerPage = n * 2;
    this.calculatePagination();
  }

  // Toggle de favoritos
  toggleFavorite(product: Product) {
    this.favoritesService.toggleFavorite(product);
  }

  // Verifica si un producto es favorito
  isFavorite(product: Product): boolean {
    return this.favoritesService.isFavorite(product);
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

  getUniqueColors(products: Product[]): string[] {
    return [...new Set(products.flatMap(product => product.color))];
  }

  getUniqueGenders(products: Product[]): string[] {
    return [...new Set(products.map(product => product.gender))];
  }

  getUniqueMarcas(products: Product[]): string[] {
    return [...new Set(products.map(product => product.marca))];
  }

  getUniqueTallas(stock: Stock[]): string[] {
    return [...new Set(stock.map(stockItem => stockItem.talla))];
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselInterval); // Detener el carrusel al destruir el componente
  }
}
