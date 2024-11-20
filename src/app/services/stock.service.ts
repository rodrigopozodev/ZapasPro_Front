import { Injectable } from '@angular/core'; // Importa el decorador Injectable para definir un servicio
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para realizar solicitudes HTTP
import { Observable } from 'rxjs'; // Importa Observable de RxJS para manejar la asincronía
import { Stock } from '../interfaces/stock.interfaces'; // Importa la interfaz Stock para definir la estructura del stock

@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible en toda la aplicación
})
export class StockService {
  private apiUrl = 'https://zapaspro-back.onrender.com/api/stock'; // Define la URL de la API para obtener las entradas de stock

  constructor(private http: HttpClient) { } // Inyecta HttpClient en el constructor del servicio

  // Método para obtener las entradas de stock de la API
  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl); // Realiza una solicitud GET a la API y devuelve un Observable de stock
  }

  

  // Método para crear una nueva entrada de stock
  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock); // Realiza una solicitud POST a la API para crear una nueva entrada de stock
  }

  // Método para actualizar una entrada de stock existente
  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock); // Realiza una solicitud PUT a la API para actualizar la entrada de stock
  }

  // Método para eliminar una entrada de stock por ID
  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Realiza una solicitud DELETE a la API para eliminar la entrada de stock
  }
}
