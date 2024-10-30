import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StoreComponent implements OnInit, OnDestroy, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedColor: string = '';
  selectedSize: string = '';
  selectedGender: string = '';
  selectedBrand: string = '';
  selectedSort: string = ''; 
  showFilters: boolean = true;

  uniqueColors: string[] = [];
  uniqueGenders: string[] = [];
  uniqueBrands: string[] = [];
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
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
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
        this.uniqueBrands = this.getUniqueBrands(this.products);
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
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

  getUniqueBrands(products: Product[]): string[] {
    return Array.from(new Set(products.map(product => product.brand)));
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
      return (
        (this.selectedColor ? product.color.includes(this.selectedColor) : true) &&
        (this.selectedGender ? product.gender === this.selectedGender : true) &&
        (this.selectedBrand ? product.brand === this.selectedBrand : true)
        
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
