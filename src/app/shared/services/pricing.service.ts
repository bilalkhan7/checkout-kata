import { Injectable, signal } from '@angular/core';
import { Observable, combineLatest, map, tap, shareReplay } from 'rxjs';

import {
  PricingRule,
  PricingTable,
  DEFAULT_PRICING_TABLE,
} from '../models/pricing.model';
import { ProductService, ProductDto } from './product.service';
import { OfferService, OfferDto } from './offer.service';

@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly pricingTableSignal = signal<PricingTable>(
    DEFAULT_PRICING_TABLE
  );

  get currentTable(): PricingTable {
    return this.pricingTableSignal();
  }

  constructor(
    private readonly productService: ProductService,
    private readonly offerService: OfferService
  ) {}

  loadPricing(): Observable<PricingRule[]> {
    return combineLatest([
      this.productService.loadProducts(),
      this.offerService.loadOffers(),
    ]).pipe(
      map(([products, offers]) => this.buildPricingTable(products, offers)),
      tap((table) => this.pricingTableSignal.set(table)),
      map((table) => Object.values(table)),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private buildPricingTable(
    products: ProductDto[],
    offers: OfferDto[]
  ): PricingTable {
    const offerMap = new Map<string, OfferDto>(
      offers.map((o) => [o.sku, o])
    );

    const table: PricingTable = {};

    for (const p of products) {
      const match = offerMap.get(p.sku);

      table[p.sku] = {
        sku: p.sku,
        name: p.name,
        unitPrice: p.unitPrice,
        offer: match
          ? {
              quantity: match.quantity,
              price: match.price,
              validFrom: match.validFrom,
              validTo: match.validTo,
            }
          : undefined,
      };
    }

    return table;
  }
}
