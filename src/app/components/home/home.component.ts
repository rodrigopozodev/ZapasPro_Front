import { Component } from '@angular/core';
import { UserService } from '../../services/user.service'; // Servicio de autenticación para gestionar el registro
import { Router } from '@angular/router'; // Importa el router para la navegación
import { FormsModule } from '@angular/forms'; // Importa FormsModule para manejar formularios
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home', // Selector del componente
  templateUrl: './home.component.html', // Archivo de plantilla HTML asociado
  standalone: true, // Indica que es un componente independiente
  styleUrls: ['./home.component.css'], // Archivo de estilos CSS asociado
  imports: [FormsModule, CommonModule] // Importa el módulo de formularios
})
export class HomeComponent {
  username: string = ''; // Propiedad para almacenar el nombre de usuario
  email: string = ''; // Propiedad para almacenar el correo electrónico
  password: string = ''; // Propiedad para almacenar la contraseña
  role: string = 'client'; // Valor predeterminado del rol del usuario (cliente)

  emailError: string = ''; // Mensaje de error para el email
  passwordError: string = ''; // Mensaje de error para la contraseña
  usernameError: string = ''; // Mensaje de error para el nombre de usuario
  emailValid: boolean = false; // Indicador de validación de email
  passwordValid: boolean = false; // Indicador de validación de contraseña
  usernameValid: boolean = false; // Indicador de validación de nombre de usuario
  successMessage: string = ''; // Mensaje de éxito
  errorMessage: string = ''; // Mensaje de error en el registro

  constructor(private userService: UserService, private router: Router) { } // Inyección de servicios

  // Método para registrar un nuevo usuario con validaciones previas
  register() {
    // Resetea los mensajes y validaciones previas
    this.emailError = '';
    this.passwordError = '';
    this.usernameError = '';
    this.emailValid = false;
    this.passwordValid = false;
    this.usernameValid = false;
    this.successMessage = '';
    this.errorMessage = '';

    // Validación de nombre de usuario
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

    // Validación de correo electrónico
    if (!this.email) {
      this.emailError = 'Por favor, rellene este campo.';
    } else if (/[A-Z]/.test(this.email)) {
      this.emailError = 'El correo electrónico no debe contener mayúsculas.';
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'El correo electrónico debe contener al menos un "@" y un "."';
    } else {
      this.emailValid = true;
    }

    // Validación de contraseña
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

    // Si todos los campos son válidos, procede con el registro
    if (this.usernameValid && this.emailValid && this.passwordValid) {
      this.userService.register(this.username, this.email, this.password, this.role).subscribe(
        response => {
          this.successMessage = 'Usuario registrado con éxito'; // Mensaje de éxito
          this.router.navigate(['/login']); // Navega a la página de login después del registro
        },
        error => {
          this.errorMessage = 'Error al registrar el usuario'; // Mensaje de error si el registro falla
        }
      );
    }
  }

  // Método para navegar a la página de inicio de sesión
  goToLogin() {
    this.router.navigate(['/login']); // Navega a la página de login
  }
}
