import { CommonModule } from '@angular/common'; 
import { Component, HostListener } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { UserService } from '../../services/user.service'; // Cambiado a UserService con mayúscula

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  dropdownVisible = false;

  // Propiedad para gestionar la visibilidad de los submenús
  submenusVisible: { [key: string]: boolean } = {
    compras: false,
    cuenta: false,
    soporte: false,
  };

  currentSubmenu: string = ''; // Inicializa currentSubmenu

  constructor(public router: Router, public userService: UserService) {} // Inyecta UserService

  ngOnInit() {
    // Verifica si estás en un entorno de navegador
    if (typeof window !== 'undefined') {
      try {
        const user = localStorage.getItem('user'); // Intenta obtener el usuario de localStorage
  
        if (user) {
          // Si el usuario existe, puedes establecer el estado de autenticación o cargar datos adicionales
          const parsedUser = JSON.parse(user); // Parsea el usuario
          console.log('Usuario actual:', parsedUser); // Muestra el usuario en la consola
        } else {
          console.log('No hay usuario logueado.'); // Si no hay usuario logueado
        }
      } catch (error) {
        console.error('Error accediendo a localStorage:', error); // Maneja el error si ocurre
      }
  
      // Verifica si el usuario está logueado
      if (!this.userService.getCurrentUser()) {
        console.log('El usuario no está logueado.'); // Para depuración
      }
    }
  }
  
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
    this.userService.logout(); // Llama al método logout del userService
    this.router.navigate(['/login']); // Navega a la página de login al cerrar sesión
  }

  goToCart() {
    this.router.navigate(['/cart']); // Navegar a la ruta del carrito
  }

  // Métodos adicionales para navegación
  goToPurchaseHistory() {}
  writeReview() {}
  goToFavorites() {}
  goToAccountSettings() {}
  goToCustomerService() {}
  goToOrders() {}
  goToReturns() {}
  goToPersonalInfo() {}
  goToContactPreferences() {}
  goToRewards() {}
  returnItem() {}
  goToGiftCards() {}
  goToSizes() {}
  goToBrands() {}
  goToRecommendationPreferences() {}

  // Nueva función para verificar si el usuario es admin
  isAdmin(): boolean {
    const userRole = this.userService.getCurrentUserRole(); // Obtiene el rol del usuario actual
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

  getCurrentUserName(): string {
    return this.userService.getCurrentUserName() || 'Invitado'; // Usa getCurrentUserName del servicio
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  // Agrega este método o modifica el existente
  toggleSubmenu(section: string): void {
    // Si la sección que se está abriendo ya está visible, cerrarla
    if (this.currentSubmenu === section) {
      this.currentSubmenu = '';
    } else {
      // Cerrar cualquier sección abierta antes de abrir una nueva
      this.currentSubmenu = section;
    }
  }

  isSubmenuVisible(section: string): boolean {
    return this.submenusVisible[section]; // Devuelve la visibilidad del submenú
  }
}
