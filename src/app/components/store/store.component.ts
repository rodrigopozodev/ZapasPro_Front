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
  selectedSize: { [key: number]: string } = {}; // Cambiado a objeto para manejar tamaños por producto
  selectedGender: string = '';
  selectedBrand: string = '';

  uniqueColors: string[] = []; // Lista única de colores
  uniqueSizes: string[] = []; // Lista única de tallas
  uniqueGenders: string[] = []; // Lista única de géneros
  uniqueBrands: string[] = []; // Lista única de marcas

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
    const size = this.selectedSize[product.id]; // Obtener el tamaño seleccionado para este producto
    if (size) {
      const productWithSize = { ...product, selectedSize: size };
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
}
