import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
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

  constructor(public router: Router, public authService: AuthService) {} // Inyecta AuthService

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  
    // Si se muestra el dropdown, añade un timeout para quitar la clase
    if (this.dropdownVisible) {
      setTimeout(() => {
        this.dropdownVisible = true; // Asegúrate de que esté visible
      }, 0);
    }
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

  // Nueva función para verificar si el usuario es admin
  isAdmin(): boolean {
    const userRole = this.authService.getCurrentUserRole(); // Obtiene el rol del usuario actual
    return userRole === 'admin'; // Solo devuelve true si el rol es 'admin'
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  closeDropdown(event: MouseEvent) {
    // Previene que el clic dentro del dropdown cierre el dropdown
    event.stopPropagation();
  }

  // Método para cerrar el dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown');

    if (dropdown && !dropdown.contains(target) && !target.closest('.perfil-btn')) {
      this.dropdownVisible = false;
    }
  }

  getCurrentUserName(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.username;
    }
    return null;
  }
}
