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

  // Método para reiniciar el producto
  resetProduct(): void {
    this.product = null; // Reinicia el estado del producto
  }

  // Método para extraer el nombre de la imagen de la URL
  private extractImageName(imageUrl: string): string {
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1]; // Obtiene el último segmento de la URL
    return fileName.replace('.png', ''); // Retorna el nombre sin la extensión
  }

  // Asegúrate de que los métodos en formStateService gestionen todos los datos del formulario
setProduct(product: any) {
  localStorage.setItem('productForm', JSON.stringify(product)); // Guardar todos los datos
}

getProduct(): any {
  const product = localStorage.getItem('productForm');
  return product ? JSON.parse(product) : {}; // Devolver el objeto del producto guardado
}

setShowProductForm(show: boolean) {
  localStorage.setItem('showProductForm', JSON.stringify(show));
}

getShowProductForm(): boolean {
  const show = localStorage.getItem('showProductForm');
  return show ? JSON.parse(show) : false;
}

setSelectedImage(imageUrl: string) {
  localStorage.setItem('selectedImageUrl', imageUrl);
}

getSelectedImage(): string {
  return localStorage.getItem('selectedImageUrl') || ''; // Obtener la URL de la imagen guardada
}

setSelectedImageName(imageName: string) {
  localStorage.setItem('selectedImageName', imageName);
}

getSelectedImageName(): string {
  return localStorage.getItem('selectedImageName') || ''; // Obtener el nombre de la imagen guardada
}

}
