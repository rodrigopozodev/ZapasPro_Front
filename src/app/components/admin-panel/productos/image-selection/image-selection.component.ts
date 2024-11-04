import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface GroupedImages {
  firstWord: string;
  products: { id: number; name: string; imageUrl: string }[];  // Cambié `url` a `imageUrl` para claridad
}

@Component({
  selector: 'app-image-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css'],
})
export class ImageSelectionComponent implements OnInit {
  private apiUrlProducts = 'http://localhost:3000/api/products';
  images: GroupedImages[] = [];
  selectedImageUrl: string | null = null;
  filteredImages: GroupedImages[] = [];
  showButtons: boolean = true;
  selectedFirstWord: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.http.get<Product[]>(this.apiUrlProducts).subscribe(
      (response) => {
        const groupedImages: { [key: string]: { id: number; name: string; imageUrl: string }[] } = {};

        response.forEach((product) => {
          const firstWord = product.name.split(' ')[0];
          if (!groupedImages[firstWord]) {
            groupedImages[firstWord] = [];
          }
          groupedImages[firstWord].push({ id: product.id, name: product.name, imageUrl: product.imageUrl });
        });

        this.images = Object.entries(groupedImages).map(([key, value]) => ({
          firstWord: key,
          products: value.sort((a, b) => a.name.localeCompare(b.name)),
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

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;  // Asignar la URL de la imagen directamente
  }

  showAllImages(): void {
    this.showButtons = true;
    this.filteredImages = [];
    this.selectedImageUrl = null;
    this.selectedFirstWord = null;
  }

  cancelSelection(): void {
    this.selectedImageUrl = null;
  }
}
