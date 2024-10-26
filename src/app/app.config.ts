// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app\app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Importa configuraciones y detección de cambios en Angular
import { provideRouter } from '@angular/router'; // Importa el proveedor de enrutador para gestionar rutas
import { provideClientHydration } from '@angular/platform-browser'; // Importa el proveedor para la hidratación del cliente
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importa provideHttpClient para manejar solicitudes HTTP y withFetch
import { routes } from './app.routes'; // Importa las rutas definidas en la aplicación

// Configuración principal de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Proporciona la detección de cambios con coalescencia de eventos
    provideRouter(routes), // Proporciona el enrutador configurado con las rutas importadas
    provideClientHydration(), // Habilita la hidratación del cliente para mejorar el rendimiento
    provideHttpClient(withFetch()) // Añade el proveedor de HttpClient configurado para utilizar fetch
  ]
};
