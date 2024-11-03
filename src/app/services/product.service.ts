import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los productos de la API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener un producto por ID
  getProductById(id: string): Observable<{ success: boolean; product: Product }> {
    const url = `${this.apiUrl}/${id}`; // Construye la URL para obtener un producto específico
    return this.http.get<{ success: boolean; product: Product }>(url).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Ha ocurrido un error:', error);
    return throwError(() => new Error('Error en la obtención de productos, intenta más tarde'));
  }
}
