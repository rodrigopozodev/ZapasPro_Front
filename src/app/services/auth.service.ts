import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Asegúrate de importar 'tap'
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private authenticated = false; // Cambia esta propiedad según la lógica de tu aplicación
  public userRole: string | null = null; // Almacena el rol del usuario

  constructor(private http: HttpClient) {}

  register(username: string, password: string, role: string): Observable<any> {
    const user: User = { username, password, role };
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  getUsers(): Observable<any[]> { // Cambia el tipo según tu modelo de usuario
    return this.http.get<any[]>(this.apiUrl);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, role: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        // Aquí puedes manejar la respuesta y establecer el estado de autenticación
        if (response.success) { // Asegúrate de que 'success' sea un campo en la respuesta
          this.setAuthenticated(true);
          this.setUserRole(response.role); // Guarda el rol del usuario
        }
      })
    );
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  get role(): string | null {
    return this.userRole; // Devuelve el rol del usuario
  }

  logout() {
    this.authenticated = false; // Cambiar a false al cerrar sesión
    this.userRole = null; // Reinicia el rol al cerrar sesión
  }

  setAuthenticated(status: boolean) {
    this.authenticated = status; // Método para establecer el estado de autenticación
  }

  setUserRole(role: string) {
    this.userRole = role; // Método para establecer el rol del usuario
  }
}
