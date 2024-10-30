import { Product } from './product.interface'; // Asegúrate de importar la interfaz Product

export interface CartItem {
  product: Product; // Cambiar a un objeto Product
  quantity: number; // Cantidad de productos en el carrito
}
