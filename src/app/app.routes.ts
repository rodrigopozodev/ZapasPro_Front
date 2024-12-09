import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './components/store/store.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component'; 
import { CartComponent } from './components/cart/cart.component'; 
import { MainLayoutComponent } from './components/main-layout/main-layout.component'; 
import { PurchaseHistoryComponent } from './components/perfil/purchase-history/purchase-history.component';
import { FavoritesComponent } from './components/perfil/favorites/favorites.component';

// Importa los componentes del panel de administración
import { UsuariosComponent } from './components/admin-panel/usuarios/usuarios.component';
import { ProductosComponent } from './components/admin-panel/productos/productos.component';
import { RecibosComponent } from './components/admin-panel/recibos/recibos.component';
import { StockComponent } from './components/admin-panel/stock/stock.component';

// Importa el componente de detalle del producto
import { ProductDetailComponent } from './components/store/product-detail/product-detail.component'; // Asegúrate de que la ruta sea correcta
import { ImageSelectionComponent } from './components/admin-panel/productos/image-selection/image-selection.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { AdminGuard } from './auth/admin.guard';

// Define las rutas de la aplicación
export const routes: Routes = [
  { path: '', component: LoginSignupComponent }, // Ruta inicial
  { path: 'login-signup', component: LoginSignupComponent },
  {
    path: '', // Agrupando rutas con el layout
    component: MainLayoutComponent,
    children: [
      { path: 'store', component: StoreComponent },
      { 
        path: 'admin', 
        component: AdminPanelComponent, 
        canActivate: [AdminGuard],  // Protegemos la ruta con el guard
        children: [
          { path: '', redirectTo: 'usuarios', pathMatch: 'full' }, // Redirige a 'usuarios' por defecto
          { path: 'usuarios', component: UsuariosComponent },
          { path: 'productos', component: ProductosComponent },
          { path: 'productos/image-selection', component: ImageSelectionComponent },
          { path: 'recibos', component: RecibosComponent },
          { path: 'stock', component: StockComponent }
        ]
      },
      { path: 'cart', component: CartComponent },
      { path: 'perfil/purchase-history', component: PurchaseHistoryComponent },
      { path: 'perfil/favorites', component: FavoritesComponent },
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