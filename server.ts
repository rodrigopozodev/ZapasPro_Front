// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\server.ts
import { APP_BASE_HREF } from '@angular/common'; // Importa APP_BASE_HREF para manejar la base de las rutas
import { CommonEngine } from '@angular/ssr'; // Importa CommonEngine para renderizado del lado del servidor
import express from 'express'; // Importa el framework Express
import { fileURLToPath } from 'node:url'; // Para obtener la ruta del archivo actual
import { dirname, join, resolve } from 'node:path'; // Funciones para manipulación de rutas
import bootstrap from './src/main.server'; // Importa el archivo de inicio del servidor

// La aplicación Express se exporta para que pueda ser utilizada por funciones serverless
export function app(): express.Express {
  const server = express(); // Crea una nueva instancia de la aplicación Express
  const serverDistFolder = dirname(fileURLToPath(import.meta.url)); // Obtiene el directorio del servidor
  const browserDistFolder = resolve(serverDistFolder, '../browser'); // Resuelve la carpeta de distribución del navegador
  const indexHtml = join(serverDistFolder, 'index.server.html'); // Ruta al archivo HTML de entrada

  const commonEngine = new CommonEngine(); // Crea una nueva instancia del motor común para SSR

  server.set('view engine', 'html'); // Establece 'html' como el motor de vistas
  server.set('views', browserDistFolder); // Establece la carpeta de vistas al directorio del navegador

  // Ejemplo de endpoints de API REST en Express
  // server.get('/api/**', (req, res) => { });
  
  // Sirve archivos estáticos desde /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y', // Configura la caché de los archivos estáticos por 1 año
    index: 'index.html', // Archivo índice por defecto
  }));

  // Todas las rutas regulares utilizan el motor de Angular
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req; // Desestructura propiedades de la solicitud

    commonEngine
      .render({
        bootstrap, // Función de arranque para la aplicación Angular
        documentFilePath: indexHtml, // Ruta al archivo HTML de entrada
        url: `${protocol}://${headers.host}${originalUrl}`, // Construye la URL completa
        publicPath: browserDistFolder, // Carpeta pública para recursos
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }], // Proveedor para la base de las rutas
      })
      .then((html) => res.send(html)) // Envia el HTML renderizado como respuesta
      .catch((err) => next(err)); // Manejo de errores
  });

  return server; // Retorna la aplicación Express
}

function run(): void {
  const port = process.env['PORT'] || 4000; // Establece el puerto, usa el 4000 por defecto

  // Inicia el servidor Node
  const server = app(); // Llama a la función app para obtener la instancia del servidor
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`); // Mensaje en consola para confirmar que el servidor está corriendo
  });
}

run(); // Llama a la función run para iniciar la aplicación
