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
      tap(response => { // Usa 'tap' para manejar la respuesta sin afectar el flujo de datos
        // Maneja la respuesta de la autenticación
        if (response.success) { // Verifica si la respuesta indica éxito
          this.setAuthenticated(true); // Establece el estado de autenticación en verdadero
          this.setUserRole(response.role); // Guarda el rol del usuario en la propiedad
        }
      })
    );
  }

  // Getter para verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.authenticated; // Devuelve el estado de autenticación
  }

  // Getter para obtener el rol del usuario
  get role(): string | null {
    return this.userRole; // Devuelve el rol del usuario autenticado
  }

  // Método para cerrar sesión
  logout() {
    this.authenticated = false; // Cambia el estado de autenticación a falso
    this.userRole = null; // Reinicia el rol del usuario al cerrar sesión
  }

  // Método para establecer el estado de autenticación
  setAuthenticated(status: boolean) {
    this.authenticated = status; // Actualiza el estado de autenticación
  }

  // Método para establecer el rol del usuario
  setUserRole(role: string) {
    this.userRole = role; // Actualiza el rol del usuario
  }
}
