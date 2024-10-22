// src/app/interfaces/product.interfaces.ts

// Interfaz que define la estructura de datos para un producto
export interface Product {
  id: number; // Identificador único del producto
  name: string; // Nombre del producto
  price: number; // Precio del producto
  description: string; // Descripción del producto (asegúrate de que esta propiedad esté presente)
  image: string; // URL de la imagen del producto
  createdAt: string; // Fecha de creación del producto (puede ser un string o un objeto Date, según tu preferencia)
  updatedAt: string; // Fecha de actualización del producto (puede ser un string o un objeto Date, según tu preferencia)
}
