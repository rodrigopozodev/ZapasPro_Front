import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router para la navegación
import { UserService } from '../../services/user.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule] // Importa FormsModule para usar ngModel en el formulario
})
export class LoginComponent {
  username: string = ''; // Almacena el nombre de usuario
  password: string = ''; // Almacena la contraseña

  constructor(private userService: UserService, private router: Router) { }

  // Método para redirigir al usuario a la página de registro
  goToRegister() {
    this.router.navigate(['/home']); // Asegúrate de que esta ruta esté configurada en tu módulo de enrutamiento
  }

  // Método para redirigir al usuario a la página principal
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Método que se llama al enviar el formulario
  onSubmit(): void {
    this.userService.login(this.username, this.password).subscribe(
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