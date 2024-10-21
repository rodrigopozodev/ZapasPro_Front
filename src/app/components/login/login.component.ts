import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Importa Router
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/'])
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        if (response.success) {
          // Redirigir al usuario según su rol
          if (response.role === 'admin') {
            this.router.navigate(['/admin']); // Redirigir a admin
          } else {
            this.router.navigate(['/store']); // Redirigir a store
          }
        } else {
          alert('Error al iniciar sesión');
        }
      },
      error => {
        console.error('Error al iniciar sesión', error);
        alert('Error al iniciar sesión, verifique sus credenciales');
      }
    );
  }  
}
