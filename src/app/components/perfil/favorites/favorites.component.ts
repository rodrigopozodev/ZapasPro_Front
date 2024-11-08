import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from '../../../services/favorites.service';
import { Product } from '../../../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service'; // Importar UserService
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: Product[] = [];
  private userChangedSubscription: Subscription = new Subscription();
  private favoritesSubscription: Subscription = new Subscription(); // Suscripción a favoritos

  constructor(
    private favoritesService: FavoritesService,
    private userService: UserService // Inyectar UserService
  ) {}

  ngOnInit(): void {
    // Suscribirse al stream de productos favoritos
    this.favoritesSubscription = this.favoritesService.favoriteProducts$.subscribe(favorites => {
      this.favorites = favorites;
    });

    // Suscribirse a los cambios de usuario para actualizar los favoritos
    this.userChangedSubscription = this.userService.userChanged$.subscribe(() => {
      this.favoritesService.loadFavorites(); // Actualizar los favoritos al cambiar de usuario
    });
  }

  ngOnDestroy(): void {
    // Cancelar las suscripciones para evitar memory leaks
    this.userChangedSubscription.unsubscribe();
    this.favoritesSubscription.unsubscribe();
  }

  toggleFavorite(product: Product): void {
    // Cambiar el estado de favorito de un producto
    this.favoritesService.toggleFavorite(product);
  }

  isFavorite(product: Product): boolean {
    return this.favoritesService.isFavorite(product);
  }

  clearFavorites(): void {
    // Limpiar los favoritos
    this.favoritesService.clearFavorites();
  }
}
