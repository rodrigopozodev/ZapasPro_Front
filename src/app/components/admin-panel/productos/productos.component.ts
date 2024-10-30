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
  styleUrls: ['./productos.component.css'], // Cambié styleUrl a styleUrls (plural)
})
export class ProductosComponent {
  private apiUrlProducts = 'http://localhost:3000/api/products';

  showProducts = false; // Inicialmente ocultar productos
  products: Product[] = [];
  currentProduct: Product | null = null;
  searchProductTerm: string = ''; // Se agregó esta propiedad
  paginatedProducts: Product[] = [];
  filteredProducts: Product[] = []; // Productos después de aplicar filtros
  totalProductPages: number = 1; // Total de páginas de productos
  currentProductPage: number = 1; // Página actual
  selectedProduct: any; // Para almacenar el producto que se va a editar
  showProductForm: boolean = false; // Ejemplo de inicialización
  newProduct: any = {}; // Puedes definir un tipo más específico si tienes una interfaz
  isEditing = false; // Variable para controlar la visibilidad del formulario de edición
  genders: string[] = ['Masculino', 'Femenino', 'Unisex']; // Lista de géneros disponibles
  genderFilter: string = ''; // Filtro por género
  itemsPerPage: number = 20; // Items por página
  showEditForm = false;

  // Nuevo array de URLs de imágenes
  imageUrls: string[] = [
    '/img/Nike Air Max Plus Drift.png',
    '/img/Nike-AIR_FORCE_1_07.png',
    '/img/Nike-AIR_FORCE_1_07_amarilla.png',
    '/img/Air Force 1 SP.png',
    '/img/Air Force 1 \'07 PRM.png', // Agregando la nueva imagen
    // Agrega más URLs según sea necesario
  ];

  constructor(private http: HttpClient, private router: Router) {
    this.products = [];
    this.filteredProducts = this.products;
    this.loadProducts(); // Llama a loadProducts al iniciar
  }

  // Método para cargar productos
  public loadProducts(): void {
    this.getProducts(this.currentProductPage).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.filterProducts(); // Aplica filtros al cargar
        this.calculateTotalProductPages(); // Calcular total de páginas
        this.showProducts = true; // Asegúrate de que esto esté en true
      },
      (error: any) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }

  public getProducts(page: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlProducts}?_page=${page}&_limit=${this.itemsPerPage}`);
  }

  // Método para calcular el total de páginas
  calculateTotalProductPages(): void {
    this.http.get<Product[]>(this.apiUrlProducts).subscribe((response: Product[]) => {
      const totalItems = response.length;
      this.totalProductPages = Math.ceil(totalItems / this.itemsPerPage);
      this.updateProductList(); // Actualiza la lista de productos para la primera página
    });
  }

  public editProduct(product: any) {
    this.selectedProduct = { ...product }; // Clona el producto seleccionado
    this.isEditing = true; // Muestra el formulario de edición
  }

  public cancelProduct(): void {
    this.selectedProduct = null; // Resetea el producto seleccionado
    this.showProductForm = false; // Oculta el formulario de registro de producto
    this.newProduct = {}; // Resetea el formulario de nuevo producto
  }

  deleteProduct(productId: number) {
    // Muestra un mensaje de confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      // Realiza la solicitud DELETE al servidor
      this.http.delete(`${this.apiUrlProducts}/${productId}`).subscribe(
        (response) => {
          console.log(`Producto con ID: ${productId} eliminado`, response);
          // Actualiza la lista de productos solo si la eliminación fue exitosa
          this.products = this.products.filter(product => product.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
          this.calculateTotalProductPages(); // Recalcula el total de páginas después de eliminar
          this.updateProductList(); // Actualiza la lista de productos mostrada
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

    // Filtrar por nombre del producto
    if (this.searchProductTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchProductTerm.toLowerCase())
      );
    }

    // Filtrar por género
    if (this.genderFilter) {
      filtered = filtered.filter(product => product.gender.toLowerCase() === this.genderFilter.toLowerCase());
    }

    this.filteredProducts = filtered;
    this.calculateTotalProductPages(); // Actualiza el total de páginas después de filtrar
    this.updateProductList(); // Actualiza la lista de productos mostrada
  }

  private updateProductList() {
    const startIndex = (this.currentProductPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.isEditing = false;
  }

  updateProduct(productId: number) {
    if (this.selectedProduct) {
      // Asegurarse de que 'size' es un array
      if (typeof this.selectedProduct.size === 'string') {
        // Si viene como un string, convertirlo en un array
        this.selectedProduct.size = this.selectedProduct.size.split(',').map(Number);
      } else if (!Array.isArray(this.selectedProduct.size)) {
        // Si no es un array, lo convertimos a un array
        this.selectedProduct.size = [this.selectedProduct.size];
      }

      // Ahora se debe enviar como JSON
      this.http.put(`${this.apiUrlProducts}/${productId}`, this.selectedProduct).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts(); // Recargar productos para reflejar los cambios
          this.showEditForm = false; // Ocultar el formulario de edición
          this.selectedProduct = null; // Limpiar la selección
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
        this.loadProducts(); // Recargar productos para reflejar el nuevo producto
        this.cancelProduct(); // Reinicia el formulario
      },
      (error: any) => {
        console.error('Error al registrar el producto:', error);
      }
    );
  }
}
