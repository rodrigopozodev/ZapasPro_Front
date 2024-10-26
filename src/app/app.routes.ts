// C:\Users\p-rpozo\ZapasPro\ZapasPro_Frontend\src\app/app.routes.ts
import { NgModule } from '@angular/core'; // Importa el decorador NgModule de Angular
import { RouterModule, Routes } from '@angular/router'; // Importa RouterModule y Routes para la configuración de rutas
import { LoginComponent } from './components/login/login.component'; // Importa el componente de inicio de sesión
import { StoreComponent } from './components/store/store.component'; // Importa el componente de la tienda
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component'; // Importa el panel de administración
import { HomeComponent } from './components/home/home.component'; // Asegúrate de que HomeComponent esté importado
import { CartComponent } from './components/cart/cart.component'; // Importa el componente del carrito
import { MainLayoutComponent } from './components/main-layout/main-layout.component'; // Importa el componente de layout principal
import { PurchaseHistoryComponent } from './components/perfil/purchase-history/purchase-history.component';
import { WriteReviewComponent } from './components/perfil/write-review/write-review.component';
import { FavoritesComponent } from './components/perfil/favorites/favorites.component';
import { AccountSettingsComponent } from './components/perfil/account-settings/account-settings.component';
import { CustomerServiceComponent } from './components/perfil/customer-service/customer-service.component';
import { OrdersComponent } from './components/perfil/orders/orders.component';
import { ReturnsComponent } from './components/perfil/returns/returns.component';
import { PersonalInfoComponent } from './components/perfil/personal-info/personal-info.component';
import { ContactPreferencesComponent } from './components/perfil/contact-preferences/contact-preferences.component';
import { RewardsComponent } from './components/perfil/rewards/rewards.component';
import { ReturnItemComponent } from './components/perfil/return-item/return-item.component';
import { GiftCardsComponent } from './components/perfil/gift-cards/gift-cards.component';
import { SizesComponent } from './components/perfil/sizes/sizes.component';
import { BrandsComponent } from './components/perfil/brands/brands.component';
import { RecommendationPreferencesComponent } from './components/perfil/recommendation-preferences/recommendation-preferences.component';


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
      { path: 'perfil/purchase-history', component: PurchaseHistoryComponent },
      { path: 'perfil/write-review', component: WriteReviewComponent },
      { path: 'perfil/favorites', component: FavoritesComponent },
      { path: 'perfil/account-settings', component: AccountSettingsComponent },
      { path: 'perfil/customer-service', component: CustomerServiceComponent },
      { path: 'perfil/orders', component: OrdersComponent },
      { path: 'perfil/returns', component: ReturnsComponent },
      { path: 'perfil/personal-info', component: PersonalInfoComponent },
      { path: 'perfil/contact-preferences', component: ContactPreferencesComponent },
      { path: 'perfil/rewards', component: RewardsComponent },
      { path: 'perfil/return-item', component: ReturnItemComponent },
      { path: 'perfil/gift-cards', component: GiftCardsComponent },
      { path: 'perfil/sizes', component: SizesComponent },
      { path: 'perfil/brands', component: BrandsComponent },
      { path: 'perfil/recommendation-preferences', component: RecommendationPreferencesComponent },
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
