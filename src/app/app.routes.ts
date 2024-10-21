import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StoreComponent } from './components/store/store.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { HomeComponent } from './components/home/home.component'; // Asegúrate de que HomeComponent esté importado
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Carga inicial en la ruta principal
  { path: 'login', component: LoginComponent },
  { path: 'store', component: StoreComponent }, // Sin guardia de autenticación
  { path: 'admin', component: AdminPanelComponent },
  { path: 'cart', component: CartComponent}, // Sin guardia de autenticación
  // Sin redirigir a un componente en caso de rutas no válidas
  { path: '**', redirectTo: '' }, // Cambia esto si quieres que simplemente no muestre nada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
