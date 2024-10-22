// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app/components/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component'; // Asegúrate de importar el NavComponent
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule], // Importa CommonModule y NavComponent
  template: `
    <app-nav></app-nav> <!-- Incluye el NavComponent -->
    <router-outlet></router-outlet> <!-- Lugar para cargar las rutas secundarias -->
  `,
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {}
