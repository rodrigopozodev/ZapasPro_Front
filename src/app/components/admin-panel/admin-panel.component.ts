import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { User } from '../../interfaces/user.interface'; // Asegúrate de tener esta interfaz
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Importa Router
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrls: ['./admin-panel.component.css'],
  imports: [CommonModule]
})
export class AdminPanelComponent implements OnInit {
  private apiUrlProducts = 'http://localhost:3000/api/products';
  private apiUrlUsers = 'http://localhost:3000/api/users'; // Asegúrate de que esta URL sea correcta

  users: User[] = [];
  products: Product[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {} // Inyecta Router aquí

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
  }

  private loadUsers(): void {
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

  logout() {
    this.authService.logout(); // Asegúrate de que el método logout esté definido en tu AuthService
    this.router.navigate(['/login']); // Navegar a la página de login al cerrar sesión
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  private loadProducts(): void {
    this.getProducts().subscribe(
      (response) => {
        this.products = response; // Suponiendo que ya está formateado correctamente
      },
      (error) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }

  private getUsers(): Observable<any> { // Cambié el tipo a `any` para adaptarse a la respuesta del servidor
    return this.http.get<any>(this.apiUrlUsers);
  }

  private getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProducts);
  }
}
