import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CartService } from '../cart/cart.service';
import { PricingRule } from '../../shared/models/pricing.model';
import { PricingService } from '../../shared/services/pricing.service';
import { ProductService } from '../../shared/services/product.service';

import {
  isOfferActiveNow,
  isOfferExpiredNow,
} from '../../shared/utils/offer-date.utils';
import { EurCurrencyPipe } from '../../shared/pipes/eur-currency-.pipe';

type SortMode = 'all' | 'with-offer' | 'without-offer';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [CommonModule, RouterModule, DatePipe, EurCurrencyPipe],
})
export class ProductsComponent implements OnInit {
  private readonly allProducts = signal<PricingRule[]>([]);
  readonly sortMode = signal<SortMode>('all');
  readonly currentPage = signal(1);
  readonly pageSize = 6;

  readonly selectedQuantities = signal<Record<string, number>>({});
  readonly lastAddedSku = signal<string | null>(null);

  readonly quantityOptions = [1, 2, 3, 4, 5, 10];

  readonly totalProducts = computed(() => this.allProducts().length);

  private readonly filteredProducts = computed<PricingRule[]>(() => {
    const products = this.allProducts();
    const mode = this.sortMode();

    if (mode === 'with-offer') {
      return products.filter((p) => p.offer && !isOfferExpiredNow(p.offer));
    }

    if (mode === 'without-offer') {
      return products.filter((p) => !p.offer || isOfferExpiredNow(p.offer));
    }

    return products;
  });

  readonly totalPages = computed(() => {
    const length = this.filteredProducts().length;
    return Math.max(1, Math.ceil(length / this.pageSize));
  });

  readonly visibleProducts = computed<PricingRule[]>(() => {
    const products = this.filteredProducts();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return products.slice(start, start + this.pageSize);
  });

  readonly cartCount = computed(() => this.cartService.items.length);

  constructor(
    private readonly pricingService: PricingService,
    public readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.pricingService.loadPricing().subscribe((rules) => {
      this.allProducts.set(rules);

      const initial: Record<string, number> = {};
      for (const p of rules) {
        initial[p.sku] = 1;
      }
      this.selectedQuantities.set(initial);
    });
  }

  setSortMode(mode: SortMode) {
    this.sortMode.set(mode);
    this.currentPage.set(1);
  }

  changePage(step: number) {
    this.currentPage.update((page) => page + step);
  }

  getQuantity(sku: string): number {
    return this.selectedQuantities()[sku] ?? 1;
  }

  onQuantityChange(sku: string, value: number | string) {
    const qty = Number(value);

    this.selectedQuantities.update((prev) => ({
      ...prev,
      [sku]: qty,
    }));
  }

  add(sku: string) {
    const qty = this.getQuantity(sku);
    for (let i = 0; i < qty; i++) {
      this.cartService.scan(sku);
    }

    this.lastAddedSku.set(sku);
    setTimeout(() => this.lastAddedSku.set(null), 1100);
  }

  isOfferActive(p: PricingRule): boolean {
    return isOfferActiveNow(p.offer);
  }

  isOfferExpired(p: PricingRule): boolean {
    return isOfferExpiredNow(p.offer);
  }
}
