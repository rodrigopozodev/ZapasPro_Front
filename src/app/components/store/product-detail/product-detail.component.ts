import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service'; // Importamos CartService
import { Product } from '../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; // Inicializa product como null
  stock: any[] = []; // Propiedad para almacenar todas las tallas disponibles del stock

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService // Inyectamos CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtén el ID de la URL
    if (id) {
      this.getProduct(id); // Llama al método para obtener el producto
      this.getStock(id); // Llama al método para obtener el stock
    }
  }

  // Obtener producto por ID
  getProduct(id: string) {
    this.productService.getProductById(id).subscribe(
      (response: { success: boolean; product: Product }) => {
        if (response.success) {
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

  // Obtener stock por productoId
  getStock(productoId: string) {
    this.productService.getStockByProductoId(productoId).subscribe(
      (response: any) => {
        if (response) {
          this.stock = response; // Asigna todas las tallas recibidas
        } else {
          console.error('Error: No se pudo obtener el stock.');
        }
      },
      (error: any) => {
        console.error('Error al obtener el stock', error);
      }
    );
  }

  // Verificar si la talla está disponible en el stock
  isTallaDisponible(talla: string): boolean {
    return this.stock.some((item) => item.talla === talla && item.cantidad > 0);
  }

  // Lógica para seleccionar una talla
  seleccionarTalla(talla: string): void {
    console.log(`Talla seleccionada: ${talla}`);
    // Aquí puedes almacenar la talla seleccionada o realizar otra acción
  }

  // Método para añadir el producto al carrito
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product); // Llamamos al método del CartService
      console.log(`${this.product.name} ha sido añadido al carrito.`);
    }
  }
}
