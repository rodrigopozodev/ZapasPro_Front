import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule] // Importa FormsModule para usar ngModel en el formulario
})
export class LoginComponent {
  email: string = ''; // Almacena el correo electrónico
  password: string = ''; // Almacena la contraseña

  constructor(private authService: AuthService, private router: Router) { }

  // Método para redirigir al usuario a la página de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Método para redirigir al usuario a la página principal
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Método que se llama al enviar el formulario
  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        if (response.success) {
          // Redirigir al usuario según su rol
          if (response.role === 'admin') {
            this.router.navigate(['/admin']); // Redirigir a la página de administrador
          } else {
            this.router.navigate(['/store']); // Redirigir a la tienda para usuarios clientes
          }
        } else {
          alert('Error al iniciar sesión'); // Mensaje de error si la respuesta no es exitosa
        }
      },
      error => {
        console.error('Error al iniciar sesión', error);
        alert('Error al iniciar sesión, verifique sus credenciales'); // Mensaje de error en caso de fallo
      }
    );
  }  
}
