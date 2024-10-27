import { Product } from './product.interface'; // Asegúrate de importar la interfaz Product

export interface CartItem {
  product: Product; // Ahora puede utilizar la interfaz Product
  quantity: number;
}
