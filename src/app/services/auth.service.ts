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
  private currentUser: User | null = null; // Asegúrate de inicializarlo correctamente

  constructor(private http: HttpClient) {
    // Inicializa currentUser desde localStorage
    this.currentUser = this.getStoredUser(); // Inicializa currentUser
  } // Inyecta HttpClient en el constructor

  // Método para registrar un nuevo usuario
  register(firstName: string, lastName: string, email: string, password: string, role: 'client' | 'admin'): Observable<any> {
    const user: User = { 
      id: this.generateId(), // Genera un ID único para el nuevo usuario
      firstName, 
      lastName, 
      email, 
      password, 
      role 
    }; // Asegúrate de que 'role' sea de tipo 'client' | 'admin'
    return this.http.post(`${this.apiUrl}/register`, user); // Envía una solicitud POST para registrar al usuario
  }

  // Método para generar un ID único
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15); // Genera un ID simple; ajusta según tus necesidades
  }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<User[]> { // Cambia el tipo según tu modelo de usuario
    return this.http.get<User[]>(this.apiUrl); // Envía una solicitud GET para obtener los usuarios
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean, role: string, firstName: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success) { // Verifica si la respuesta indica éxito
          this.setAuthenticated(true); // Establece el estado de autenticación en verdadero
          this.setUserRole(response.role); // Guarda el rol del usuario en la propiedad
          this.setUserFirstName(response.firstName); // Guarda el nombre del usuario en la propiedad
          this.saveUserToLocalStorage(response.role, response.firstName); // Guarda el rol y nombre en localStorage
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
    this.currentUser = null; // Reinicia currentUser al cerrar sesión
    localStorage.removeItem('user'); // Remueve el usuario del localStorage
  }

  // Método para obtener el rol del usuario actual desde el localStorage
  getCurrentUserRole(): string | null {
    const user = this.getStoredUser(); // Obtiene los datos del usuario almacenados
    return user ? user.role : null; // Retorna el rol almacenado
  }

  getCurrentUser(): User | null { // Método para obtener el usuario actual
    return this.currentUser; // Retorna el usuario actual
  }

  // Método para establecer el estado de autenticación
  private setAuthenticated(value: boolean) {
    this.authenticated = value; // Establece el valor del estado de autenticación
  }

  // Método para guardar el rol del usuario en el servicio
  private setUserRole(role: string) {
    this.userRole = role; // Guarda el rol en la propiedad
  }
// Método para guardar el nombre del usuario en el servicio
private setUserFirstName(firstName: string) {
  if (this.currentUser) { // Asegúrate de que currentUser no sea null
    this.currentUser.firstName = firstName; // Guarda el nombre del usuario en la propiedad
  }
}


  // Método para guardar el usuario en localStorage
  private saveUserToLocalStorage(role: string, firstName: string) {
    const user = { role, firstName }; // Crea un objeto de usuario con rol y nombre
    localStorage.setItem('user', JSON.stringify(user)); // Almacena el objeto en localStorage
  }

  // Método para recuperar el usuario del localStorage
  private getStoredUser(): User | null {
    const user = localStorage.getItem('user'); // Intenta obtener el usuario almacenado
    return user ? JSON.parse(user) : null; // Si no hay usuario, retorna null
  }

  // Agregar este método en tu AuthService
getCurrentUserFirstName(): string | null {
  return this.currentUser ? this.currentUser.firstName : null; // Retorna el nombre o null
}

}
