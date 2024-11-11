import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StoreComponent } from './components/store/store.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component'; 
import { HomeComponent } from './components/home/home.component'; 
import { CartComponent } from './components/cart/cart.component'; 
import { MainLayoutComponent } from './components/main-layout/main-layout.component'; 
import { PurchaseHistoryComponent } from './components/perfil/purchase-history/purchase-history.component';
import { WriteReviewComponent } from './components/perfil/write-review/write-review.component';
import { FavoritesComponent } from './components/perfil/favorites/favorites.component';
import { AccountSettingsComponent } from './components/perfil/account-settings/account-settings.component';
import { CustomerServiceComponent } from './components/perfil/customer-service/customer-service.component';
import { OrdersComponent } from './components/perfil/orders/orders.component';
import { ContactPreferencesComponent } from './components/perfil/contact-preferences/contact-preferences.component';
import { RewardsComponent } from './components/perfil/rewards/rewards.component';
import { GiftCardsComponent } from './components/perfil/gift-cards/gift-cards.component';
import { SizesComponent } from './components/perfil/sizes/sizes.component';
import { BrandsComponent } from './components/perfil/brands/brands.component';
import { RecommendationPreferencesComponent } from './components/perfil/recommendation-preferences/recommendation-preferences.component';

// Importa los componentes del panel de administración
import { UsuariosComponent } from './components/admin-panel/usuarios/usuarios.component';
import { ProductosComponent } from './components/admin-panel/productos/productos.component';
import { RecibosComponent } from './components/admin-panel/recibos/recibos.component';
import { StockComponent } from './components/admin-panel/stock/stock.component';

// Importa el componente de detalle del producto
import { ProductDetailComponent } from './components/store/product-detail/product-detail.component'; // Asegúrate de que la ruta sea correcta
import { ImageSelectionComponent } from './components/admin-panel/productos/image-selection/image-selection.component';

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: LoginComponent }, // Ruta inicial
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: '', // Agrupando rutas con el layout
    component: MainLayoutComponent,
    children: [
      { path: 'store', component: StoreComponent },
      { 
        path: 'admin', 
        component: AdminPanelComponent, 
        children: [
          { path: '', redirectTo: 'usuarios', pathMatch: 'full' }, // Redirigir a 'usuarios' por defecto
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'productos', component: ProductosComponent },
          { path: 'productos/image-selection', component: ImageSelectionComponent }, // Nueva ruta para la selección de imágenes
          { path: 'recibos', component: RecibosComponent },
          { path: 'stock', component: StockComponent }, // Ruta para StockComponent
        ]
      },
      { path: 'cart', component: CartComponent },
      { path: 'perfil/purchase-history', component: PurchaseHistoryComponent },
      { path: 'perfil/write-review', component: WriteReviewComponent },
      { path: 'perfil/favorites', component: FavoritesComponent },
      { path: 'perfil/account-settings', component: AccountSettingsComponent },
      { path: 'perfil/customer-service', component: CustomerServiceComponent },
      { path: 'perfil/orders', component: OrdersComponent },
      { path: 'perfil/contact-preferences', component: ContactPreferencesComponent },
      { path: 'perfil/rewards', component: RewardsComponent },
      { path: 'perfil/gift-cards', component: GiftCardsComponent },
      { path: 'perfil/sizes', component: SizesComponent },
      { path: 'perfil/brands', component: BrandsComponent },
      { path: 'perfil/recommendation-preferences', component: RecommendationPreferencesComponent },
      { path: 'product/:id', component: ProductDetailComponent }, // Ruta para el detalle del producto
    ],
  },
  { path: '**', redirectTo: '' }, // Redirige cualquier ruta no válida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}