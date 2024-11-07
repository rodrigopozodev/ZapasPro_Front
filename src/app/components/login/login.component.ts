import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';
  passwordRecoveryMessage: string = '';
  passwordVisible: boolean = false; // Controla la visibilidad de la contraseña

  private failedAttempts: number = 0; // Contador de intentos fallidos

  constructor(private userService: UserService, private router: Router) { }

  // Navega a la página de registro
  goToRegister() {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Navega a la página de recuperación de contraseña
  goToPasswordRecovery() {
    this.router.navigate(['/recover-password']);
  }

  // Valida el formulario y envía la solicitud de inicio de sesión
  onSubmit(): void {
    // Reinicia los mensajes de error
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';
    this.passwordRecoveryMessage = ''; // Reiniciar el mensaje de recuperación al intentar de nuevo

    // Validar que el campo de correo no esté vacío
    if (!this.email) {
      this.emailError = 'Por favor, rellene el campo con su correo.';
    }

    // Validar que el campo de contraseña no esté vacío
    if (!this.password) {
      this.passwordError = 'Por favor, rellene el campo con su contraseña.';
    }

    // Si hay errores en los campos, detener el envío
    if (this.emailError || this.passwordError) {
      return;
    }

    // Proceder con el inicio de sesión si no hay errores de validación
    this.userService.login(this.email, this.password).subscribe(
      response => {
        if (response.success) {
          // Redirige al usuario según su rol
          const redirectRoute = response.role === 'admin' ? '/admin' : '/store';
          this.router.navigate([redirectRoute]);

          // Reiniciar el contador de intentos en caso de inicio de sesión exitoso
          this.failedAttempts = 0;
        } else {
          this.handleLoginFailure();
        }
      },
      error => {
        // Manejo de errores en caso de falla en la solicitud
        if (error.status === 404 || error.status === 401) {
          this.handleLoginFailure();
        } else {
          console.error('Error al iniciar sesión', error);
          this.loginError = 'Error al iniciar sesión. Intente de nuevo.';
        }
      }
    );
  }

  private handleLoginFailure(): void {
    // Incrementa el contador de intentos fallidos
    this.failedAttempts++;

    // Mostrar mensaje de error
    this.loginError = 'Correo o contraseña incorrecto.';

   // Mostrar mensaje de recuperación tras tres intentos fallidos
    if (this.failedAttempts >= 3) {
      this.passwordRecoveryMessage = `
        <span class="text-yellow-700">¿No recuerdas tu contraseña?</span> 
        <a (click)="goToPasswordRecovery()" class="text-yellow-600 underline cursor-pointer">Recupera tu contraseña</a>
      `;
      this.failedAttempts = 0; // Reiniciar el contador después de mostrar el mensaje
    }
  }
}
