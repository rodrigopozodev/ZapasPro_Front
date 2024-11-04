import { Component } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  private apiUrlProducts = 'http://localhost:3000/api/products';

  showProducts = false; // Inicialmente ocultar productos
  products: Product[] = [];
  currentProduct: Product | null = null;
  searchProductTerm: string = ''; 
  paginatedProducts: Product[] = [];
  filteredProducts: Product[] = []; 
  totalProductPages: number = 1; 
  currentProductPage: number = 1; 
  selectedProduct: any; 
  showProductForm: boolean = false; 
  newProduct: any = {}; 
  isEditing = false; 
  genders: string[] = ['Masculino', 'Femenino', 'Unisex']; 
  genderFilter: string = ''; 
  brandFilter: string = ''; // Nuevo filtro por marca
  itemsPerPage: number = 5; 
  showEditForm = false;
  selectedColorFilter: string = ''; 
  colors: string[] = []; // Inicializar vacío para que se llene con los colores disponibles
  marcas: string[] = []; // Inicializar vacío para que se llene con las marcas disponibles

  imageUrls: string[] = [
    '/img/Nike Air Max Plus Drift.png',
    '/img/Nike Dunk Low.png',
    '/img/Nike Air Max Plus.png',
    '/img/Nike Air Max Excee.png',
    '/img/Nike Air Force 1 Low EVO.png',
    '/img/Nike Air Force 1 Sage Low.png', 
    '/img/Nike Air Max 1.png',           
    '/img/Nike Air Max 90.png',         
    '/img/Nike SB Dunk Low Pro Premium.png',
    '/img/Nike_Air Max Plus Drift.png', 
    '/img/Adidas_Gazelle_Negro.png',         
    '/img/Adidas_Handball_Spezial_Azul.png', 
    '/img/Adidas_Handball_Spezial_Naranjas.png', 
    '/img/Adidas_Handball_Spezial_Turkesa.png', 
    '/img/Adidas_Stan_Smith_Blanco.png',
    '/img/Puma Rebound.png',              
    '/img/Puma Mayze.png',                
    '/img/Puma Mayze Luxe.png',           
    '/img/Puma Ca Pro Classic.png',       
    '/img/Puma 180.png'                   
  ];
  
  // Agregar selectedFilter para manejar el filtro
  selectedFilter: string = ''; // Propiedad para manejar el filtro seleccionado

  constructor(private http: HttpClient, private router: Router) {
    this.loadProducts();
  }

  // Método para cargar productos
  public loadProducts(): void {
    this.getProducts(this.currentProductPage).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.extractUniqueBrands(); // Extraer marcas únicas
        this.extractUniqueColors(); // Extraer colores únicos
        this.filterProducts(); 
        this.showProducts = true; 
      },
      (error: any) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }

  public getProducts(page: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlProducts}?_page=${page}&_limit=${this.itemsPerPage}`);
  }

  // Extraer marcas únicas
  private extractUniqueBrands(): void {
    const uniqueBrandsSet = new Set<string>();
    this.products.forEach(product => {
      uniqueBrandsSet.add(product.marca);
    });
    this.marcas = Array.from(uniqueBrandsSet); // Asignar marcas únicas a la propiedad
  }

  // Extraer colores únicos
  private extractUniqueColors(): void {
    const uniqueColorsSet = new Set<string>();
    this.products.forEach(product => {
      uniqueColorsSet.add(product.color);
    });
    this.colors = Array.from(uniqueColorsSet); // Asignar colores únicos a la propiedad
  }

  // Filtrar colores basados en la marca seleccionada
  public filterColorsByBrand(selectedBrand: string) {
    if (selectedBrand) {
      const filteredProducts = this.products.filter(product => product.marca === selectedBrand);
      const uniqueColorsSet = new Set<string>(filteredProducts.map(product => product.color));
      this.colors = Array.from(uniqueColorsSet);
      this.selectedColorFilter = ''; // Reiniciar el filtro de color
    } else {
      this.extractUniqueColors(); // Si no hay marca seleccionada, extraer todos los colores
    }
  }

  // Filtrar marcas basados en el color seleccionado
  public filterBrandsByColor(selectedColor: string) {
    if (selectedColor) {
      const filteredProducts = this.products.filter(product => product.color === selectedColor);
      const uniqueBrandsSet = new Set<string>(filteredProducts.map(product => product.marca));
      this.marcas = Array.from(uniqueBrandsSet);
      this.brandFilter = ''; // Reiniciar el filtro de marca
    } else {
      this.extractUniqueBrands(); // Si no hay color seleccionado, extraer todas las marcas
    }
  }

  // Actualizar el método para calcular el total de páginas
  calculateTotalProductPages(): void {
    const totalItems = this.filteredProducts.length; // Cambia esto para que cuente los productos filtrados
    this.totalProductPages = Math.ceil(totalItems / this.itemsPerPage);
    this.updateProductList();
  }

  public editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.isEditing = true; 
  }

  public cancelProduct(): void {
    this.selectedProduct = null; 
    this.showProductForm = false; 
    this.newProduct = {}; 
  }

  deleteProduct(productId: number) {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      this.http.delete(`${this.apiUrlProducts}/${productId}`).subscribe(
        (response) => {
          console.log(`Producto con ID: ${productId} eliminado`, response);
          this.products = this.products.filter(product => product.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
          this.extractUniqueBrands(); // Actualizar las marcas después de eliminar un producto
          this.extractUniqueColors(); // Actualizar los colores después de eliminar un producto
          this.calculateTotalProductPages(); 
          this.updateProductList();
        },
        (error: any) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    } else {
      console.log('Eliminación cancelada.');
    }
  }

  filterProducts() {
    let filtered = this.products;

    if (this.searchProductTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchProductTerm.toLowerCase())
      );
    }

    if (this.genderFilter) {
      filtered = filtered.filter(product => product.gender.toLowerCase() === this.genderFilter.toLowerCase());
    }

    if (this.selectedColorFilter) {
      filtered = filtered.filter(product => product.color.toLowerCase() === this.selectedColorFilter.toLowerCase()); // Corregido para comparar el tipo de unión
    }

    if (this.brandFilter) {
      filtered = filtered.filter(product => product.marca.toLowerCase() === this.brandFilter.toLowerCase());
    }

    // Filtrar por el filtro seleccionado
    if (this.selectedFilter) {
      filtered = filtered.filter(product => 
        product.gender.toLowerCase() === this.selectedFilter.toLowerCase() || 
        product.color.toLowerCase() === this.selectedFilter.toLowerCase() || 
        product.marca.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }

    this.filteredProducts = filtered;
    this.calculateTotalProductPages(); // Llama aquí para recalcular el total de páginas después de filtrar
    this.updateProductList();
  }

  private updateProductList() {
    const startIndex = (this.currentProductPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.isEditing = false;
  }

  updateProduct(productId: number) {
    if (this.selectedProduct) {
      this.http.put(`${this.apiUrlProducts}/${productId}`, this.selectedProduct).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts(); 
          this.showEditForm = false; 
          this.selectedProduct = null; 
        },
        (error: any) => {
          console.error('Error al actualizar el producto:', error);
        }
      );
    }
  }

  public nextProductPage(): void {
    if (this.currentProductPage < this.totalProductPages) {
      this.currentProductPage++;
      this.updateProductList();
    }
  }

  public previousProductPage(): void {
    if (this.currentProductPage > 1) {
      this.currentProductPage--;
      this.updateProductList();
    }
  }

  public goToProductPage(page: number): void {
    if (page >= 1 && page <= this.totalProductPages) {
      this.currentProductPage = page;
      this.updateProductList();
    }
  }

  public cancelEdit(): void {
    this.currentProduct = null;
    this.isEditing = false;
  }

  registerProduct() {
    this.http.post(this.apiUrlProducts, this.newProduct).subscribe(
      (response) => {
        console.log('Producto registrado:', response);
        this.loadProducts(); 
        this.cancelProduct(); 
      },
      (error: any) => {
        console.error('Error al registrar el producto:', error);
      }
    );
  }
}
