import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Asegúrate de que la ruta sea correcta
import { Product } from '../../interfaces/product.interface'; // Asegúrate de importar tu interfaz
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service'; // Servicio de autenticación para manejar el login y logout
import { Router } from '@angular/router'; // Importar Router para la navegación
import { CartService } from '../../services/cart.service'; // Importa CartService para manejar el carrito de compras

@Component({
  selector: 'app-store', // Selector del componente, se usa en el HTML
  templateUrl: './store.component.html', // Plantilla HTML del componente
  styleUrls: ['./store.component.css'], // Estilos del componente
  standalone: true, // Permite usar este componente sin necesidad de un módulo de Angular
  imports: [CommonModule] // Asegúrate de incluir CommonModule para directivas como *ngFor
})
export class StoreComponent implements OnInit {
  products: Product[] = []; // Define tu propiedad 'products' para almacenar la lista de productos

  constructor(
    private productService: ProductService, // Inyección del servicio de productos
    private userService: UserService, // Inyección del servicio de autenticación
    private router: Router, // Inyección del servicio Router para navegación
    private cartService: CartService // Inyecta el CartService para manejar operaciones del carrito
  ) { }

  ngOnInit() {
    this.loadProducts(); // Carga los productos al inicializar el componente
  }

  // Método para cargar productos desde el servicio
  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => { // Especifica el tipo aquí
      this.products = data; // Asigna los productos recibidos a la propiedad 'products'
    });
  }

  // Método para agregar un producto al carrito
  addToCart(product: Product): void {
    this.cartService.addToCart(product); // Llama al método de CartService para agregar el producto
    alert('Producto agregado al carrito'); // Alerta para el usuario
  }

  // Método para navegar al carrito
  goToCart() {
    this.router.navigate(['/cart']); // Navegar a la ruta del carrito
  }

  // Método para cerrar sesión
  logout() {
    this.userService.logout(); // Llama al método logout en userService
    this.router.navigate(['/login']); // Navegar a la página de login al cerrar sesión
  }
}
