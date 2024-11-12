import { Component, OnInit } from '@angular/core';
import { PurchaseService, Receipt } from '../../../services/purchase.service';  // Asegúrate de importar la interfaz Receipt
import { CartItem } from '../../../interfaces/cart.interface';  // Importar la interfaz CartItem
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RecibosComponent implements OnInit {
  purchasedReceipts: Receipt[] = [];  // Array para almacenar los recibos

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    // Llamar a la función que carga los recibos desde el localStorage o el servicio
    this.purchaseService.loadReceiptsFromLocalStorage();
    this.purchasedReceipts = this.purchaseService.getPurchasedReceipts();  // Obtener los recibos
  }

  calculateReceiptTotal(receipt: Receipt): number {
    // Ahora 'price' es un número, así que no necesitamos parseFloat
    return receipt.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
