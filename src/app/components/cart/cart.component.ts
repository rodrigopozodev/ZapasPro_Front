import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular
import { Component, OnInit } from '@angular/core'; // Importa los decoradores de componente y ciclo de vida
import { CartService } from '../../services/cart.service'; // Importa el servicio del carrito
import { CartItem } from '../../interfaces/cart.interface'; // Importa la interfaz del carrito
import { UserService } from '../../services/user.service'; // Importa el servicio de usuario
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
  totalPrice: number = 0; // Variable para almacenar el precio total

  // Constructor para inyectar servicios
  constructor(private cartService: CartService, private userService: UserService, private router: Router) {}

ngOnInit(): void {
  this.loadCart(); // Cargar los productos del carrito al inicializar
}

// Método para cargar los productos del carrito y calcular el precio total
private loadCart(): void {
  const user = this.userService.getCurrentUser();
  if (user) {
    this.cartProducts = this.cartService.getCart(); // Obtiene los productos del carrito
    this.calculateTotalPrice(); // Calcula el precio total de los productos
  } else {
    // Si no hay un usuario autenticado, limpia el carrito
    this.cartProducts = [];
    this.totalPrice = 0;
  }
}

  // Método para calcular el precio total de los productos en el carrito
  private calculateTotalPrice(): void {
    this.totalPrice = this.cartProducts.reduce((total, item) => total + (item.product.price * item.quantity), 0); // Suma los precios de todos los productos
  }

  // Método para navegar a la tienda
  goToStore(): void {
    this.router.navigate(['/store']); // Navega a la ruta de la tienda
  }

  // Método para cerrar sesión
  logout(): void {
    this.userService.logout(); // Cierra sesión del usuario
    this.router.navigate(['/login']); // Navega a la página de login al cerrar sesión
  }

  // Método para vaciar el carrito
  clearCart(): void {
    this.cartService.clearCart(); // Llama al método clearCart del servicio del carrito
    this.cartProducts = []; // Limpia el array de productos del carrito
    this.totalPrice = 0; // Resetea el precio total
  }

  // Método para eliminar un producto del carrito
  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId); // Llama al método removeFromCart del servicio del carrito
    this.loadCart(); // Vuelve a cargar el carrito para actualizar la vista
  }

  // Método para simular la compra
  buy(): void {
    if (this.cartProducts.length > 0) {
      alert('Compra realizada con éxito!'); // Muestra un mensaje de éxito
      this.clearCart(); // Limpia el carrito después de la compra
    } else {
      alert('El carrito está vacío.'); // Mensaje si el carrito está vacío
    }
  }
}
