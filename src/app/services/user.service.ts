import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Importa Router
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Cambiar aquí para usar la nueva ruta
  private authenticated = false;
  public userRole: string | null = null;
  private currentUser: any;

  constructor(private http: HttpClient, private router: Router) { // Inyecta Router
    const storedUser = this.getStoredUser();
    this.currentUser = storedUser;
  }

  // Método para registrar un nuevo usuario
  register(username: string, email: string, password: string, role: string): Observable<any> {
    const user: User = { username, email, password, role };
    return this.http.post(this.apiUrl, user); // Cambiar aquí para usar la nueva ruta
  }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, user: { role: string, username: string } }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success) {
          console.log("Login exitoso:", response); // Mensaje de depuración
          this.setAuthenticated(true);
          const user = response.user;
          console.log("Rol del usuario:", user.role); // Verifica el rol
          this.setUserRole(user.role);
          this.setUserName(user.username);
          this.saveUserToLocalStorage(user.role, user.username);
          
          // Redirigir según el rol
          if (this.userRole === 'admin') {
            console.log("Redirigiendo a /admin"); // Mensaje de depuración
            this.router.navigate(['/admin']);
          } else {
            console.log("Redirigiendo a /"); // Mensaje de depuración
            this.router.navigate(['/']);
          }
        }
      })
    );
  }

  // Verifica si el usuario actual es administrador
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  // Getter para verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  // Método para cerrar sesión
  logout(): void {
    this.authenticated = false;
    this.userRole = null;
    this.currentUser = null;
    this.removeUserFromLocalStorage();
  }

  // Método para obtener el rol del usuario actual desde el localStorage
  getCurrentUserRole(): string | null {
    const user = this.getStoredUser();
    return user ? user.role : null;
  }

  getCurrentUser(): any {
    return this.getStoredUser();
  }

  // Método para obtener el nombre del usuario actual desde el localStorage
  getCurrentUserName(): string | null {
    const user = this.getStoredUser();
    return user ? user.username : null;
  }

  // Método para establecer el estado de autenticación
  private setAuthenticated(status: boolean): void {
    this.authenticated = status;
  }

  // Método para establecer el rol del usuario
  private setUserRole(role: string): void {
    this.userRole = role;
  }

  // Método para establecer el nombre del usuario
  private setUserName(username: string): void {
    this.currentUser = { ...this.currentUser, username };
  }

  // Guarda el rol y nombre del usuario en el localStorage
  private saveUserToLocalStorage(role: string, username: string): void {
    const user = { role, username };
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Método privado para eliminar el usuario del localStorage
  private removeUserFromLocalStorage(): void {
    localStorage.removeItem('user');
  }

  // Método privado para obtener el usuario almacenado
  private getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
