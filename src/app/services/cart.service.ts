import { Injectable } from '@angular/core'; // Importa el decorador Injectable para definir un servicio
import { Product } from '../interfaces/product.interface'; // Importa la interfaz Product para definir la estructura de los productos

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class CartService {
  private cart: Product[] = []; // Inicializa el carrito como un array vacío de productos

  constructor() {} // Constructor del servicio

  // Método para agregar un producto al carrito
  addToCart(product: Product) {
    this.cart.push(product); // Añade el producto al carrito
    this.saveCart(); // Guarda el estado del carrito en el almacenamiento local
  }

  // Obtener todos los productos del carrito
  getCart(): Product[] {
    return this.loadCart(); // Carga y devuelve los productos del carrito desde el almacenamiento local
  }

  // Guardar el carrito en el almacenamiento local
  private saveCart() {
    if (typeof window !== 'undefined') { // Verifica si estás en un entorno de navegador
      localStorage.setItem('cart', JSON.stringify(this.cart)); // Convierte el carrito a JSON y lo guarda en el almacenamiento local
    }
  }

  // Cargar el carrito desde el almacenamiento local
  private loadCart(): Product[] {
    if (typeof window !== 'undefined') { // Verifica si estás en un entorno de navegador
      const cartData = localStorage.getItem('cart'); // Intenta obtener los datos del carrito del almacenamiento local
      return cartData ? JSON.parse(cartData) : []; // Si hay datos, los parsea y devuelve; si no, devuelve un array vacío
    }
    return []; // Devuelve un array vacío si no está en un entorno de navegador
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = []; // Reinicia el carrito a un array vacío
    this.saveCart(); // Guarda el estado del carrito vacío en el almacenamiento local
  }
}
