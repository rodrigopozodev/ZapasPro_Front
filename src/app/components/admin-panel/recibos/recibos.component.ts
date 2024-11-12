import { Component, OnInit } from '@angular/core';
import { PurchaseService, Receipt } from '../../../services/purchase.service';
import { CartItem } from '../../../interfaces/cart.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RecibosComponent implements OnInit {
  purchasedReceipts: Receipt[] = [];
  showAllUsersReceipts: boolean = false; // Indica si se están viendo recibos de todos los usuarios

  constructor(
    private purchaseService: PurchaseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllReceipts();
  }

  loadAllReceipts(): void {
    this.purchaseService.loadAllReceiptsFromLocalStorage();
    this.purchasedReceipts = this.purchaseService.getAllPurchasedReceipts();
    this.showAllUsersReceipts = true; // Indicador de que estamos viendo todos los recibos
  }

  calculateReceiptTotal(receipt: Receipt): number {
    return receipt.products.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }
}
