import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../interfaces/product.interface';
import { CartItem } from '../../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GalleryImage } from '../../../interfaces/gallery-image.interface';  // Asegúrate de importar bien la interfaz
import { FavoritesService } from '../../../services/favorites.service';
import { UserService } from '../../../services/user.service';
import { PurchaseService } from '../../../services/purchase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product: Product = {} as Product;
  stock: any[] = [];
  cartProducts: CartItem[] = [];
  cartVisible: boolean = false;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  selectedSize: string = '';
  discountCode: string = '';
  discountRate: number = 0;
  mainImage: string = '';
  discountApplied: boolean = false;
  galleryImages: GalleryImage[] = [];

  private readonly validDiscountCode: string = 'ZapasProMola';
  private readonly discountPercentage: number = 0.15;
  private readonly userKeyPrefix: string = 'user_';
  // Definir cartSubscription como una propiedad de la clase
  private cartSubscription: Subscription = new Subscription();  // Aquí se declara correctamente

  constructor(
    private router: Router,
    private purchaseService: PurchaseService, 
    private route: ActivatedRoute,
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Cargar producto, stock, y carrito al iniciar
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProduct(id);  // Obtener los detalles del producto
      this.getStock(id);     // Obtener el stock del producto
    }
    
    this.loadDiscountCode();  // Cargar el código de descuento
  
    // Cargar el carrito
    this.loadCart();
  
    // Suscribirse a los cambios en el carrito
    this.cartSubscription = this.cartService.getCartUpdates().subscribe((updatedCart: CartItem[]) => {
      this.cartProducts = updatedCart;  // Actualizamos el carrito con los nuevos datos
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();  // Limpia la suscripción
    }
  }

  getProduct(id: string) {
    this.productService.getProductById(id).subscribe(response => {
      if (response.success) {
        const productData = response.product;

        if (productData.imageUrl && !productData.imageUrl.startsWith('http')) {
          productData.imageUrl = `${productData.imageUrl}`;
        }

        this.product = productData;
        this.mainImage = productData.imageUrl || this.mainImage;
        this.loadGalleryImages(productData.imageUrl);
      }
    });
  }

  loadGalleryImages(productImageUrl: string) {
    // Suponemos que la galería se genera a partir de un array de productos
    // y que se incluyen múltiples imágenes asociadas a cada producto por su `imageUrl`
    const galleryImagesMap: { [key: string]: GalleryImage[] } = {
      '/img/Nike Air Max Plus Drift azul.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift azul 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift azul 7.png' }
      ],
      '/img/Nike Air Max Plus Drift blanco.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco 7.png' }
      ],
      '/img/Nike Air Max Plus Drift blanco(1).png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift blanco(1) 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift blanco(1) 7.png' }
      ],
      '/img/Nike Air Max Plus Drift gris.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 3.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 3.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 6.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 6.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris 7.png' }
      ],
      '/img/Nike Air Max Plus Drift gris(1).png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift gris(1) 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift gris(1) 7.png' }
      ],
      '/img/Nike Air Max Plus Drift marron.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 6.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 6.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift marron 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift marron 7.png' }
      ],
      '/img/Nike Air Max Plus Drift negro.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro 7.png' }
      ],
      '/img/Nike Air Max Plus Drift rojo.png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 6.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 6.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift rojo 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift rojo 7.png' }
      ],
      '/img/Nike Air Max Plus Drift negro(1).png': [
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 1.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 1.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 2.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 2.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 3.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 3.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 4.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 4.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 5.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 5.png' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 6.jpg', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 6.jpg' },
        { thumbnail: '/img/galeria/Nike Air Max Plus Drift negro(1) 7.png', fullImage: '/img/galeria/Nike Air Max Plus Drift negro(1) 7.png' }
      ]
    
    };
    
    if (galleryImagesMap[productImageUrl]) {
      this.galleryImages = [
        { thumbnail: productImageUrl, fullImage: productImageUrl }, // Imagen principal
        ...galleryImagesMap[productImageUrl]
      ];
    } else {
      this.galleryImages = [{ thumbnail: productImageUrl, fullImage: productImageUrl }];
    }
  }

  getStock(productId: string) {
    this.productService.getStockByProductoId(productId).subscribe(response => {
      if (response) {
        this.stock = response;
      }
    });
  }

  getProductImages(productName: string): { imageUrl: string, productId: number }[] { 
    if (productName === "Nike Air Max Plus Drift") {
      return [
        { imageUrl: 'img/Nike Air Max Plus Drift rojo.png', productId: 1 },
        { imageUrl: 'img/Nike Air Max Plus Drift negro(1).png', productId: 2 },
        { imageUrl: 'img/Nike Air Max Plus Drift negro.png', productId: 3 },
        { imageUrl: 'img/Nike Air Max Plus Drift marron.png', productId: 4 },
        { imageUrl: 'img/Nike Air Max Plus Drift gris(1).png', productId: 5 },
        { imageUrl: 'img/Nike Air Max Plus Drift gris.png', productId: 6 },
        { imageUrl: 'img/Nike Air Max Plus Drift blanco(1).png', productId: 7 },
        { imageUrl: 'img/Nike Air Max Plus Drift blanco.png', productId: 8 },
        { imageUrl: 'img/Nike Air Max Plus Drift azul.png', productId: 9 }
      ];
    }
    return [];
  }
  
  selectColorway(productId: number) {
    // Redirige a la página del producto usando su id
    window.location.href = `/product/${productId}`;
  }
  

  onThumbnailHover(fullImage: string): void {
    this.mainImage = fullImage;
  }

  isTallaDisponible(talla: string): boolean {
    return this.stock.some(item => item.talla === talla && item.cantidad > 0);
  }

  seleccionarTalla(talla: string): void {
    this.selectedSize = talla;
    console.log(`Talla seleccionada: ${talla}`);
  }

  addToCart(): void {
    if (this.product && this.selectedSize) {
      const selectedStock = this.stock.find(item => item.talla === this.selectedSize);
      if (selectedStock) {
        const existingCartItem = this.cartProducts.find(item => 
          item.product.id === this.product.id && item.selectedSize === this.selectedSize
        );
        let cartItem: CartItem;
        if (existingCartItem) {
          existingCartItem.quantity += 1;
          cartItem = existingCartItem;
        } else {
          cartItem = {
            product: this.product,
            quantity: 1,
            stock: selectedStock,
            selectedSize: this.selectedSize
          };
          this.cartProducts.push(cartItem);
        }
        
        this.cartService.addToCart(cartItem);
        this.saveCartToLocalStorage();
        this.calculateTotals(); // Actualizar totales después de agregar un producto
        this.cartVisible = true;
      } else {
        console.log('Stock no encontrado para la talla seleccionada');
      }
    } else {
      console.log('Selecciona un producto y una talla antes de agregar al carrito');
    }
  }

  private saveCartToLocalStorage(): void {
    const username = this.getUsername();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      localStorage.setItem(`${this.userKeyPrefix}${username}`, JSON.stringify(this.cartProducts));
    }
  }

  closeCart(): void {
    this.cartVisible = false;
  }

  buy(): void {
    const userId = this.getCurrentUserName();
    const totalAmount = this.total;
    const productDetails: CartItem[] = this.cartProducts.map(cartProduct => ({
      product: { ...cartProduct.product },
      selectedSize: cartProduct.selectedSize,
      quantity: cartProduct.quantity,
      stock: cartProduct.stock,
    }));
  
    this.purchaseService.setPurchasedReceipt(userId, productDetails, totalAmount);
    
    // Vaciar el carrito y restablecer valores después de la compra
    this.cartService.clearCart();
    this.cartProducts = [];
    this.selectedSize = '';
    this.discountApplied = false;
    this.discountRate = 0;
    this.calculateTotals(); // Asegurarse de que los totales se actualicen a cero
  }

  private getCurrentUserName(): string {
    const user = this.userService.getStoredUser();
    return user ? user.username : ''; // Retornamos una cadena vacía si no se encuentra el usuario
  }

  loadCart(): void {
    const username = this.getUsername();
    if (isPlatformBrowser(this.platformId) && this.isLocalStorageAvailable()) {
      const savedCart = localStorage.getItem(`${this.userKeyPrefix}${username}`);
      if (savedCart) {
        this.cartProducts = JSON.parse(savedCart);
      } else {
        this.cartProducts = this.cartService.getCart();
      }
    } else {
      this.cartProducts = this.cartService.getCart();
    }
    this.calculateTotals();  // Calcular totales después de cargar el carrito
  }

  loadDiscountCode(): void {
    if (isPlatformBrowser(this.platformId)) {
      const discountUsedStatus = localStorage.getItem(`${this.userKeyPrefix}${this.getUsername()}_discountUsed`);
      if (discountUsedStatus === 'true') {
        this.discountRate = 0;
        this.discountCode = '';
      } else {
        const storedDiscountCode = localStorage.getItem('discountCode');
        if (storedDiscountCode === this.validDiscountCode) {
          this.discountCode = storedDiscountCode;
          this.discountRate = this.discountPercentage;
        }
      }
      this.calculateTotals();  // Asegurar que el descuento sea aplicado en el total
    }
  }

  // Método para aplicar un descuento
  applyDiscount(): void {
    if (this.discountCode === this.validDiscountCode) {
      this.discountRate = this.discountPercentage;
      this.calculateTotals();
      localStorage.setItem(`${this.userKeyPrefix}${this.getUsername()}_discountUsed`, 'true');
    } else {
      this.discountRate = 0;
      this.calculateTotals();
    }
  }

  saveDiscountCode(): void {
    if (isPlatformBrowser(this.platformId) && this.discountCode === this.validDiscountCode) {
      localStorage.setItem('discountCode', this.discountCode);
    } else if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('discountCode');
    }
  }

  clearDiscount(): void {
    localStorage.removeItem('discountCode');
    this.discountRate = 0;
    this.discountCode = '';
  }

  private calculateTotals(): void {
    // Actualizar subtotal, descuento y total
    this.subtotal = this.cartProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.total = this.subtotal * (1 - this.discountRate);
  }

   // Método para obtener el nombre de usuario actual (si es necesario)
   getUsername(): string {
    const user = this.userService.getStoredUser();
    return user ? user.username : ''; // Retorna un string vacío si no hay usuario
  }

  isLocalStorageAvailable(): boolean {
    try {
      const testKey = 'test';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  


  // Método para incrementar la cantidad de un producto en el carrito
  incrementQuantity(cartItem: CartItem): void {
    const selectedStock = this.stock.find(item => item.talla === cartItem.selectedSize);
    if (selectedStock && cartItem.quantity < selectedStock.cantidad) {
      cartItem.quantity += 1;
      this.cartService.updateCart(cartItem);  // Assuming this method exists for updating the cart
      this.calculateTotals();  // Recalculate totals
    } else {
      alert('No hay suficiente stock para incrementar la cantidad');
    }
  }
  

  // Método para decrementar la cantidad de un producto en el carrito
  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      this.cartService.updateCart(cartItem);  // Assuming this method exists for updating the cart
    } else {
      this.removeFromCart(cartItem);
    }
    this.calculateTotals();  // Recalculate totals
  }
  

  goToCart() {
    // Si estás utilizando Angular Router para navegar a la página del carrito
    this.router.navigate(['/cart']);
  }

  removeFromCart(cartItem: CartItem): void {
    // Filtrar el carrito para eliminar el ítem
    this.cartProducts = this.cartProducts.filter(item => 
      !(item.product.id === cartItem.product.id && item.selectedSize === cartItem.selectedSize)
    );
  
    // Actualizar carrito en el servicio y en localStorage
    this.cartService.removeFromCart(cartItem);  // Asegúrate de tener este método en el servicio
    this.saveCartToLocalStorage();  // Guardamos el carrito actualizado en localStorage
  
    this.calculateTotals();  // Recalcular los totales después de eliminar el producto
  }
  

  changeMainImage(newImage: string) {
    this.mainImage = newImage;
  }

  // Toggle de favoritos
  toggleFavorite(product: Product) {
    this.favoritesService.toggleFavorite(product);
  }

  // Verifica si un producto es favorito
  isFavorite(product: Product): boolean {
    return this.favoritesService.isFavorite(product);
  }
}


