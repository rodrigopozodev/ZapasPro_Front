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
  isFormActive: boolean = false;
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

   // Nueva función para registrar y cambiar de formulario
   toggleFormRegister(): void {
    this.register(); // Llama al método de registro
  }

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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleForm(): void {
    this.isFormActive = !this.isFormActive;
  }

  onInputFocus() {
    const icons = document.querySelectorAll('.eye-icon');
    icons.forEach(icon => {
      icon.classList.add('text-[#4070f4]');
    });
  }

  onInputBlur() {
    const icons = document.querySelectorAll('.eye-icon');
    icons.forEach(icon => {
      icon.classList.remove('text-[#4070f4]');
    });
  }

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
      this.usernameError = 'Por favor, ingrese un nombre de usuario.';
    } else if (/\s/.test(this.username)) {
      this.usernameError = 'El nombre de usuario no debe contener espacios.';
    } else if (!/^[A-Z]/.test(this.username)) {
      this.usernameError = 'El nombre de usuario debe comenzar con una letra mayúscula.';
    } else if (!/^[A-Za-z]+$/.test(this.username)) {
      this.usernameError = 'El nombre de usuario solo debe contener letras sin números ni signos.';
    } else {
      this.usernameValid = true;
    }

    if (!this.email) {
      this.emailError = 'Por favor, rellene este campo.';
    } else if (/[A-Z]/.test(this.email)) {
      this.emailError = 'El correo electrónico no debe contener mayúsculas.';
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'El correo electrónico debe contener al menos un "@" y un "."';
    } else {
      this.emailValid = true;
    }

    if (!this.password) {
      this.passwordError = 'Por favor, rellene este campo.';
    } else if (this.password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'La contraseña debe incluir al menos un número.';
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'La contraseña debe incluir al menos una letra mayúscula.';
    } else {
      this.passwordValid = true;
    }

    // Si los campos son válidos, procede con el registro
    if (this.usernameValid && this.emailValid && this.passwordValid) {
      this.userService.register(this.username, this.email, this.password, this.role).subscribe(
        response => {
          this.successMessage = 'Usuario registrado con éxito';
          
          // Limpiar campos después de un registro exitoso
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

  private clearRegisterFormFields(): void {
    // Limpiar los campos del formulario de registro
    this.username = '';
    this.email = '';
    this.password = '';
  }
}
