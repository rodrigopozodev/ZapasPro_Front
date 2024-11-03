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
  imports: [FormsModule, CommonModule] // Import FormsModule for ngModel binding
})
export class LoginComponent {
  email: string = ''; // Store the email input
  password: string = ''; // Store the password input
  emailError: string = ''; // Error message for email
  passwordError: string = ''; // Error message for password
  loginError: string = ''; // General login error message
  passwordRecoveryMessage: string = ''; // Message for password recovery
  emailValid: boolean = false; // Flag for email validation
  passwordValid: boolean = false; // Flag for password validation
  attemptCount: number = 0; // Count the number of password attempts

  constructor(private userService: UserService, private router: Router) { }

  // Navigate to the registration page
  goToRegister() {
    this.router.navigate(['/home']); // Ensure this route is defined in your routing module
  }

  // Navigate to the password recovery page
  goToPasswordRecovery() {
    this.router.navigate(['/recover-password']); // Ensure this route is defined for password recovery
  }

  // Validate form fields and handle submission
  onSubmit(): void {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = ''; // Reset login error message
    this.passwordRecoveryMessage = ''; // Reset password recovery message
    this.emailValid = false; // Reset email validity
    this.passwordValid = false; // Reset password validity

    // Validate email
    if (!this.email) {
      this.emailError = 'Por favor, rellene el campo con su correo.';
    } else if (/[A-Z]/.test(this.email)) {
      this.emailError = 'El correo electrónico no debe contener mayúsculas.'; // Prioritized check for uppercase letters
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'El correo electrónico debe contener al menos un "@" y un "."';
    } else {
      this.emailValid = true; // Set valid if all checks passed
    }

    // Validate password
    if (!this.password) {
      this.passwordError = 'Por favor, rellene el campo con su contraseña.';
    } else {
      // Check for password length
      if (this.password.length < 8) {
        this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
      } 
      // Check for number
      else if (!/[0-9]/.test(this.password)) {
        this.passwordError = 'La contraseña debe incluir al menos un número.';
      } 
      // Check for uppercase letter
      else if (!/[A-Z]/.test(this.password)) {
        this.passwordError = 'La contraseña debe incluir al menos una mayúscula.';
      } 
      else {
        this.passwordValid = true; // Set valid if all checks passed
      }
    }

    // If there are any validation errors, stop the submission
    if (this.emailError || this.passwordError) {
      return; // Do not proceed with the login process
    }

    // Proceed with login if validation passes
    this.userService.login(this.email, this.password).subscribe(
      response => {
        if (response.success) {
          // Reset attempt count on successful login
          this.attemptCount = 0;
          // Redirect user based on their role
          const redirectRoute = response.role === 'admin' ? '/admin' : '/store';
          this.router.navigate([redirectRoute]); // Navigate to appropriate page
        } else {
          // Handle specific error responses based on the API response
          if (response.error === 'usuario_no_registrado') {
            this.loginError = 'Usuario no registrado. Regístrate para iniciar sesión.'; // User not registered
          } else if (response.error === 'contraseña_incorrecta') {
            this.attemptCount++; // Increment the attempt count
            this.passwordError = 'Contraseña incorrecta.'; // Incorrect password
            if (this.attemptCount >= 3) {
              this.passwordRecoveryMessage = '¿Olvidaste tu contraseña? <a href="#" (click)="goToPasswordRecovery()">Recupérala aquí.</a>'; // Prompt for password recovery
            }
          } else {
            this.loginError = 'Error al iniciar sesión. Intente de nuevo.'; // General error message
          }
        }
      },
      error => {
        // Handle error based on the response status
        if (error.status === 404) {
          this.loginError = 'Usuario no registrado. Regístrate para iniciar sesión.';
        } else if (error.status === 401) {
          this.passwordError = 'Contraseña incorrecta.';
          this.attemptCount++; // Increment the attempt count
          if (this.attemptCount >= 3) {
            this.passwordRecoveryMessage = '¿Olvidaste tu contraseña? <a href="#" (click)="goToPasswordRecovery()">Recupérala aquí.</a>'; // Prompt for password recovery
          }
        } else {
          console.error('Error al iniciar sesión', error); // Log error for debugging
          this.loginError = 'Error al iniciar sesión. Intente de nuevo.'; // General error message
        }
      }
    );
  }
}
