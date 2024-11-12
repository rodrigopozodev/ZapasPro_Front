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

  constructor() {
    this.loadAllReceiptsFromLocalStorage();
  }

  setPurchasedReceipt(userId: string, products: CartItem[], totalAmount: number): void {
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();

    const newReceipt: Receipt = {
      userId,
      date,
      time,
      products,
      totalAmount,
    };

    this.purchasedReceipts.push(newReceipt);
    this.saveReceiptsToLocalStorage();
  }

  getPurchasedReceipts(userId: string): Receipt[] {
    return this.purchasedReceipts.filter(receipt => receipt.userId === userId);
  }

  getAllPurchasedReceipts(): Receipt[] {
    return this.purchasedReceipts; // Devuelve todos los recibos, sin filtrar por usuario
  }

  private saveReceiptsToLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('purchasedReceipts', JSON.stringify(this.purchasedReceipts));
    }
  }

  loadAllReceiptsFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedReceipts = localStorage.getItem('purchasedReceipts');
      if (storedReceipts) {
        this.purchasedReceipts = JSON.parse(storedReceipts);
      }
    }
  }
}
