// src/app/interfaces/user.interface.ts

// Interfaz que define la estructura de datos para un usuario
export interface User {
  id?: number; // Identificador único del usuario, ahora es opcional para permitir crear usuarios sin un ID inicial
  username: string; // Nombre de usuario, obligatorio para identificar al usuario en la aplicación
  role: string; // Rol del usuario (por ejemplo, 'admin' o 'client'), obligatorio para definir permisos
  createdAt?: Date; // Fecha de creación del usuario, ahora es opcional
  updatedAt?: Date; // Fecha de actualización del usuario, ahora es opcional
  password: string; // Contraseña del usuario, necesaria para el registro y autenticación
  isEditing?: boolean; // Indica si el usuario está en modo de edición, opcional para gestionar la edición en la interfaz
  email: string; // Correo electrónico del usuario, necesario para el registro y comunicación
}
