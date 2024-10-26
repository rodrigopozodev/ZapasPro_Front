import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'; // Servicio de autenticación para gestionar el registro
import { Router } from '@angular/router'; // Importa el router para la navegación
import { FormsModule } from '@angular/forms'; // Importa FormsModule para manejar formularios

@Component({
  selector: 'app-home', // Selector del componente
  templateUrl: './home.component.html', // Archivo de plantilla HTML asociado
  standalone: true, // Indica que es un componente independiente
  styleUrls: ['./home.component.css'], // Archivo de estilos CSS asociado
  imports: [FormsModule] // Importa el módulo de formularios
})
export class HomeComponent {
  username: string = ''; // Propiedad para almacenar el nombre de usuario
  email: string = ''; // Propiedad para almacenar el correo electrónico
  password: string = ''; // Propiedad para almacenar la contraseña
  role: string = 'client'; // Valor predeterminado del rol del usuario (cliente)

  constructor(private userService: UserService, private router: Router) { } // Inyección de servicios

  // Método para registrar un nuevo usuario
  register() {
    // Llama al método register del UserService y pasa los datos del usuario
    this.userService.register(this.username, this.email, this.password, this.role).subscribe(
      response => {
        alert('Usuario registrado con éxito'); // Mensaje de éxito
        this.router.navigate(['/login']); // Navega a la página de login después del registro
      },
      error => {
        alert('Error al registrar el usuario'); // Mensaje de error si el registro falla
      }
    );
  }

  // Método para navegar a la página de inicio de sesión
  goToLogin() {
    this.router.navigate(['/login']); // Navega a la página de login
  }
}
