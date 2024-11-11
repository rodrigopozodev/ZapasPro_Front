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
  colors: string[] = ['Negro', 'Azul', 'Marrón', 'Verde', 'Gris', 'Naranja', 'Rosa', 'Morado', 'Rojo', 'Blanco', 'Amarillo', 'Multicolor'];
  newColor: string = ''; // Para almacenar el nuevo color escrito
  marcas: string[] = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Converse', 'New Balance']; // Marcas predeterminadas
  newProduct: any = { id: 0, name: '', description: '', price: '', gender: '', color: '', marca: '', imageUrl: '', imageName: '' };
  previewImageUrl: string | ArrayBuffer | null | undefined = null;
  customImageUrl: string = '';
  showUploadOptions: boolean = false;
  brandsImages: { [key: string]: string[] } = { Nike: [], Puma: [], Adidas: [] };
  selectedBrandImage: string | null = null;
  showUrlInput: boolean = false;
  showUploadImageInput: boolean = false;
  isAddingNewBrand: boolean = false; // Estado para mostrar el campo de nueva marca
  newBrand: string = ''; // Nueva propiedad para la marca a registrar
  showNewBrandInput: boolean = false;
  imageUrls: string[] = [];
  selectedFilter: string = '';

  constructor(private http: HttpClient, private router: Router, private formStateService: FormStateService) {
    this.loadProducts();
    this.showProductForm = this.formStateService.getShowProductForm();
  }

  ngOnInit(): void {
    // Restaurar el estado del formulario si hay información guardada
    const savedProduct = this.formStateService.getProduct();
    if (savedProduct) {
      this.newProduct = savedProduct;
    }
    
    // Restaurar la imagen si ya se había seleccionado
    this.newProduct.imageUrl = this.formStateService.getSelectedImage();
    this.newProduct.imageName = this.formStateService.getSelectedImageName();
  }

  cancelImageSelection() {
    // Restaurar el estado del formulario cuando se cancela la selección de imagen
    this.newProduct = this.formStateService.getProduct() || { imageUrl: '' };
    this.showUploadOptions = false;
  }

  public handleUploadImage() {
    this.showUploadOptions = true;
    // No cambiamos el estado del formulario aquí para mantener los datos intactos
  }

  // Método para cargar productos
  public loadProducts(): void {
    this.getProducts(this.currentProductPage).subscribe(
      (response: Product[]) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.extractUniqueBrands();
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

 

  // Filtrar productos
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
      filtered = filtered.filter(product => product.color.toLowerCase() === this.selectedColorFilter.toLowerCase());
    }

    if (this.brandFilter) {
      filtered = filtered.filter(product => product.marca.toLowerCase() === this.brandFilter.toLowerCase());
    }

    if (this.selectedFilter) {
      filtered = filtered.filter(product =>
        product.gender.toLowerCase() === this.selectedFilter.toLowerCase() ||
        product.color.toLowerCase() === this.selectedFilter.toLowerCase() ||
        product.marca.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }

    this.filteredProducts = filtered;
    this.calculateTotalProductPages();
    this.updateProductList();
  }

  // Función para agregar una nueva marca
  addBrand() {
    if (this.newBrand && !this.marcas.includes(this.newBrand)) {
      this.marcas.push(this.newBrand); // Añade la nueva marca al array de marcas
      this.newProduct.marca = this.newBrand; // Establece la nueva marca en el producto
      this.newBrand = ''; // Limpia el campo de texto después de agregar la marca
    }
  }

  // Método para navegar a la página de seleccionar imágenes
  navigateToImageSelection() {
    // Guardar el estado del formulario antes de navegar
    this.formStateService.setProduct(this.newProduct);
    this.router.navigate(['/admin/productos/image-selection']);
  }

  // Método para limpiar el formulario y la vista previa al cancelar
  resetForm() {
    // Resetear solo cuando se confirma el reset del formulario
    this.newProduct = { id: 0, name: '', description: '', price: '', gender: '', color: '', marca: '', imageUrl: '', imageName: '' };
    this.previewImageUrl = null;
    this.selectedProduct = null;
    this.isEditing = false;
  }

  // Método para actualizar la lista de productos paginados
  private updateProductList() {
    const startIndex = (this.currentProductPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.isEditing = false;
  }

  // Método para cancelar la edición
  cancelEdit(): void {
    this.newProduct = { id: 0, name: '', description: '', price: '', gender: '', color: '', marca: '', imageUrl: '', imageName: '' }; // Limpiar `newProduct`
    this.isEditing = false;  // Cierra el formulario de edición
  }
  

  // Método para registrar el producto
  registerProduct() {
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

  cancelProduct() {
    // Limpiar formulario solo si el usuario cancela explícitamente
    this.resetForm();
    this.showProductForm = false;
    this.formStateService.setShowProductForm(false);
  }

  public editProduct(product: Product) {
    this.newProduct = { ...product };  // Se utiliza newProduct para editar
    this.selectedProduct = product;    // Guarda el producto seleccionado para posterior edición
    this.isEditing = true;             // Cambia el estado a edición
  }
  

  deleteProduct(product: Product) {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (confirmation) {
      this.http.delete(`${this.apiUrlProducts}/${product.id}`).subscribe(
        () => {
          console.log('Producto eliminado');
          this.loadProducts();
        },
        (error: any) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    }
  }

  // Método para manejar la paginación de productos
  goToPage(page: number) {
    this.currentProductPage = page;
    this.updateProductList();
  }

  // Calcular el total de páginas de productos
  private calculateTotalProductPages() {
    this.totalProductPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  updateImageUrl(url: string): void {
    this.newProduct.imageUrl = url;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
        this.newProduct.imageUrl = this.previewImageUrl;
      };
      reader.readAsDataURL(file);
    }
  }

  previousProductPage(): void {
    if (this.currentProductPage > 1) {
      this.currentProductPage--;
      this.updateProductList();
    }
  }
  
  nextProductPage(): void {
    if (this.currentProductPage < this.totalProductPages) {
      this.currentProductPage++;
      this.updateProductList();
    }
  }
  
  updateProduct(product: Product): void {
    // Asegúrate de que `newProduct` tenga los valores del formulario
    this.http.put(`${this.apiUrlProducts}/${product.id}`, product).subscribe(
      (response) => {
        console.log('Producto actualizado:', response);
        this.loadProducts(); // Recarga la lista de productos después de actualizar
        this.resetForm(); // Restablece el formulario
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  }
  
  filterBrandsByColor(color: string): void {
    this.filteredProducts = this.products.filter(product => product.color === color);
  }
  
  filterColorsByBrand(brand: string): void {
    this.filteredProducts = this.products.filter(product => product.marca === brand);
  }

  closeForm() {
    this.isEditing = false;
  }

   // Método para agregar el nuevo color
   addColor() {
    if (this.newColor && !this.colors.includes(this.newColor)) {
      this.colors.push(this.newColor);
      this.newColor = ''; // Limpiar el campo de entrada
    } else {
      // Opcionalmente, puedes mostrar un mensaje de error si el color ya existe o está vacío
      console.error('El color ya existe o está vacío');
    }
  }
  
}
