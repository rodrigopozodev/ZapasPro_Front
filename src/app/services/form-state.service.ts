import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private showProductForm = false; // Estado para mostrar u ocultar el formulario
  private product: Product | null = null; // Almacena el producto actual
  private selectedImageUrl: string | null = null; // Almacena la URL de la imagen seleccionada
  private selectedImageName: string | null = null; // Almacena el nombre de la imagen seleccionada

  // Método para establecer el estado del formulario
  setShowProductForm(show: boolean): void {
    this.showProductForm = show;
  }

  // Método para obtener el estado del formulario
  getShowProductForm(): boolean {
    return this.showProductForm;
  }

  // Método para establecer el producto actual
  setProduct(product: Product): void {
    this.product = product;
  }

  // Método para obtener el producto actual
  getProduct(): Product | null {
    return this.product;
  }

  // Método para reiniciar el producto
  resetProduct(): void {
    this.product = null; // Reinicia el estado del producto
  }

  // Método para establecer la imagen seleccionada
  setSelectedImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl; // Almacena la URL de la imagen
    this.selectedImageName = this.extractImageName(imageUrl); // Establece el nombre de la imagen
  }

  // Método para obtener la imagen seleccionada
  getSelectedImage(): string | null {
    return this.selectedImageUrl; // Devuelve la URL de la imagen seleccionada
  }

  // Método para obtener el nombre de la imagen seleccionada
  getSelectedImageName(): string | null {
    return this.selectedImageName; // Devuelve el nombre de la imagen seleccionada
  }

  // Método para extraer el nombre de la imagen de la URL
  private extractImageName(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1]; // Obtiene el último segmento de la URL
    return fileName.replace('.png', ''); // Retorna el nombre sin la extensión
  }
}
