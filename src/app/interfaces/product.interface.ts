// src/app/interfaces/product.interfaces.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string; // Asegúrate de que esta propiedad esté presente
  image: string;
  createdAt: string; // O Date, según tu preferencia
  updatedAt: string; // O Date, según tu preferencia
}
