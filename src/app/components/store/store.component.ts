import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class StoreComponent implements OnInit {
  products: Product[] = []; // Lista de todos los productos
  filteredProducts: Product[] = []; // Lista de productos filtrados
  selectedColor: string = '';
  selectedSize: string = ''; // Cambiado a string para manejar el tamaño seleccionado
  selectedGender: string = '';
  selectedBrand: string = '';
  showFilters: boolean = true; // Inicialmente mostrar filtros

  uniqueColors: string[] = []; // Lista única de colores
  uniqueGenders: string[] = []; // Lista única de géneros
  uniqueBrands: string[] = []; // Lista única de marcas
  productsPerRow: number = 4; // Valor por defecto

  constructor(public cartService: CartService, private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Cargar productos y obtener listas únicas para filtros
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products; // Asignar productos obtenidos
      this.filteredProducts = this.products;
      this.uniqueColors = this.getUniqueColors(this.products);
      this.uniqueGenders = this.getUniqueGenders(this.products);
      this.uniqueBrands = this.getUniqueBrands(this.products);
    });
  }

  addToCart(product: Product): void {
    if (this.selectedSize) {
      const productWithSize = { ...product, selectedSize: this.selectedSize };
      this.cartService.addToCart(productWithSize);
    } else {
      console.warn('Por favor selecciona un tamaño.'); // Mensaje de advertencia si no hay tamaño seleccionado
    }
  }

  applyFilters() {
    // Filtrar productos según las selecciones
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.selectedColor ? product.color === this.selectedColor : true) &&
        (this.selectedGender ? product.gender === this.selectedGender : true) &&
        (this.selectedBrand ? product.brand === this.selectedBrand : true)
      );
    });
  }

  getUniqueColors(products: Product[]): string[] {
    // Obtener colores únicos
    const colors = new Set(products.map(product => product.color));
    return Array.from(colors);
  }

  getUniqueGenders(products: Product[]): string[] {
    // Obtener géneros únicos
    const genders = new Set(products.map(product => product.gender));
    return Array.from(genders);
  }

  getUniqueBrands(products: Product[]): string[] {
    // Obtener marcas únicas
    const brands = new Set(products.map(product => product.brand));
    return Array.from(brands);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters; // Alternar visibilidad
  }

  setProductsPerRow(n: number) {
    this.productsPerRow = n; // Establecer el número de productos por fila
    this.applyFilters(); // Aplicar filtros si es necesario
  }  
}
