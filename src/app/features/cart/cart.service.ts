import { Injectable, signal, computed } from '@angular/core';
import { PricingService } from '../../shared/services/pricing.service';
import {
  CheckoutTotals,
  Offer,
  PricingTable,
} from '../../shared/models/pricing.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<string[]>([]);

  readonly itemsSignal = this._items.asReadonly();

  get items(): string[] {
    return this._items();
  }

  constructor(private readonly pricingService: PricingService) {}

  scan(sku: string): void {
    this._items.update((items) => [...items, sku]);
  }

  decrementItem(sku: string): void {
    this._items.update((items) => {
      const idx = items.indexOf(sku);
      if (idx === -1) return items;
      const copy = [...items];
      copy.splice(idx, 1);
      return copy;
    });
  }

  removeItem(sku: string): void {
    this._items.update((items) => items.filter((i) => i !== sku));
  }

  clear(): void {
    this._items.set([]);
  }

  private isOfferActive(offer: Offer | undefined): boolean {
    return !!offer;
  }

  readonly totalsSignal = computed<CheckoutTotals>(() => {
    const table: PricingTable = this.pricingService.currentTable;
    const items = this._items();

    if (!items.length) {
      return { subtotal: 0, discount: 0, total: 0 };
    }

    const counts = items.reduce<Record<string, number>>((acc, sku) => {
      acc[sku] = (acc[sku] ?? 0) + 1;
      return acc;
    }, {});

    let subtotal = 0;
    let total = 0;

    for (const [sku, count] of Object.entries(counts)) {
      const quantity = count as number;
      const rule = table[sku];
      if (!rule) continue;

      const unit = rule.unitPrice;
      const noOfferTotal = unit * quantity;
      subtotal += noOfferTotal;

      let lineTotal = noOfferTotal;

      if (this.isOfferActive(rule.offer) && rule.offer) {
        const { quantity: offerQty, price } = rule.offer;
        const bundles = Math.floor(quantity / offerQty);
        const remainder = quantity % offerQty;

        lineTotal = bundles * price + remainder * unit;
      }

      total += lineTotal;
    }

    const discount = subtotal - total;
    return { subtotal, discount, total };
  });

  totals(): CheckoutTotals {
    return this.totalsSignal();
  }
}
