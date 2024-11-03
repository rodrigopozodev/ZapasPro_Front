// Ejemplo de la interfaz Product
export interface Product {
  id: number; // Identificador único del producto
  name: string; // Nombre del producto
  description: string; // Descripción del producto
  price: number; // Precio del producto
  gender: 'masculino' | 'femenino' | 'unisex'; // Género del producto
  color: 'negro' | 'azul' | 'marron' | 'verde' | 'gris' | 'naranja' | 'rosa' | 'morado' | 'rojo' | 'blanco' | 'amarillo' | 'multicolor'; // Color del producto
  marca: 'Nike' | 'Adidas' | 'Puma' | 'Reebok' | 'New Balance' | 'Converse'; // Marca del producto
  imageUrl: string; // URL de la imagen del producto
  views: string[];
  createdAt?: Date; // Fecha de creación (opcional)
  updatedAt?: Date; // Fecha de actualización (opcional)
}
