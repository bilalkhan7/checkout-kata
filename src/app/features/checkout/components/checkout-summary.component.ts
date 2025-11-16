import { Component, computed } from '@angular/core';
import {
  PricingRule,
  PricingTable,
} from '../../../shared/models/pricing.model';
import { isOfferActiveNow } from '../../../shared/utils/offer-date.utils';
import { CartService } from '../../cart/cart.service';
import { PricingService } from '../../../shared/services/pricing.service';
import { CartRow } from '../../../shared/models/cart-row.model';
import { EurCurrencyPipe } from '../../../shared/pipes/eur-currency-.pipe';

type Totals = {
  subtotal: number;
  discount: number;
  total: number;
};

@Component({
  selector: 'app-checkout-summary',
  standalone: true,
  templateUrl: './checkout-summary.component.html',
  styleUrls: ['./checkout-summary.component.scss'],
  imports: [EurCurrencyPipe],
})
export class CheckoutSummaryComponent {
  private readonly rowsSignal = computed<CartRow[]>(() => {
    const items = this.cartService.items;
    if (!items.length) return [];

    const table: PricingTable = this.pricingService.currentTable;

    const counts = items.reduce<Record<string, number>>((acc, sku) => {
      acc[sku] = (acc[sku] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([sku, qty]) => {
      const rule: PricingRule | undefined = table[sku];

      if (!rule) {
        return {
          sku,
          name: sku,
          quantity: qty,
          unitPrice: 0,
          lineTotal: 0,
          offerApplied: false,
        };
      }

      const unitPrice = rule.unitPrice;
      const noOfferTotal = unitPrice * qty;

      let lineTotal = noOfferTotal;
      let offerApplied = false;

      if (rule.offer && isOfferActiveNow(rule.offer)) {
        const { quantity: q, price } = rule.offer;
        const bundles = Math.floor(qty / q);
        const remainder = qty % q;
        lineTotal = bundles * price + remainder * unitPrice;
        offerApplied = lineTotal !== noOfferTotal;
      }

      return {
        sku,
        name: rule.name,
        quantity: qty,
        unitPrice,
        lineTotal,
        offerApplied,
      };
    });
  });

  private readonly totalsSignal = computed<Totals>(() => {
    const rows = this.rowsSignal();
    if (!rows.length) return { subtotal: 0, discount: 0, total: 0 };

    const subtotal = rows.reduce(
      (sum, r) => sum + r.unitPrice * r.quantity,
      0
    );
    const total = rows.reduce((sum, r) => sum + r.lineTotal, 0);

    return {
      subtotal,
      discount: Math.max(0, subtotal - total),
      total,
    };
  });

  constructor(
    private readonly cartService: CartService,
    private readonly pricingService: PricingService
  ) {}

  get rows(): CartRow[] {
    return this.rowsSignal();
  }

  get totals(): Totals {
    return this.totalsSignal();
  }

  get itemCount() {
    return this.cartService.items.length;
  }

  increment(sku: string) {
    this.cartService.scan(sku);
  }

  decrement(sku: string) {
    this.cartService.decrementItem(sku);
  }

  remove(sku: string) {
    this.cartService.removeItem(sku);
  }

  clear() {
    this.cartService.clear();
  }
}
