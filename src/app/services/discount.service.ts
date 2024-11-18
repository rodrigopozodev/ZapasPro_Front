// discount.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private discountApplied: boolean = false;
  private discountRate: number = 0;

  // Establecer el estado del descuento
  setDiscountStatus(isApplied: boolean, rate: number): void {
    this.discountApplied = isApplied;
    this.discountRate = rate;
  }

  // Obtener el estado del descuento
  getDiscountStatus(): { applied: boolean, rate: number } {
    return { applied: this.discountApplied, rate: this.discountRate };
  }
}
