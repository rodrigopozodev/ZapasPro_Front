import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginSignupComponent {
  // Variables de formulario y errores
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';
  loginError: string = '';
  passwordRecoveryMessage: string = '';
  passwordVisible: boolean = false;
  isFormActive: boolean = false;  // Controla el estado entre login y registro
  username: string = '';
  role: string = 'client';
  usernameError: string = '';
  emailValid: boolean = false;
  passwordValid: boolean = false;
  usernameValid: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  private failedAttempts: number = 0;

  constructor(private userService: UserService, private router: Router) { }

  goToPasswordRecovery() {
    this.router.navigate(['/recover-password']);
  }

  // Método que maneja el formulario de login
  onSubmit(): void {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';
    this.passwordRecoveryMessage = '';

    if (!this.email) {
      this.emailError = 'Por favor, rellene el campo con su correo.';
    }
    if (!this.password) {
      this.passwordError = 'Por favor, rellene el campo con su contraseña.';
    }
    if (this.emailError || this.passwordError) {
      return;
    }

    this.userService.login(this.email, this.password).subscribe(
      response => {
        if (response.success) {
          const redirectRoute = response.role === 'admin' ? '/admin' : '/store';
          this.router.navigate([redirectRoute]);
          this.failedAttempts = 0;
        } else {
          this.handleLoginFailure();
        }
      },
      error => {
        if (error.status === 404 || error.status === 401) {
          this.handleLoginFailure();
        } else {
          console.error('Error al iniciar sesión', error);
          this.loginError = 'Error al iniciar sesión. Intente de nuevo.';
        }
      }
    );
  }

  // Función que cambia de formulario y llama al registro
  toggleFormRegister(): void {
    this.register(); // Llama al método de registro
  }

  // Manejo de error de login y recuperación de contraseña después de varios intentos fallidos
  private handleLoginFailure(): void {
    this.failedAttempts++;
    this.loginError = 'Correo o contraseña incorrecto.';

    if (this.failedAttempts >= 3) {
      this.passwordRecoveryMessage = `
        <span class="text-yellow-700">¿No recuerdas tu contraseña?</span> 
        <a (click)="goToPasswordRecovery()" class="text-yellow-600 underline cursor-pointer">Recupera tu contraseña</a>
      `;
      this.failedAttempts = 0;
    }
  }

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Función para alternar entre el formulario de login y el de registro
  toggleForm() {
    this.isFormActive = !this.isFormActive;
  
    // Limpiar errores al cambiar entre formularios
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';
    this.usernameError = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.username = '';
    this.email = '';
    this.password = '';
  }
  
  // Cambiar color del icono al enfocar el input
  onInputFocus() {
    const icons = document.querySelectorAll('.eye-icon');
    icons.forEach(icon => {
      icon.classList.add('text-[#4070f4]');
    });
  }

  // Cambiar color del icono al desenfocar el input
  onInputBlur() {
    const icons = document.querySelectorAll('.eye-icon');
    icons.forEach(icon => {
      icon.classList.remove('text-[#4070f4]');
    });
  }

  // Método para registrar un nuevo usuario
  register() {
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    this.emailValid = false;
    this.passwordValid = false;
    this.usernameValid = false;
    this.successMessage = '';
    this.errorMessage = '';

    // Validación de campos
    if (!this.username) {
      this.usernameError = 'Por favor, ingrese un nombre.';
    } else if (/\s/.test(this.username)) {
      this.usernameError = 'El nombre de usuario no debe tener espacios.';
    } else if (!/^[A-Z]/.test(this.username)) {
      this.usernameError = 'El nombre debe comenzar con mayúscula.';
    } else if (!/^[A-Za-z]+$/.test(this.username)) {
      this.usernameError = 'El nombre no puede tener números ni signos.';
    } else {
      this.usernameValid = true;
    }

    if (!this.email) {
      this.emailError = 'Por favor, rellene este campo.';
    } else if (/[A-Z]/.test(this.email)) {
      this.emailError = 'No se permiten mayúsculas.';
    } else if (/\s/.test(this.email)) {
      this.emailError = 'El correo no puede tener espacios.';
    } else if (!this.email.includes('@')) {
      this.emailError = 'El correo debe tener al menos un "@"';
    } else if (!this.email.includes('.')) {
      this.emailError = 'El correo debe tener al menos un "."';
    } else {
      this.emailValid = true;
    }
    

    if (!this.password) {
      this.passwordError = 'Por favor, rellene este campo.';
    } else if (this.password.length < 8) {
      this.passwordError = 'Contraseña muy corta.';
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'Debes incluir al menos un número.';
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'Debes tener al menos una mayúscula.';
    } else {
      this.passwordValid = true;
    }

    // Si los campos son válidos, proceder con el registro
    if (this.usernameValid && this.emailValid && this.passwordValid) {
      this.userService.register(this.username, this.email, this.password, this.role).subscribe(
        response => {
          this.successMessage = 'Usuario registrado con éxito';
          
          // Limpiar los campos después de un registro exitoso
          this.clearRegisterFormFields();
          
          // Cambiar al formulario de inicio de sesión
          this.toggleForm();
        },
        error => {
          this.errorMessage = 'Error al registrar el usuario';
        }
      );
    }
  }

  // Limpiar los campos del formulario de registro
  private clearRegisterFormFields(): void {
    this.username = '';
    this.email = '';
    this.password = '';
  }
}
