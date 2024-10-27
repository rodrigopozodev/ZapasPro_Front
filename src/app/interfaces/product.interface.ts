export interface Product {
  id: number;                    // Identificador único del producto
  name: string;                  // Nombre del producto
  price: number;                 // Precio del producto
  description: string;           // Descripción del producto
  imageUrl: string;              // URL de la imagen del producto
  stock: number;                 // Cantidad disponible del producto
  sizes: string[];               // Lista de tallas disponibles
  gender: 'unisex' | 'masculino' | 'femenino'; // Género específico
  color: string;                 // Color del producto
  brand: string;                 // Marca del producto
}
