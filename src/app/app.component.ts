// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app\app.component.ts

import { Component } from '@angular/core'; // Importa el decorador Component de Angular
import { RouterOutlet } from '@angular/router'; // Importa RouterOutlet para manejar la navegación entre rutas
import { NavComponent } from './components/nav/nav.component'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root', // Define el selector del componente, que se usará en el HTML
  standalone: true, // Indica que este componente es autónomo y no necesita un módulo NgModule
  imports: [RouterOutlet], // Importa el RouterOutlet y el NavComponent
  templateUrl: './app.component.html', // Ruta al archivo HTML que define la plantilla del componente
  styleUrls: ['./app.component.css'] // Ruta a los estilos CSS del componente
})
export class AppComponent {
  title = 'ZapasPro_Frontend'; // Propiedad que almacena el título de la aplicación
}
