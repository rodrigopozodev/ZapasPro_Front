import { Component } from '@angular/core';
import { Stock } from '../../../interfaces/stock.interfaces'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  private apiUrlStock = 'http://localhost:3000/api/stock';

  showStock = false; 
  stockItems: Stock[] = []; 
  paginatedStock: Stock[] = [];
  totalStockPages: number = 1; 
  currentStockPage: number = 1; 
  selectedStock: Stock | null = null; 
  isEditing = false; 
  itemsPerPage: number = 20; 

  // Nueva propiedad para registrar un nuevo movimiento
  newMovement = {
    fecha: '',
    productoId: 0, // Cambiado a 0 para que sea un número
    talla: '',
    cantidad: 0,
    movimiento: 'compra' // Por defecto, será compra
  };

  // Nueva propiedad para mostrar u ocultar el formulario de movimiento
  showMovementForm = false;

  // Propiedades para el filtrado
  selectedFilter: string = 'id'; // Filtro por defecto
  searchTerm: string = '';
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadStock();
  }

  public loadStock(): void {
    this.getStock(this.currentStockPage).subscribe(
      (response: Stock[]) => {
        this.stockItems = response; 
        this.calculateTotalStockPages();
        this.updateStockList();
        this.showStock = true; 
      },
      (error: any) => {
        console.error('Error en la solicitud de stock:', error);
      }
    );
  }
  
  public getStock(page: number): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrlStock}?_page=${page}&_limit=${this.itemsPerPage}`);
  }

  calculateTotalStockPages(): void {
    this.http.get<Stock[]>(this.apiUrlStock).subscribe((response) => {
      const totalItems = response.length; 
      this.totalStockPages = Math.ceil(totalItems / this.itemsPerPage);
    });
  }

  private updateStockList() {
    const startIndex = (this.currentStockPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStock = this.stockItems.slice(startIndex, endIndex);
  }

  public editStock(stock: Stock) {
    this.selectedStock = { ...stock };
    this.isEditing = true; 
  }

  public cancelStock(): void {
    this.selectedStock = null; 
    this.isEditing = false; 
  }

  deleteStock(stockId: number) {
    this.stockItems = this.stockItems.filter(stock => stock.id !== stockId);
    this.updateStockList(); 
  }

  updateStock(stockId: number) {
    if (this.selectedStock) {
      this.http.put(`${this.apiUrlStock}/${stockId}`, this.selectedStock).subscribe(
        (response) => {
          this.loadStock(); 
          this.isEditing = false; 
          this.selectedStock = null; 
        },
        (error: any) => {
          console.error('Error al actualizar el stock:', error);
        }
      );
    }
  }

  public nextStockPage(): void {
    if (this.currentStockPage < this.totalStockPages) {
      this.currentStockPage++;
      this.updateStockList();
    }
  }

  public previousStockPage(): void {
    if (this.currentStockPage > 1) {
      this.currentStockPage--;
      this.updateStockList();
    }
  }

  // Nueva función para registrar un movimiento de stock
  public registerMovement(): void {
    const { fecha, productoId, talla, cantidad, movimiento } = this.newMovement;

    // Crear una nueva entrada de stock asegurando incluir todas las propiedades necesarias
    const newStockEntry: Stock = {
      id: 0, // O asignar el ID que tu API maneje
      fecha,
      productoId,
      talla,
      cantidad,
      movimiento,
      createdAt: new Date().toISOString(), // Convertir a string
      updatedAt: new Date().toISOString()  // Convertir a string
    };

    // Llamada a la API para registrar el nuevo movimiento
    this.http.post<Stock>(this.apiUrlStock, newStockEntry).subscribe(
      response => {
        this.loadStock(); // Recargar el stock para reflejar los cambios
        this.resetNewMovement(); // Reiniciar el formulario de movimiento
        this.showMovementForm = false; // Ocultar el formulario después de registrar
      },
      error => {
        console.error('Error al registrar el movimiento:', error);
      }
    );
  }

  // Método para reiniciar el formulario de nuevo movimiento
  private resetNewMovement(): void {
    this.newMovement = {
      fecha: '',
      productoId: 0, // Reiniciado a 0 para que sea un número
      talla: '',
      cantidad: 0,
      movimiento: 'compra'
    };
  }

  // Método para cancelar el registro de movimiento y ocultar el formulario
  public resetMovementForm(): void {
    this.resetNewMovement();
    this.showMovementForm = false; // Ocultar el formulario
  }

  // Método para filtrar el stock
  public filteredStock(): Stock[] {
    return this.stockItems.filter(item => {
      switch (this.selectedFilter) {
        case 'id':
          return item.productoId.toString().includes(this.searchTerm);
        case 'fecha':
          return new Date(item.fecha).toLocaleDateString().includes(this.searchTerm); // Asegúrate de que el formato coincide
        case 'talla':
          return item.talla.toLowerCase().includes(this.searchTerm.toLowerCase());
        case 'cantidad':
          return item.cantidad.toString().includes(this.searchTerm);
        case 'movimiento':
          return item.movimiento.toLowerCase().includes(this.searchTerm.toLowerCase());
        default:
          return true;
      }
    });
  }

  public applyFilter(): void {
    this.updateStockList(); // Actualiza la lista mostrada al aplicar el filtro
  }
}
