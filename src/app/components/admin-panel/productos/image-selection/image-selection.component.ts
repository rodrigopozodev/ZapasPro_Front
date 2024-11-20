import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormStateService } from '../../../../services/form-state.service';  // Asegúrate de ajustar la ruta si es necesario

// Define un nuevo tipo para las imágenes agrupadas
interface GroupedImages {
  firstWord: string;
  products: { name: string; url: SafeUrl; imageUrl: string }[];
}

@Component({
  selector: 'app-image-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css'],
})
export class ImageSelectionComponent implements OnInit {
  private apiUrlProducts = 'https://zapaspro-back.onrender.com/api/products';
  images: GroupedImages[] = [];
  filteredImages: GroupedImages[] = [];
  showButtons: boolean = true;
  selectedFirstWord: string | null = null;
  previewImageUrl: string | null = null;  // Para almacenar la URL de la imagen que se mostrará al pasar el ratón
  hoveringProduct: any | null = null; // Para rastrear el producto que está siendo destacado

  constructor(
    private router: Router,              // Inyecta el router aquí
    private http: HttpClient, 
    private sanitizer: DomSanitizer,
    private formStateService: FormStateService  // Inyecta el servicio de estado del formulario
  ) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.http.get<Product[]>(this.apiUrlProducts).subscribe(
      (response) => {
        const groupedImages: { [key: string]: { name: string; url: SafeUrl; imageUrl: string }[] } = {};
        response.forEach((product) => {
          const firstWord = product.name.split(' ')[0];
          const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(product.imageUrl);
          if (!groupedImages[firstWord]) {
            groupedImages[firstWord] = [];
          }
          groupedImages[firstWord].push({ name: product.name, url: sanitizedUrl, imageUrl: product.imageUrl });
        });
        this.images = Object.entries(groupedImages).map(([key, value]) => ({
          firstWord: key,
          products: value,
        }));
      },
      (error) => {
        console.error('Error loading images:', error);
      }
    );
  }

  filterByFirstWord(firstWord: string): void {
    this.selectedFirstWord = firstWord;
    this.filteredImages = this.images.filter(group => group.firstWord === firstWord);
    this.showButtons = false;
  }

  showAllImages(): void {
    this.showButtons = true;
    this.filteredImages = [];
  }

  confirmImageSelection(imageUrl: string): void {
    this.formStateService.setSelectedImage(imageUrl); // Almacena la URL de la imagen seleccionada
    this.formStateService.setShowProductForm(true); // Asegúrate de que el formulario se muestre
    this.router.navigate(['/admin/productos']); // Navega al formulario
  }


  volverAlFormulario(): void {
    this.formStateService.setShowProductForm(true);  // Establece que el formulario debe ser visible
    this.router.navigate(['/admin/productos']);  // Navega de vuelta al formulario
  }

  // Método para mostrar la vista previa al pasar el ratón
  showPreviewImage(imageUrl: string) {
    this.previewImageUrl = imageUrl; // Establece la URL de la imagen de vista previa
  }

  // Método para limpiar la vista previa
  clearPreviewImage() {
    this.previewImageUrl = null; // Limpia la vista previa
  }

  // Método que se llamará al pasar el mouse sobre un producto
  onMouseOverProduct(product: any) {
    this.hoveringProduct = product;
  }

  // Método que se llamará al salir el mouse de un producto
  onMouseLeaveProduct() {
    this.hoveringProduct = null;
  }

  // Verifica si el producto está siendo resaltado
  isHoveringProduct(product: any): boolean {
    return this.hoveringProduct === product;
  }
}
