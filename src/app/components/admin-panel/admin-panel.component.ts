import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface'; // Asegúrate de que la ruta sea correcta
import { User } from '../../interfaces/user.interface'; // Asegúrate de que la ruta sea correcta
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common'; // Asegúrate de que la ruta sea correcta
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

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.getUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.users;
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
    // loadReceipts() puede implementarse si es necesario
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsers);
  }

  public getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrlProducts);
  }

  public editUser(user: User): void {
    this.currentUser = { ...user };
  }

  public editProduct(product: Product): void {
    this.currentProduct = { ...product }; // Cambiado para almacenar el producto actual a editar
    console.log('Editando producto:', product);
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

  // Método para eliminar usuario
  public deleteUser(id: number | undefined): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.http.delete(`${this.apiUrlUsers}/${id}`).subscribe(
        (response: any) => {
          alert(response.message); // Mensaje de éxito
          this.loadUsers(); // Volver a obtener la lista de usuarios después de eliminar
          this.currentUser = null; // Limpiar el usuario actual después de eliminar
        },
        (error) => {
          alert('Error al eliminar el usuario'); // Manejo de errores
        }
      );
    }
  }

  public cancelEdit(): void {
    this.currentUser = null;
    this.currentProduct = null; // Limpia el producto actual al cancelar la edición
  }

  public updatePagination(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
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
}
