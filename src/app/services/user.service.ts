import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://zapaspro-back.onrender.com/api/users';
  private authenticated = false;
  public userRole: string | null = null;
  private currentUser: any;

  // Nuevo BehaviorSubject que emite cambios de usuario
  private userChangedSubject = new BehaviorSubject<void>(undefined);
  public userChanged$ = this.userChangedSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const storedUser = this.getStoredUser();
    this.currentUser = storedUser;
  }

  // Método para registrar un nuevo usuario
  register(username: string, email: string, password: string, role: string): Observable<any> {
    const user: User = { username, email, password, role };
    return this.http.post(this.apiUrl, user);
  }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

   // Método para iniciar sesión
   login(email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, user: { role: string, username: string } }>(
      `${this.apiUrl}/login`, { email, password }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthenticated(true);
          const user = response.user;
          this.setUserRole(user.role);
          this.setUserName(user.username);
          this.saveUserToLocalStorage(user.role, user.username);

          // Emitir cambio de usuario
          this.userChangedSubject.next(); // Aquí emitimos el cambio

          // Redirigir según el rol
          if (this.userRole === 'admin') {
            this.router.navigate(['/admin']);
          } else {
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

  // Eliminar el usuario del localStorage y emitir cambio
  logout(): void {
    this.authenticated = false;
    this.userRole = null;
    this.currentUser = null;
    this.removeUserFromLocalStorage();

    // Emitir cambio de usuario al cerrar sesión
    this.userChangedSubject.next(); // Emitir cambio

    this.router.navigate(['/login']);
  }
  

  // Método para obtener el rol del usuario actual desde el localStorage
  getCurrentUserRole(): string | null {
    const user = this.getStoredUser();
    return user ? user.role : null;
  }

  getCurrentUser(): any {
    return this.getStoredUser();
  }

   // Método para obtener solo el nombre de usuario (opcional)
   public getCurrentUserName(): string | null {
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

  // Guarda el rol y nombre del usuario en el localStorage si está disponible
  private saveUserToLocalStorage(role: string, username: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = { role, username };
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Método privado para eliminar el usuario del localStorage si está disponible
  private removeUserFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
  }

  // Método privado para obtener el usuario almacenado si localStorage está disponible
  public getStoredUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Método para actualizar la configuración del usuario
  updateUserSettings(
    username: string,
    email: string,
    password?: string, // El password es opcional
    surname?: string,
    phoneNumber?: string,
    birthDay?: number | null,
    birthMonth?: number | null,
    birthYear?: number | null,
    shoppingPreference?: string
  ): Observable<any> {
    const userUpdate = {
      username,
      email,
      ...(password ? { password } : {}), // Solo agregar password si se proporciona
      surname,
      phoneNumber,
      birthDay,
      birthMonth,
      birthYear,
      shoppingPreference
    };

    return this.http.put(`${this.apiUrl}/update`, userUpdate); // Asegúrate de que la URL sea correcta
  }

   getUserId(): string | null {
    // Aquí se supone que el ID de usuario se guarda en el localStorage tras el login
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user?.id || null;  // Devolver el ID del usuario si está logueado
  }

}
