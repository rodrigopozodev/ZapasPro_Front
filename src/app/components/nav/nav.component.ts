import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  dropdownVisible = false;

  constructor(private router: Router, private authService: AuthService) {} // Inyecta AuthService

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  goToStore() {
    this.router.navigate(['/store']);
  }

  logout() {
    this.authService.logout(); // Llama al método logout del AuthService
    this.router.navigate(['/login']); // Navega a la página de login al cerrar sesión
  }

  goToCart() {
    this.router.navigate(['/cart']); // Navegar a la ruta del carrito
  }

  goToPurchaseHistory() {
    // Navegar a historial de compras
  }
  
  writeReview() {
    // Navegar a escribir una reseña
  }

  goToFavorites() {
    // Navegar a favoritos
  }

  goToAccountSettings() {
    // Navegar a configuración de cuenta
  }

  goToCustomerService() {
    // Navegar a atención al cliente
  }

  goToOrders() {
    // Navegar a mis pedidos
  }

  goToReturns() {
    // Navegar a mis devoluciones
  }

  goToPersonalInfo() {
    // Navegar a información personal
  }

  goToContactPreferences() {
    // Navegar a preferencias de contacto
  }

  goToRewards() {
    // Navegar a mis recompensas
  }

  returnItem() {
    // Navegar a devolver un artículo
  }

  goToGiftCards() {
    // Navegar a tarjetas regalo
  }

  goToSizes() {
    // Navegar a mis tallas
  }

  goToBrands() {
    // Navegar a mis marcas
  }

  goToRecommendationPreferences() {
    // Navegar a preferencias de recomendación
  }
}
