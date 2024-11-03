import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; // Inicializa product como null

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtén el ID de la URL
    this.getProduct(id); // Llama al método para obtener el producto
  }

  getProduct(id: string | null) {
    if (id) {
      this.productService.getProductById(id).subscribe(
        (response: { success: boolean; product: Product }) => {
          if (response.success) {
            // Asegúrate de que la imagen sea una URL completa
            const productData = response.product;
            if (productData.imageUrl && !productData.imageUrl.startsWith('http')) {
              productData.imageUrl = `${productData.imageUrl}`;
            }
            this.product = productData; // Asigna el producto recibido
          } else {
            console.error('Error: No se pudo obtener el producto.');
          }
        },
        (error: any) => {
          console.error('Error al obtener el producto', error);
        }
      );
    }
  }
}  
