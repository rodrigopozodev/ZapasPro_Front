export interface ProfileData {
    nombre: string;
    apellidos: string;
    preferenciaCompra: string;
    email: string;
    contrasena: string;
    telefono: string;
    cumpleanos: {
      mes: string;
      dia: string;
      ano: string;
    };
    direccionEnvio: {
      calle: string;
      puerta: string;
      ciudad: string;
      codigoPostal: string;
    };
  }
  