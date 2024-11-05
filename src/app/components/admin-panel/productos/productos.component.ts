import { Component, OnInit } from '@angular/core';
import { Product } from '../../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormStateService } from '../../../services/form-state.service'; 

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  private apiUrlProducts = 'http://localhost:3000/api/products';

  showProducts = false; 
  products: Product[] = [];
  currentProduct: Product | null = null;
  searchProductTerm: string = ''; 
  paginatedProducts: Product[] = [];
  filteredProducts: Product[] = []; 
  totalProductPages: number = 1; 
  currentProductPage: number = 1; 
  selectedProduct: any; 
  showProductForm: boolean = false; 
  isEditing = false; 
  genders: string[] = ['Masculino', 'Femenino', 'Unisex']; 
  genderFilter: string = ''; 
  brandFilter: string = ''; 
  itemsPerPage: number = 5; 
  showEditForm = false;
  selectedColorFilter: string = ''; 
  colors: string[] = []; 
  marcas: string[] = []; 

  newProduct: any = { id: 0, name: '', description: '', price: '', gender: '', color: '', marca: '', imageUrl: '', imageName: '' };
  previewImageUrl: string | ArrayBuffer | null | undefined = null;
  customImageUrl: string = '';
  showUploadOptions: boolean = false; 
  brandsImages: { [key: string]: string[] } = { Nike: [], Puma: [], Adidas: [] }; 
  selectedBrandImage: string | null = null; 
  showUrlInput: boolean = false; 
  showUploadImageInput: boolean = false;

  imageUrls: string[] = [
    '/img/Nike Air Max Plus Drift.png',
    '/img/Nike Dunk Low.png',
    '/img/Nike Air Max Plus.png',
    '/img/Nike Air Max Excee.png',
    '/img/Nike Air Force 1 Low EVO.png',
    '/img/Nike Air Force 1 Sage Low.png', 
    '/img/Nike Air Max 1.png',           
    '/img/Nike Air Max 90.png',         
    '/img/Nike SB Dunk Low Pro Premium.png',
    '/img/Nike_Air Max Plus Drift.png', 
    '/img/Adidas_Gazelle_Negro.png',         
    '/img/Adidas_Handball_Spezial_Azul.png', 
    '/img/Adidas_Handball_Spezial_Naranjas.png', 
    '/img/Adidas_Handball_Spezial_Turkesa.png', 
    '/img/Adidas_Stan_Smith_Blanco.png',
    '/img/Puma Rebound.png',              
    '/img/Puma Mayze.png',                
    '/img/Puma Mayze Luxe.png',           
    '/img/Puma Ca Pro Classic.png',       
    '/img/Puma 180.png'                   
  ];
  
  selectedFilter: string = '';

  constructor(private http: HttpClient, private router: Router, private formStateService: FormStateService) {
    this.loadProducts();
    this.showProductForm = this.formStateService.getShowProductForm();
  }

  ngOnInit(): void {
    // Comprueba si hay una imagen seleccionada en el estado del formulario
    this.newProduct.imageUrl = this.formStateService.getSelectedImage(); // Rellena la URL de la imagen

    // Extrae el nombre de la imagen y lo muestra en el input
    this.newProduct.imageName = this.formStateService.getSelectedImageName(); // Rellena el nombre de la imagen
}

  cancelImageSelection() {
    this.newProduct = this.formStateService.getProduct() || { imageUrl: '' }; // Recuperar el estado del formulario
    this.showUploadOptions = false; // Ocultar las opciones de subida
  }

   // Este método se llama al hacer clic en "Subir Imagen"
   public handleUploadImage() {
    // En este punto, ya no registramos el producto, sino que solo mostramos opciones.
    this.showUploadOptions = true; // Muestra las opciones de subida
    this.formStateService.setShowProductForm(false); // Asegúrate de que el formulario no se muestre
  }

  // Método para cargar productos
  public loadProducts(): void {
    this.getProducts(this.currentProductPage).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.extractUniqueBrands();
        this.extractUniqueColors();
        this.filterProducts(); 
        this.showProducts = true; 
      },
      (error: any) => {
        console.error('Error en la solicitud de productos:', error);
      }
    );
  }

  public getProducts(page: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlProducts}?_page=${page}&_limit=${this.itemsPerPage}`);
  }

  // Extraer marcas únicas
  private extractUniqueBrands(): void {
    const uniqueBrandsSet = new Set<string>();
    this.products.forEach(product => {
      uniqueBrandsSet.add(product.marca);
    });
    this.marcas = Array.from(uniqueBrandsSet); // Asignar marcas únicas a la propiedad
  }

  // Extraer colores únicos
  private extractUniqueColors(): void {
    const uniqueColorsSet = new Set<string>();
    this.products.forEach(product => {
      uniqueColorsSet.add(product.color);
    });
    this.colors = Array.from(uniqueColorsSet); // Asignar colores únicos a la propiedad
  }

  // Filtrar colores basados en la marca seleccionada
  public filterColorsByBrand(selectedBrand: string) {
    if (selectedBrand) {
      const filteredProducts = this.products.filter(product => product.marca === selectedBrand);
      const uniqueColorsSet = new Set<string>(filteredProducts.map(product => product.color));
      this.colors = Array.from(uniqueColorsSet);
      this.selectedColorFilter = ''; // Reiniciar el filtro de color
    } else {
      this.extractUniqueColors(); // Si no hay marca seleccionada, extraer todos los colores
    }
  }

  // Filtrar marcas basados en el color seleccionado
  public filterBrandsByColor(selectedColor: string) {
    if (selectedColor) {
      const filteredProducts = this.products.filter(product => product.color === selectedColor);
      const uniqueBrandsSet = new Set<string>(filteredProducts.map(product => product.marca));
      this.marcas = Array.from(uniqueBrandsSet);
      this.brandFilter = ''; // Reiniciar el filtro de marca
    } else {
      this.extractUniqueBrands(); // Si no hay color seleccionado, extraer todas las marcas
    }
  }

  // Actualizar el método para calcular el total de páginas
  calculateTotalProductPages(): void {
    const totalItems = this.filteredProducts.length; // Cambia esto para que cuente los productos filtrados
    this.totalProductPages = Math.ceil(totalItems / this.itemsPerPage);
    this.updateProductList();
  }

  public editProduct(product: any) {
    this.selectedProduct = { ...product };
    this.isEditing = true; 
    this.formStateService.setProduct(this.selectedProduct); // Guarda el producto en el servicio
}

  deleteProduct(productId: number) {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmDelete) {
      this.http.delete(`${this.apiUrlProducts}/${productId}`).subscribe(
        (response) => {
          console.log(`Producto con ID: ${productId} eliminado`, response);
          this.products = this.products.filter(product => product.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
          this.extractUniqueBrands(); // Actualizar las marcas después de eliminar un producto
          this.extractUniqueColors(); // Actualizar los colores después de eliminar un producto
          this.calculateTotalProductPages(); 
          this.updateProductList();
        },
        (error: any) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    } else {
      console.log('Eliminación cancelada.');
    }
  }

  filterProducts() {
    let filtered = this.products;

    if (this.searchProductTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchProductTerm.toLowerCase())
      );
    }

    if (this.genderFilter) {
      filtered = filtered.filter(product => product.gender.toLowerCase() === this.genderFilter.toLowerCase());
    }

    if (this.selectedColorFilter) {
      filtered = filtered.filter(product => product.color.toLowerCase() === this.selectedColorFilter.toLowerCase()); // Corregido para comparar el tipo de unión
    }

    if (this.brandFilter) {
      filtered = filtered.filter(product => product.marca.toLowerCase() === this.brandFilter.toLowerCase());
    }

    // Filtrar por el filtro seleccionado
    if (this.selectedFilter) {
      filtered = filtered.filter(product => 
        product.gender.toLowerCase() === this.selectedFilter.toLowerCase() || 
        product.color.toLowerCase() === this.selectedFilter.toLowerCase() || 
        product.marca.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }

    this.filteredProducts = filtered;
    this.calculateTotalProductPages(); // Llama aquí para recalcular el total de páginas después de filtrar
    this.updateProductList();
  }

  private updateProductList() {
    const startIndex = (this.currentProductPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.isEditing = false;
  }

  updateProduct(productId: number) {
    if (this.selectedProduct) {
      this.http.put(`${this.apiUrlProducts}/${productId}`, this.selectedProduct).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts(); 
          this.showEditForm = false; 
          this.selectedProduct = null; 
        },
        (error: any) => {
          console.error('Error al actualizar el producto:', error);
        }
      );
    }
  }

  public nextProductPage(): void {
    if (this.currentProductPage < this.totalProductPages) {
      this.currentProductPage++;
      this.updateProductList();
    }
  }

  public previousProductPage(): void {
    if (this.currentProductPage > 1) {
      this.currentProductPage--;
      this.updateProductList();
    }
  }

  public goToProductPage(page: number): void {
    if (page >= 1 && page <= this.totalProductPages) {
      this.currentProductPage = page;
      this.updateProductList();
    }
  }

  public cancelEdit(): void {
    this.currentProduct = null;
    this.isEditing = false;
  }

  // Este método es el que se utiliza para registrar el producto
  registerProduct() {
    // Esta lógica debe ser evitada si solo queremos mostrar las opciones.
    this.http.post(this.apiUrlProducts, this.newProduct).subscribe(
      (response) => {
        console.log('Producto registrado:', response);
        this.loadProducts(); 
        this.cancelProduct(); 
      },
      (error: any) => {
        console.error('Error al registrar el producto:', error);
      }
    );
  }

   // Método para agregar una nueva imagen (opcional, según tu lógica)
  addImage() {
    if (this.customImageUrl) {
      this.imageUrls.push(this.customImageUrl); // Agrega la nueva URL a la lista
      this.customImageUrl = ''; // Limpia el campo después de agregar
    }
  }

   // Método para manejar la selección de archivo
   onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.previewImageUrl = e.target.result; // Establecer la vista previa
            this.newProduct.imageUrl = e.target.result; // Asignar la URL de la imagen
            this.newProduct.imageName = file.name; // Asignar el nombre de la imagen
        };
        reader.readAsDataURL(file); // Leer la imagen como URL
    }
}

updateImageUrl(url: string) {
  if (url) {
      this.newProduct.imageUrl = url; // Actualiza la URL de la imagen
      this.newProduct.imageName = this.extractImageName(url); // Extrae y asigna el nombre de la imagen
  } else {
      this.newProduct.imageUrl = '';
      this.newProduct.imageName = '';
  }
}

isFormValid(): boolean {
  return this.newProduct.name !== '' && this.newProduct.price > 0 && 
         (this.newProduct.imageUrl !== '' || this.newProduct.imageName !== '');
}


  // Método para limpiar el formulario y la vista previa al cancelar
resetForm() {
  this.newProduct = { imageUrl: '' }; // Reinicia el modelo del producto
  this.customImageUrl = ''; // Limpia la URL personalizada
  this.previewImageUrl = null; // Limpia la vista previa
  this.selectedProduct = null; // Reinicia el producto seleccionado si estaba en edición
  this.isEditing = false; // Asegúrate de que no esté en modo de edición
}


  // Método para mostrar la vista previa al pasar el ratón sobre las opciones del select
  showPreviewOnHover(url: string) {
    this.previewImageUrl = url;
  }

     // Método para mostrar la vista previa al pasar el ratón sobre las opciones del select
  updatePreview(url: string) {
    if (url) {
      this.previewImageUrl = url; // Actualiza la vista previa con la URL seleccionada
    } else {
      this.previewImageUrl = null; // Si no hay URL, limpia la vista previa
    }
  }

 // Esta función se llama al cancelar el formulario
 cancelProduct() {
  this.resetForm(); // Asegúrate de limpiar todos los campos del formulario
  this.showProductForm = false; // Ocultar el formulario después de cancelar
  this.formStateService.setShowProductForm(this.showProductForm); // Guardar el estado en el servicio
}


   // Método para navegar a la página de seleccionar imágenes
   public navigateToImageSelection() {
    this.formStateService.setProduct(this.newProduct); // Guarda el estado del formulario
    this.router.navigate(['/admin/productos/image-selection']);
  }


    // Método para alternar la visibilidad de las opciones de subida
  toggleUploadOptions() {
    this.showUploadOptions = !this.showUploadOptions;
    // Resetea las vistas de URL e imagen al alternar
    this.showUrlInput = false; 
    this.showUploadImageInput = false; 
  }

  // Método para mostrar las opciones de subir imagen
  useUploadImage() {
    // Lógica para manejar la subida de imagen
    this.showUploadOptions = false; // Oculta las opciones
  }

  // Almacenar el estado del formulario antes de navegar
  useCustomImageUrl() {
    this.formStateService.setProduct(this.newProduct); // Guarda el estado del formulario
    // Resto de la lógica para utilizar la URL de imagen
  }
  

  // Método para cargar imágenes en las marcas
  loadBrandImages() {
    // Asignar imágenes a las marcas según su nombre
    this.imageUrls.forEach(url => {
      const brand = url.split('/')[2]; // Asume que la estructura es /img/[marca]/[imagen]
      if (brand === 'Nike' || brand === 'Puma' || brand === 'Adidas') {
        this.brandsImages[brand].push(url);
      }
    });
  }

  extractImageName(url: string): string {
    const urlParts = url.split('/');
    const fileName = urlParts.pop() || '';
    return fileName.split('.')[0]; // Elimina la extensión del nombre del archivo
  }

}

