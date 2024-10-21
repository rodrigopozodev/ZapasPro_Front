import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.interface';
import { AuthService } from '../../services/auth.service'; // Importa el AuthService
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule] 
})
export class CartComponent implements OnInit {
  cartProducts: Product[] = [];

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {} // Añade authService y router aquí

  ngOnInit(): void {
    this.cartProducts = this.cartService.getCart();
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  logout() {
    this.authService.logout(); // Asegúrate de que el método logout esté definido en tu AuthService
    this.router.navigate(['/login']); // Navegar a la página de login al cerrar sesión
  }

  // Método para vaciar el carrito
  clearCart(): void {
    this.cartService.clearCart();
    this.cartProducts = [];
  }

  buy() {
    alert('Compra realizada con éxito!');
    this.cartService.clearCart();
    this.cartProducts = [];
  }
  
}
