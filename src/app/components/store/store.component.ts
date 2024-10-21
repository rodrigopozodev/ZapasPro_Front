import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Asegúrate de que la ruta sea correcta
import { Product } from '../../interfaces/product.interface'; // Asegúrate de importar tu interfaz
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // Importar Router para la navegación
import { CartService } from '../../services/cart.service'; // Importa CartService

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule] // Asegúrate de incluir esto
})
export class StoreComponent implements OnInit {
  products: Product[] = []; // Define tu propiedad 'products'

  constructor(
    private productService: ProductService, 
    private authService: AuthService,
    private router: Router, 
    private cartService: CartService // Inyecta el CartService aquí
  ) { }

  ngOnInit() {
    this.loadProducts(); // Carga los productos al inicializar
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => { // Especifica el tipo aquí
      this.products = data;
    });
  }

  // Método para agregar un producto al carrito
  addToCart(product: Product): void {
    this.cartService.addToCart(product); // Ahora puedes usar el cartService
    alert('Producto agregado al carrito');
  }

  goToCart() {
    this.router.navigate(['/cart']); // Navegar a la ruta del carrito
  }

  logout() {
    this.authService.logout(); // Asegúrate de que el método logout esté definido en tu AuthService
    this.router.navigate(['/login']); // Navegar a la página de login al cerrar sesión
  }
}
