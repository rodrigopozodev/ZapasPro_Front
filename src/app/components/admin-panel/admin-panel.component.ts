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
  users: User[] = [];
  products: Product[] = [];
  paginatedUsers: User[] = [];
  showUsers: boolean = true;
  showProducts: boolean = false;
  showReceipts: boolean = false;
  currentUser: User | null = null;
  currentProduct: Product | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 20;
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
  filteredUsers: User[] = []; // Cambiado a User[]

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.loadUsers(); // Carga los usuarios al inicializar
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.getUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users; // Inicializar filteredUsers con todos los usuarios
          this.updatePagination();
        } else {
          console.error('Error al obtener usuarios');
        }
      },
      (error) => {
        console.error('Error en la solicitud de usuarios:', error);
      }
    );
  }

  public loadProducts(): void {
    this.getProducts().subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }

  public loadReceipts(): void {
    this.getReceipts().subscribe(
      (response) => {
        this.receipts = response;
      },
      (error) => {
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

  public getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrlProducts);
  }

  public getReceipts(): Observable<any> {
    return this.http.get<any>(this.apiUrlReceipts);
  }

  public editUser(user: User): void {
    this.currentUser = { ...user };
  }

  public editProduct(product: Product): void {
    this.currentProduct = { ...product };
  }

  public updateUser(): void {
    if (this.currentUser) {
      this.http.put(`${this.apiUrlUsers}/${this.currentUser.id}`, this.currentUser).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.loadUsers();
          this.currentUser = null;
        },
        (error) => {
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
        (error) => {
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  public cancelEdit(): void {
    this.currentUser = null;
    this.currentProduct = null;
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

    // Actualizar la lista de usuarios filtrados
    this.filteredUsers = filtered;
    this.currentPage = 1; // Reiniciar la página al filtrar
    this.updatePagination(); // Actualizar la paginación
  }
}
