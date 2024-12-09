# Scripts de Ejecución/Instalación de ZapasPro
### Requisitos Previos

1. **Node.js**: Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada).
2. **Angular CLI**: Instala Angular CLI de manera global si no lo tienes:
   ```bash
   npm install -g @angular/cli
   ```
3. **Git**: Para clonar los repositorios, asegúrate de tener [Git](https://git-scm.com/) instalado.
4. **SQLite3**: Verifica que tienes SQLite3 instalado o usa un archivo `.db` incluido en el proyecto.

Repositorios

- **Front-End**: [ZapasPro_Front](https://github.com/rodrigopozodev/ZapasPro_Front)
- **Back-End**: [ZapasPro_Back](https://github.com/rodrigopozodev/ZapasPro_Back)

1. Configuración del Repositorio Back-End (ZapasPro_Back)

### Clonación del Repositorio
Clona el repositorio:
```bash
git clone https://github.com/rodrigopozodev/ZapasPro_Back
cd ZapasPro_Back
```

### Instalación de Dependencias
Ejecuta:
```bash
npm install
```

### Configuración
1. Revisa el archivo `.env` o crea uno si no existe. Define las variables necesarias, como la ruta de la base de datos, puerto, etc. Un ejemplo:
   ```
   PORT=3000
   DATABASE=./database/zapaspro.db
   ```

2. Si necesitas migrar la base de datos, utiliza un script incluido:
   ```bash
   npm run migrate
   ```

### Ejecución
Para iniciar el servidor:
```bash
npm run start
```
Esto levantará el servidor en el puerto especificado en `.env` (por defecto, `http://localhost:3000`).

2. Configuración del Repositorio Front-End (ZapasPro_Front)

### Clonación del Repositorio
Clona el repositorio:
```bash
git clone https://github.com/rodrigopozodev/ZapasPro_Front
cd ZapasPro_Front
```

### Instalación de Dependencias
Ejecuta:
```bash
npm install
```

### Configuración
Asegúrate de configurar la URL del servidor Back-End en el archivo de entorno de Angular (`src/environments/environment.ts`). Ejemplo:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Ejecución
Para iniciar la aplicación en modo de desarrollo:
```bash
ng serve
```
Por defecto, Angular servirá la aplicación en `http://localhost:4200`.

3. Conexión entre Front-End y Back-End

1. Asegúrate de que ambos servicios están corriendo:
   - Back-End en `http://localhost:3000`
   - Front-End en `http://localhost:4200`
2. Navega al Front-End y prueba las funcionalidades, asegurándote de que puede comunicarse con el servidor Back-End.

4. Scripts Adicionales

### Back-End
- **Linting y corrección de código**:
  ```bash
  npm run lint
  ```
- **Ejecución en modo desarrollo (con nodemon)**:
  ```bash
  npm run dev
  ```
- **Pruebas unitarias**:
  ```bash
  npm test
  ```

### Front-End
- **Build para producción**:
  ```bash
  ng build --prod
  ```
- **Linting**:
  ```bash
  ng lint
  ```
