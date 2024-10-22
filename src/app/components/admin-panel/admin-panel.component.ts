import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface'; // Importa la interfaz del producto
import { User } from '../../interfaces/user.interface'; // Asegúrate de tener esta interfaz
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { Router } from '@angular/router'; // Importa Router para la navegación
import { CommonModule } from '@angular/common'; // Importa CommonModule para utilizar directivas comunes

@Component({
  selector: 'app-admin-panel', // Selector del componente
  templateUrl: './admin-panel.component.html', // Ruta a la plantilla HTML del componente
  standalone: true, // Indica que el componente es independiente
  styleUrls: ['./admin-panel.component.css'], // Ruta a los estilos del componente
  imports: [CommonModule] // Importa CommonModule
})
export class AdminPanelComponent implements OnInit {
  private apiUrlProducts = 'http://localhost:3000/api/products'; // URL de la API para obtener productos
  private apiUrlUsers = 'http://localhost:3000/api/users'; // URL de la API para obtener usuarios

  users: User[] = []; // Array para almacenar los usuarios
  products: Product[] = []; // Array para almacenar los productos

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {} // Inyecta los servicios necesarios

  ngOnInit(): void {
    this.loadUsers(); // Carga los usuarios al inicializar el componente
    this.loadProducts(); // Carga los productos al inicializar el componente
  }

  // Método privado para cargar usuarios desde la API
  private loadUsers(): void {
    this.getUsers().subscribe(
      (response) => {
        if (response.success) {
          this.users = response.users; // Asigna los usuarios a la variable
        } else {
          console.error('Error al obtener usuarios'); // Maneja el error si la respuesta no es exitosa
        }
      },
      (error) => {
        console.error('Error en la solicitud de usuarios:', error); // Maneja errores en la solicitud
      }
    );
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Llama al método de logout en el servicio de autenticación
    this.router.navigate(['/login']); // Navega a la página de login al cerrar sesión
  }

  // Método para ir a la tienda
  goToStore() {
    this.router.navigate(['/store']); // Navega a la página de la tienda
  }

  // Método privado para cargar productos desde la API
  private loadProducts(): void {
    this.getProducts().subscribe(
      (response) => {
        this.products = response; // Asigna los productos a la variable (suponiendo que ya está formateado correctamente)
      },
      (error) => {
        console.error('Error en la solicitud de productos:', error); // Maneja errores en la solicitud
      }
    );
  }

  // Método privado para obtener usuarios desde la API
  private getUsers(): Observable<any> { // Cambié el tipo a `any` para adaptarse a la respuesta del servidor
    return this.http.get<any>(this.apiUrlUsers); // Realiza una solicitud GET a la API de usuarios
  }

  // Método privado para obtener productos desde la API
  private getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrlProducts); // Realiza una solicitud GET a la API de productos
  }
}
