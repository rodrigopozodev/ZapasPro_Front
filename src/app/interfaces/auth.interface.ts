// src/app/interfaces/auth.interface.ts

// Interfaz que define la estructura de datos para la autenticación
export interface AuthInterface {
  username: string; // Nombre de usuario del usuario
  password: string; // Contraseña del usuario
  role?: string; // Rol del usuario, opcional (solo utilizado durante el registro)
}
