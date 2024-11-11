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
  itemsPerPage: number = 10; 
  searchTerm: string = '';
  selectedFilter: string = 'todos'; // Filtro por defecto

  // Nueva propiedad para registrar un nuevo movimiento
  newMovement = {
    fecha: '',
    productoId: 0,
    talla: '',
    cantidad: 0,
    movimiento: 'compra'
  };

  // Nueva propiedad para mostrar u ocultar el formulario de movimiento
  showMovementForm = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loadStock();
  }

  public loadStock(): void {
    this.getStock(this.currentStockPage).subscribe(
      (response: Stock[]) => {
        this.stockItems = response; 
        this.calculateTotalStockPages(); // Calcular total de páginas
        this.updatePagination(); // Actualizar la paginación
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

  public calculateTotalStockPages(): void {
    this.http.get<Stock[]>(this.apiUrlStock).subscribe((response: Stock[]) => {
      const totalItems = response.length; 
      this.totalStockPages = Math.ceil(totalItems / this.itemsPerPage);
      this.updatePagination(); // Actualizar la paginación después de calcular total
    });
  }

  public updatePagination(): void {
    const filtered = this.filteredStock(); // Filtrar stock
    const startIndex = (this.currentStockPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStock = filtered.slice(startIndex, endIndex); // Actualizar paginación
    this.totalStockPages = Math.ceil(filtered.length / this.itemsPerPage); // Actualizar total de páginas
  }

  public filteredStock(): Stock[] {
    return this.stockItems.filter(item => {
      switch (this.selectedFilter) {
        case 'id':
          return item.productoId.toString().includes(this.searchTerm);
        case 'fecha':
          return new Date(item.fecha).toLocaleDateString().includes(this.searchTerm);
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
    if (this.selectedFilter !== 'todos') {
      this.currentStockPage = 1; // Resetear a la primera página al aplicar el filtro
    }
    this.updatePagination(); // Actualizar la paginación después de filtrar
  }
  

  public editStock(stock: Stock) {
    // Cerrar el formulario de movimiento si está abierto
    this.showMovementForm = false;

    // Abrir el formulario de edición
    this.selectedStock = { ...stock };
    this.isEditing = true; 
  }

  public cancelStock(): void {
    this.selectedStock = null; 
    this.isEditing = false; 
  }

  public deleteStock(stockId: number) {
    this.stockItems = this.stockItems.filter(stock => stock.id !== stockId);
    this.updatePagination(); 
  }

  public updateStock(stockId: number) {
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
      this.updatePagination(); // Actualizar la paginación al cambiar de página
    }
  }

  public previousStockPage(): void {
    if (this.currentStockPage > 1) {
      this.currentStockPage--;
      this.updatePagination(); // Actualizar la paginación al cambiar de página
    }
  }

  public registerMovement(): void {
    // Cerrar el formulario de edición si está abierto
    this.isEditing = false;

    const { fecha, productoId, talla, cantidad, movimiento } = this.newMovement;
    const newStockEntry: Stock = {
      id: 0,
      fecha,
      productoId,
      talla,
      cantidad,
      movimiento,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.http.post<Stock>(this.apiUrlStock, newStockEntry).subscribe(
      response => {
        this.loadStock(); 
        this.resetNewMovement(); 
        this.showMovementForm = false; 
      },
      error => {
        console.error('Error al registrar el movimiento:', error);
      }
    );
  }

  private resetNewMovement(): void {
    this.newMovement = {
      fecha: '',
      productoId: 0,
      talla: '',
      cantidad: 0,
      movimiento: 'compra'
    };
  }

  public resetMovementForm(): void {
    this.resetNewMovement();
    this.showMovementForm = false; 
  }
}
