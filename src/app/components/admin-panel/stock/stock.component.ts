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
  stockItems: Stock[] = []; // Inicializar como array
  paginatedStock: Stock[] = [];
  totalStockPages: number = 1; 
  currentStockPage: number = 1; 
  selectedStock: Stock | null = null; 
  isEditing = false; 
  itemsPerPage: number = 20; 

  constructor(private http: HttpClient, private router: Router) {
    this.loadStock();
  }

  public loadStock(): void {
    this.getStock(this.currentStockPage).subscribe(
      (response: { success: boolean; stocks: Stock[] }) => {
        if (response.success) {
          this.stockItems = response.stocks; // Extraer el array de stocks
          this.calculateTotalStockPages();
          this.updateStockList();
          this.showStock = true; 
        } else {
          console.error('Error: La respuesta no fue exitosa.', response);
        }
      },
      (error: any) => {
        console.error('Error en la solicitud de stock:', error);
      }
    );
  }
  
  public getStock(page: number): Observable<{ success: boolean; stocks: Stock[] }> {
    return this.http.get<{ success: boolean; stocks: Stock[] }>(`${this.apiUrlStock}?_page=${page}&_limit=${this.itemsPerPage}`);
  }

  calculateTotalStockPages(): void {
    this.http.get<{ success: boolean; stocks: Stock[] }>(this.apiUrlStock).subscribe((response) => {
      if (response.success) {
        const totalItems = response.stocks.length; // Asegúrate de que sea un número
        this.totalStockPages = Math.ceil(totalItems / this.itemsPerPage);
      }
    });
  }

  private updateStockList() {
    if (Array.isArray(this.stockItems)) {
      const startIndex = (this.currentStockPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedStock = this.stockItems.slice(startIndex, endIndex);
    } else {
      console.error('stockItems no es un array:', this.stockItems);
      this.paginatedStock = []; // Restablecer paginatedStock si hay un error
    }
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
    this.updateStockList(); // Actualiza la lista después de eliminar
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
}
