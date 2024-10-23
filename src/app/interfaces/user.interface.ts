export interface User {
  id: string; // o number, dependiendo de cómo estés manejando el ID
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Considera no incluir el password en la interfaz pública
  role: 'client' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}
