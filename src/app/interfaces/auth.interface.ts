// src/app/interfaces/auth.interface.ts

// Interfaz que define la estructura de datos para la autenticación
export interface AuthInterface {
  firstName: string; // Primer nombre del usuario
  password: string; // Contraseña del usuario
  role?: string; // Rol del usuario, opcional (solo utilizado durante el registro)
}
