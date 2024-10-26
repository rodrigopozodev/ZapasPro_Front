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
  showUsers: boolean = true;
  showProducts: boolean = false;
  showReceipts: boolean = false;
  currentUser: User | null = null;
  currentProduct: Product | null = null;

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public loadUsers(): void {
    this.getUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.users;
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

  // Método para editar un usuario
  public editUser(user: User): void {
    this.currentUser = { ...user }; // Clona el usuario para editar
  }

  public editProduct(product: Product): void {
    // Lógica para editar el producto
    console.log('Editando producto:', product);
    // Aquí podrías abrir un modal o cambiar el estado para mostrar un formulario de edición
  }

  // Método para actualizar el usuario
  public updateUser(): void {
    if (this.currentUser) {
      this.http.put(`${this.apiUrlUsers}/${this.currentUser.id}`, this.currentUser).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.loadUsers(); // Recarga la lista de usuarios
          this.currentUser = null; // Limpia el usuario actual
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  // Método para cancelar la edición
  public cancelEdit(): void {
    this.currentUser = null; // Limpia el usuario actual
  }
}
