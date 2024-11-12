import { Injectable } from '@angular/core';
import { CartItem } from '../interfaces/cart.interface';

export interface Receipt {
  userId: string;
  date: string;
  time: string;
  products: CartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private purchasedReceipts: Receipt[] = [];

  constructor() {}

  // Establecer un nuevo recibo
  setPurchasedReceipt(userId: string, products: CartItem[], totalAmount: number): void {
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(); // Fecha en formato local
    const time = currentDate.toLocaleTimeString(); // Hora en formato local

    const newReceipt: Receipt = {
      userId,
      date,
      time,
      products,
      totalAmount,
    };

    // Guardar el recibo
    this.purchasedReceipts.push(newReceipt);
    this.saveReceiptsToLocalStorage(); // Guardar en localStorage para persistencia
  }

  // Obtener todos los recibos
  getPurchasedReceipts(): Receipt[] {
    return this.purchasedReceipts;
  }

  // Guardar los recibos en localStorage para persistencia entre sesiones
  private saveReceiptsToLocalStorage(): void {
    localStorage.setItem('purchasedReceipts', JSON.stringify(this.purchasedReceipts));
  }

  // Cargar los recibos desde localStorage
  loadReceiptsFromLocalStorage(): void {
    const storedReceipts = localStorage.getItem('purchasedReceipts');
    if (storedReceipts) {
      this.purchasedReceipts = JSON.parse(storedReceipts);
    }
  }
}
