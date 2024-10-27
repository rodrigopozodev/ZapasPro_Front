import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular
import { Component, OnInit } from '@angular/core'; // Importa los decoradores de componente y ciclo de vida
import { CartService } from '../../services/cart.service'; // Importa el servicio del carrito
import { CartItem } from '../../interfaces/cart.interface'; // Importa la interfaz del carrito
import { UserService } from '../../services/user.service'; // Cambia userService por UserService
import { Router } from '@angular/router'; // Importa el enrutador de Angular

@Component({
  selector: 'app-cart', // Selector para el componente
  templateUrl: './cart.component.html', // Ruta al archivo HTML del componente
  standalone: true, // Indica que es un componente independiente
  styleUrls: ['./cart.component.css'], // Ruta al archivo CSS del componente
  imports: [CommonModule] // Importa el CommonModule para utilizar directivas comunes
})
export class CartComponent implements OnInit { // Define el componente
  cartProducts: CartItem[] = []; // Array para almacenar los productos del carrito

  // Constructor para inyectar servicios
  constructor(private cartService: CartService, private userService: UserService, private router: Router) {} // Cambia userService por UserService

  // Método de ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cartProducts = this.cartService.getCart(); // Esto ahora debe coincidir con el tipo correcto
  }

  // Método para navegar a la tienda
  goToStore() {
    this.router.navigate(['/store']); // Navega a la ruta de la tienda
  }

  // Método para cerrar sesión
  logout() {
    this.userService.logout(); // Cambia userService.logout() por userService.logout()
    this.router.navigate(['/login']); // Navega a la página de login al cerrar sesión
  }

  // Método para vaciar el carrito
  clearCart(): void {
    this.cartService.clearCart(); // Llama al método clearCart del servicio del carrito
    this.cartProducts = []; // Limpia el array de productos del carrito
  }

  // Método para simular la compra
  buy() {
    alert('Compra realizada con éxito!'); // Muestra un mensaje de éxito
    this.cartService.clearCart(); // Limpia el carrito después de la compra
    this.cartProducts = []; // Limpia el array de productos del carrito
  }
}
