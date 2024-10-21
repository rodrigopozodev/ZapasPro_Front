export interface User {
  id?: number; // Ahora es opcional
  username: string;
  role: string;
  createdAt?: Date; // Ahora es opcional
  updatedAt?: Date; // Ahora es opcional
  password: string; // Necesitarás esta propiedad para crear un nuevo usuario
}
