// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app\app.config.server.ts

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core'; // Importa funciones para gestionar la configuración de la aplicación
import { provideServerRendering } from '@angular/platform-server'; // Importa el proveedor para habilitar el renderizado en el servidor
import { appConfig } from './app.config'; // Importa la configuración base de la aplicación

// Define la configuración específica para el servidor
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // Proporciona la capacidad de renderizado en el servidor
  ]
};

// Fusiona la configuración base de la aplicación con la configuración específica del servidor
export const config = mergeApplicationConfig(appConfig, serverConfig);
