import { Component, OnInit } from '@angular/core';
import { PurchaseService, Receipt } from '../../../services/purchase.service';  // Asegúrate de importar la interfaz Receipt
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service'; // Servicio para obtener el usuario actual

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.css'
})
export class PurchaseHistoryComponent {
  purchasedReceipts: Receipt[] = [];  // Array para almacenar los recibos

  constructor(
    private purchaseService: PurchaseService,
    private userService: UserService  // Inyectar el servicio UserService para obtener el usuario actual
  ) {}

  ngOnInit(): void {
    // Cargar recibos del usuario actual desde localStorage
    const currentUser = this.userService.getStoredUser();
    const userId = currentUser ? currentUser.username : '';

    if (userId) {
      // Llamar a la función que carga los recibos específicos del usuario actual
      this.purchaseService.loadAllReceiptsFromLocalStorage();
      this.purchasedReceipts = this.purchaseService.getPurchasedReceipts(userId);  // Obtener los recibos del usuario actual
    }
  }

  calculateReceiptTotal(receipt: Receipt): number {
    // Ahora 'price' es un número, así que no necesitamos parseFloat
    return receipt.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
