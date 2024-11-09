import { Product } from './product.interface'; // Asegúrate de importar la interfaz Product
import { Stock } from './stock.interfaces'; // Importa Stock

export interface CartItem {
  product: Product; // Referencia al producto
  stock: Stock;     // Referencia al stock (talla y cantidad disponible)
  quantity: number; // Cantidad de productos en el carrito
}
