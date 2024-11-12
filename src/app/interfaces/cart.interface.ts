import { Product } from './product.interface'; // Asegúrate de importar la interfaz Product

// cart.interface.ts
export interface CartItem {
  product: Product;
  quantity: number;
  stock: any;
  selectedSize: string;  // Asegúrate de tener esta propiedad
};

