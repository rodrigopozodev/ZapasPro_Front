import { Injectable } from '@angular/core'; // Importa el decorador Injectable para definir un servicio
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar solicitudes HTTP
import { Observable } from 'rxjs'; // Importa Observable de RxJS para manejar la asincronía
import { Product } from '../interfaces/product.interface'; // Importa la interfaz Product para definir la estructura de los productos

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products'; // Define la URL de la API para obtener los productos

  constructor(private http: HttpClient) { } // Inyecta HttpClient en el constructor del servicio

  // Método para obtener productos de la API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl); // Realiza una solicitud GET a la API y devuelve un Observable de productos
  }
}
