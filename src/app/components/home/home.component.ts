import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [FormsModule]
})
export class HomeComponent {
  username: string = '';
  password: string = '';
  role: string = 'client'; // Valor predeterminado

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.username, this.password, this.role).subscribe(
      response => {
        alert('Usuario registrado con éxito');
        this.router.navigate(['/login']);
      },
      error => {
        alert('Error al registrar el usuario');
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
