// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app/app.routes.ts
import { NgModule } from '@angular/core'; // Importa el decorador NgModule de Angular
import { RouterModule, Routes } from '@angular/router'; // Importa RouterModule y Routes para la configuración de rutas
import { LoginComponent } from './components/login/login.component'; // Importa el componente de inicio de sesión
import { StoreComponent } from './components/store/store.component'; // Importa el componente de la tienda
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component'; // Importa el panel de administración
import { HomeComponent } from './components/home/home.component'; // Asegúrate de que HomeComponent esté importado
import { CartComponent } from './components/cart/cart.component'; // Importa el componente del carrito
import { MainLayoutComponent } from './components/main-layout/main-layout.component'; // Importa el componente de layout principal

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: LoginComponent }, // Ruta inicial que carga el componente LoginComponent
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión
  { path: 'home', component: HomeComponent }, // Ruta para el componente de inicio
  {
    path: '', // Ruta vacía para agrupar rutas que necesitan el layout
    component: MainLayoutComponent, // Usa el componente de layout principal
    children: [
      { path: 'store', component: StoreComponent }, // Ruta para acceder a la tienda
      { path: 'admin', component: AdminPanelComponent }, // Ruta para acceder al panel de administración
      { path: 'cart', component: CartComponent }, // Ruta para acceder al carrito
    ],
  },
  // Redirige cualquier ruta no válida a la ruta principal
  { path: '**', redirectTo: '' }, // Redirección a la ruta principal en caso de rutas no válidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configura el RouterModule con las rutas definidas
  exports: [RouterModule], // Exporta el RouterModule para su uso en otros módulos
})
export class AppRoutingModule {} // Exporta el módulo de enrutamiento
