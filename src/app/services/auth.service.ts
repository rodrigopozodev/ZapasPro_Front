import { Injectable } from '@angular/core'; // Importa el decorador Injectable para definir un servicio
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para hacer peticiones HTTP
import { Observable } from 'rxjs'; // Importa Observable para manejar las respuestas asíncronas
import { tap } from 'rxjs/operators'; // Importa 'tap' para manipular la respuesta
import { environment } from '../../environments/environment'; // Importa las variables de entorno
import { User } from '../interfaces/user.interface'; // Importa la interfaz User para definir la estructura del usuario

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // Define la URL base para las peticiones de autenticación
  private authenticated = false; // Propiedad para rastrear si el usuario está autenticado
  public userRole: string | null = null; // Almacena el rol del usuario autenticado

  constructor(private http: HttpClient) {} // Inyecta HttpClient en el constructor

  // Método para registrar un nuevo usuario
  register(username: string, password: string, role: string): Observable<any> {
    const user: User = { username, password, role }; // Crea un objeto usuario
    return this.http.post(`${this.apiUrl}/register`, user); // Envía una solicitud POST para registrar al usuario
  }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> { // Cambia el tipo según tu modelo de usuario
    return this.http.get<any[]>(this.apiUrl); // Envía una solicitud GET para obtener los usuarios
  }

  // Método para iniciar sesión
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, role: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => { 
        if (response.success) { // Verifica si la respuesta indica éxito
          this.setAuthenticated(true); // Establece el estado de autenticación en verdadero
          this.setUserRole(response.role); // Guarda el rol del usuario en la propiedad
          this.saveUserToLocalStorage(response.role); // Guarda el rol en localStorage
        }
      })
    );
  }

  // Verifica si el usuario actual es administrador
  isAdmin(): boolean {
    const role = this.getCurrentUserRole(); // Obtiene el rol del usuario actual
    return role === 'admin'; // Retorna true si el rol es 'admin'
  }

  // Getter para verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.authenticated; // Devuelve el estado de autenticación
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false; // Cambia el estado de autenticación a falso
    this.userRole = null; // Reinicia el rol del usuario al cerrar sesión
    localStorage.removeItem('user'); // Remueve el usuario del localStorage
  }

  // Método para obtener el rol del usuario actual desde el localStorage
  getCurrentUserRole(): string | null {
    const user = localStorage.getItem('user'); // Obtiene los datos del usuario almacenados
    if (user) {
      const parsedUser = JSON.parse(user); // Parsea los datos del usuario
      return parsedUser.role; // Retorna el rol almacenado
    }
    return null; // Retorna null si no hay usuario en localStorage
  }

  // Método para establecer el estado de autenticación
  setAuthenticated(status: boolean) {
    this.authenticated = status; // Actualiza el estado de autenticación
  }

  // Método para establecer el rol del usuario
  setUserRole(role: string) {
    this.userRole = role; // Actualiza el rol del usuario en la aplicación
  }

  // Guarda el rol del usuario en el localStorage
  private saveUserToLocalStorage(role: string) {
    const user = { role }; // Crea un objeto con la propiedad 'role'
    localStorage.setItem('user', JSON.stringify(user)); // Guarda el usuario en el localStorage
  }
}
