import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrls: ['./admin-panel.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminPanelComponent implements OnInit {
  private apiUrlProducts = 'http://localhost:3000/api/products';
  private apiUrlUsers = 'http://localhost:3000/api/users';
  private apiUrlReceipts = 'http://localhost:3000/api/receipts';

  // Datos de usuarios
  showProducts = false; // Inicialmente ocultar productos
  isEditing = false; // Variable para controlar la visibilidad del formulario de edición
  users: User[] = [];
  products: Product[] = [];
  paginatedUsers: User[] = [];
  showUsers: boolean = true; // Mostrar usuarios por defecto
  showReceipts: boolean = false;
  currentUser: User | null = null;
  currentProduct: Product | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  username: string = '';
  email: string = '';
  password: string = '';
  role: string = 'client';
  showRegisterForm: boolean = false;
  receipts: any[] = [];
  searchTerm: string = '';
  searchBy: string = 'username'; // 'username' o 'email'
  roleFilter: string = ''; // 'admin', 'client' o ''
  filteredUsers: User[] = [];
  searchProductTerm: string = ''; // Se agregó esta propiedad
  paginatedProducts: Product[] = [];
  genders: string[] = ['Masculino', 'Femenino', 'Unisex']; // Lista de géneros disponibles
  genderFilter: string = ''; // Filtro por género
  totalProductPages: number = 1; // Total de páginas de productos
  filteredProducts: Product[] = []; // Productos después de aplicar filtros
  currentProductPage: number = 1; // Página actual
  itemsPerPage: number = 20; // Items por página
  selectedProduct: any; // Para almacenar el producto que se va a editar
  showEditForm = false;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.loadUsers(); // Carga los usuarios al inicializar
    this.products = []; // Asigna tus productos aquí
    this.filteredProducts = this.products; // Inicializa con todos los productos
  }

  ngOnInit(): void {
    this.showUsers = true; // Asegúrate de que los usuarios se muestren al inicializar
    this.loadUsers();
    // No cargar productos al inicializar, solo usuarios
  }

   // Método para cargar usuarios
   public loadUsers(): void {
    this.getUsers().subscribe(
      (response: { success: boolean; users: User[] }) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users; // Inicializar filteredUsers con todos los usuarios
          this.updatePagination();
        } else {
          console.error('Error al obtener usuarios');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud de usuarios:', error);
      }
    );
  }

  // Método para cargar productos (se mantiene en el código, pero no se llama al iniciar)
  public loadProducts(): void {
    this.getProducts(this.currentProductPage).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.filteredProducts = this.products; // Inicializa los productos filtrados
        this.filterProducts(); // Aplicar filtros al cargar los productos
        this.calculateTotalProductPages(); // Calcular total de páginas al cargar productos
      },
      (error: any) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }
  

  public loadReceipts(): void {
    this.getReceipts().subscribe(
      (response: any) => {
        this.receipts = response;
      },
      (error: any) => {
        console.error('Error en la solicitud de recibos:', error);
      }
    );
  }

  public showUserSection(): void {
    this.showUsers = true;
    this.showProducts = false;
    this.showReceipts = false;
    this.loadUsers();
  }

  public showProductSection(): void {
    this.showUsers = false;
    this.showProducts = true;
    this.showReceipts = false;
    this.loadProducts();
  }

  public showReceiptSection(): void {
    this.showUsers = false;
    this.showProducts = false;
    this.showReceipts = true;
    this.loadReceipts();
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsers);
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

  public getReceipts(): Observable<any> {
    return this.http.get<any>(this.apiUrlReceipts);
  }

  public editUser(user: User): void {
    this.currentUser = { ...user };
  }

  public editProduct(product: any) {
    this.selectedProduct = { ...product }; // Clona el producto seleccionado
    this.isEditing = true; // Muestra el formulario de edición
}


  public updateUser(): void {
    if (this.currentUser) {
      this.http.put(`${this.apiUrlUsers}/${this.currentUser.id}`, this.currentUser).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.loadUsers();
          this.currentUser = null;
        },
        (error: any) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  public deleteUser(id: number | undefined): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.http.delete(`${this.apiUrlUsers}/${id}`).subscribe(
        (response: any) => {
          alert(response.message);
          this.loadUsers();
          this.currentUser = null;
        },
        (error: any) => {
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  public cancelEdit(): void {
    this.currentUser = null;
    this.currentProduct = null;
    this.isEditing = false;
  }

  public updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  register() {
    this.userService.register(this.username, this.email, this.password, this.role).subscribe(
      response => {
        alert('Usuario registrado con éxito');
        this.loadUsers();
        this.showRegisterForm = false; // Cerrar el formulario
        this.clearForm(); // Limpiar los campos del formulario
      },
      error => {
        alert('Error al registrar el usuario');
      }
    );
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
    if (this.showRegisterForm) {
      this.clearForm(); // Limpiar el formulario al abrir
    }
  }

  cancelRegister() {
    this.showRegisterForm = false;
    this.clearForm(); // Limpiar el formulario al cancelar
  }

  private clearForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.role = 'client'; // Reiniciar rol al valor por defecto
  }

  private resetRegisterForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.role = 'client'; // Resetea el rol a 'client'
  }

  deleteProduct(productId: number) {
    console.log(`Eliminando producto con ID: ${productId}`);
    this.products = this.products.filter(product => product.id !== productId);
  }

  filterUsers() {
    let filtered = this.users;

    // Filtrar por nombre de usuario o email
    if (this.searchTerm) {
      filtered = filtered.filter(user =>
        this.searchBy === 'username'
          ? user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
          : user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    this.filteredUsers = filtered;
    this.updatePagination(); // Actualiza la paginación después de filtrar
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



onSizeChange(selectedSize: number) {
  if (!this.selectedProduct.size) {
      this.selectedProduct.size = [];
  }
  
  // Agregar o eliminar el tamaño del array
  const index = this.selectedProduct.size.indexOf(selectedSize);
  if (index === -1) {
      this.selectedProduct.size.push(selectedSize); // Agregar tamaño si no está en el array
  } else {
      this.selectedProduct.size.splice(index, 1); // Eliminar tamaño si ya está en el array
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
}
