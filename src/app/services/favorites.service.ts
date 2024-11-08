import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoriteProductsSubject = new BehaviorSubject<Product[]>([]);

  public favoriteProducts$ = this.favoriteProductsSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadFavorites(); // Cargar los favoritos al inicio
    this.userService.userChanged$.subscribe(() => {
      this.loadFavorites(); // Actualizar los favoritos al cambiar de usuario
    });
  }

  // Cargar los favoritos específicos del usuario
  loadFavorites(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.username}`);
      if (storedFavorites) {
        this.favoriteProductsSubject.next(JSON.parse(storedFavorites));
      } else {
        this.favoriteProductsSubject.next([]); // Si no hay favoritos, iniciar vacío
      }
    }
  }

  // Añadir o eliminar productos de los favoritos
  toggleFavorite(product: Product): void {
    const user = this.userService.getCurrentUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    let currentFavorites = this.favoriteProductsSubject.value;
    const productIndex = currentFavorites.findIndex(p => p.id === product.id);
    if (productIndex === -1) {
      currentFavorites.push(product); // Agregar a favoritos
    } else {
      currentFavorites.splice(productIndex, 1); // Eliminar de favoritos
    }

    this.favoriteProductsSubject.next(currentFavorites);
    this.saveFavoritesToLocalStorage(currentFavorites);
  }

  // Verificar si un producto es favorito
  isFavorite(product: Product): boolean {
    return this.favoriteProductsSubject.value.some(p => p.id === product.id);
  }

  // Limpiar los favoritos
  clearFavorites(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.favoriteProductsSubject.next([]); // Vaciar los favoritos
      localStorage.removeItem(`favorites_${user.username}`); // Eliminar favoritos del localStorage
    }
  }

  // Guardar los favoritos en localStorage bajo una clave única para el usuario
  private saveFavoritesToLocalStorage(favorites: Product[]): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    }
  }

  // Eliminar los favoritos del localStorage al cerrar sesión
  logout(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      localStorage.removeItem(`favorites_${user.username}`); // Eliminar favoritos al cerrar sesión
    }
  }
}
