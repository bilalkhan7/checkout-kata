import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { CheckoutSummaryComponent } from './components/checkout-summary.component';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CheckoutSummaryComponent, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  paymentSuccess = false;

  private readonly hasItemsSignal = computed(
    () => this.cartService.items.length > 0
  );

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router
  ) {}

  get hasItems(): boolean {
    return this.hasItemsSignal();
  }

  proceedToPayment(): void {
    if (!this.hasItems) {
      return;
    }

    this.paymentSuccess = true;
    this.cartService.clear();

    setTimeout(() => {
      this.paymentSuccess = false;
      this.router.navigate(['/products']);
    }, 2500);
  }
}
