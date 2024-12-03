import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { StockService } from '../../services/stock.service';
import { Product } from '../../interfaces/product.interface';
import { Stock } from '../../interfaces/stock.interfaces';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { HostListener } from '@angular/core';


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
  productsPerRow: number = 4; // Valor predeterminado

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  paginatedProducts: Product[] = [];

  // Variables para los botones de cantidad de productos por fila
  showButton4: boolean = true;
  showButton6: boolean = true;
 

  // Carousel
  currentSlideIndex: number = 0;
  private carouselInterval?: any;
  private isReversed: boolean = false;
  private isDragging = false; // Estado de arrastre
  private startX = 0; // Posición inicial del arrastre
  private threshold = 50; // Distancia mínima para cambiar de slide

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
    private favoritesService: FavoritesService  
  ) {}

  ngOnInit(): void {
    Promise.all([this.loadProducts(), this.loadStock()]).then(() => {
      this.updateLayout();
    });
  }
  
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {  // Asegurarse de que estamos en el navegador
      this.startCarousel();
  
      // Referencia al contenedor del carrusel
      const carouselContainer = document.querySelector('.carousel') as HTMLElement;
  
      // Escuchar eventos de mouse
      carouselContainer.addEventListener('mousedown', (e: MouseEvent) => this.startDragging(e));
      carouselContainer.addEventListener('mousemove', (e: MouseEvent) => this.onDrag(e));
      carouselContainer.addEventListener('mouseup', () => this.stopDragging());
      carouselContainer.addEventListener('mouseleave', () => this.stopDragging());
  
      // Escuchar eventos táctiles
      carouselContainer.addEventListener('touchstart', (e: TouchEvent) => this.startDragging(e));
      carouselContainer.addEventListener('touchmove', (e: TouchEvent) => this.onDrag(e));
      carouselContainer.addEventListener('touchend', () => this.stopDragging());
    }
  }
  
  

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateLayout();
  }

  updateLayout() {
    if (isPlatformBrowser(this.platformId)) { // Verificar que estamos en el navegador
      const windowWidth = window.innerWidth;
  
      if (windowWidth < 800) {
        this.productsPerRow = 2; // 2 productos por fila en pantallas menores a 800px
        this.showButton4 = false;
        this.showButton6 = false;
      } else if (windowWidth < 1100) {
        this.productsPerRow = 4; // 4 productos por fila en pantallas menores a 1100px
        this.showButton4 = true;
        this.showButton6 = false; // Ocultar el botón de 6 si el ancho es menor a 1100px
      } else {
        this.productsPerRow = 6; // 6 productos por fila en pantallas mayores a 1100px
        this.showButton4 = true;
        this.showButton6 = true; // Mostrar ambos botones si el ancho es mayor a 1100px
      }
  
      this.itemsPerPage = this.productsPerRow * 2; // Ajustar según el número de productos por fila
      this.calculatePagination();
    }
  }
  
 

  loadProducts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getProducts().subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.filteredProducts = products;
          this.uniqueColors = this.getUniqueColors(this.products);
          this.uniqueGenders = this.getUniqueGenders(this.products);
          this.uniqueMarcas = this.getUniqueMarcas(this.products);
          this.applyFilters();
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar productos', error);
          reject(error);
        },
      });
    });
  }
  
  loadStock(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stockService.getStocks().subscribe({
        next: (stockData: Stock[]) => {
          this.stock = stockData;
          this.uniqueTallas = this.getUniqueTallas(this.stock);
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar el stock', error);
          reject(error);
        },
      });
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
    
    // Solo recalcular la paginación si los productos filtrados cambian
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
    // Solo recalcular la paginación si los productos filtrados han cambiado
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages); // Asegura que no estemos en una página fuera de rango
    this.paginateProducts();
  }
  

  paginateProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    // Cargar solo los productos necesarios para la página actual
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }
  

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateProducts();
      this.scrollToTop(); // Llama al método aquí
    }
  }

  scrollToTop() {
    const container = document.getElementById('products-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  // Modifica los métodos de paginación para incluir `scrollToTop`:
nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.paginateProducts();
    this.scrollToTop(); // Llama al método aquí
  }
}

setPage(pageNumber: number) {
  if (pageNumber >= 1 && pageNumber <= this.totalPages) {
    this.currentPage = pageNumber;
    this.paginateProducts();
    this.scrollToTop(); // Llama al método aquí
  }
}
  

  setProductsPerRow(n: number) {
    this.productsPerRow = n;
    this.itemsPerPage = n * 2;
    this.calculatePagination(); // Recalcular la paginación solo cuando el número de productos por fila cambia
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
    clearInterval(this.carouselInterval); // Detener el carrusel
  
    if (isPlatformBrowser(this.platformId)) {
      const carouselContainer = document.querySelector('.carousel') as HTMLElement;
  
      if (carouselContainer) {
        // Remover eventos de mouse
        carouselContainer.removeEventListener('mousedown', this.startDragging as any);
        carouselContainer.removeEventListener('mousemove', this.onDrag as any);
        carouselContainer.removeEventListener('mouseup', this.stopDragging as any);
        carouselContainer.removeEventListener('mouseleave', this.stopDragging as any);
  
        // Remover eventos táctiles
        carouselContainer.removeEventListener('touchstart', this.startDragging as any);
        carouselContainer.removeEventListener('touchmove', this.onDrag as any);
        carouselContainer.removeEventListener('touchend', this.stopDragging as any);
      }
    }
  }
  
  

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    if (event instanceof MouseEvent) {
      this.startX = event.pageX;
    } else {
      this.startX = event.touches[0].pageX; // `touches` pertenece al evento `TouchEvent`
    }
  }
  
  
  
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
  
    let currentX: number;
    if (event instanceof MouseEvent) {
      currentX = event.pageX;
    } else {
      currentX = event.touches[0].pageX; // `touches` pertenece al evento `TouchEvent`
    }
  
    const deltaX = currentX - this.startX;
  
    if (deltaX > this.threshold) {
      this.previousSlide();
      this.stopDragging();
    } else if (deltaX < -this.threshold) {
      this.nextSlide();
      this.stopDragging();
    }
  }
  
  
  stopDragging() {
    this.isDragging = false;
  }
  
  
}
