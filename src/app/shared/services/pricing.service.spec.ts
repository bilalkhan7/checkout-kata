import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PricingService } from './pricing.service';
import { ProductService, ProductDto } from './product.service';
import { OfferService, OfferDto } from './offer.service';
import { PricingTable } from '../models/pricing.model';

class ProductServiceStub {
  loadProducts() {
    const products: ProductDto[] = [
      {
        sku: 'Apple',
        name: 'Apple',
        unitPrice: 30,
      },
      {
        sku: 'Kiwi',
        name: 'Kiwi',
        unitPrice: 18,
      },
    ];
    return of(products);
  }
}

class OfferServiceStub {
  loadOffers() {
    const offers: OfferDto[] = [
      {
        sku: 'Apple',
        quantity: 2,
        price: 45,
        validFrom: '2025-11-10',
        validTo: '2025-11-20',
      },
      {
        sku: 'Vegetable',
        quantity: 3,
        price: 99,
      },
    ];
    return of(offers);
  }
}

describe('PricingService', () => {
  let service: PricingService;
  let productService: ProductServiceStub;
  let offerService: OfferServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PricingService,
        { provide: ProductService, useClass: ProductServiceStub },
        { provide: OfferService, useClass: OfferServiceStub },
      ],
    });

    service = TestBed.inject(PricingService);
    productService = TestBed.inject(ProductService) as unknown as ProductServiceStub;
    offerService = TestBed.inject(OfferService) as unknown as OfferServiceStub;
  });

  it('loadPricing should merge products and offers and update the pricingTableSignal', (done) => {
    service.loadPricing().subscribe((rules) => {
      expect(rules.length).toBe(2);

      const apple = rules.find((r) => r.sku === 'Apple');
      const kiwi = rules.find((r) => r.sku === 'Kiwi');

      expect(apple).toBeTruthy();
      expect(kiwi).toBeTruthy();

      expect(apple!.offer).toEqual({
        quantity: 2,
        price: 45,
        validFrom: '2025-11-10',
        validTo: '2025-11-20',
      });

      expect(kiwi!.offer).toBeUndefined();

      const table: PricingTable = service.currentTable;
      expect(Object.keys(table).sort()).toEqual(['Apple', 'Kiwi']);

      expect(table['Apple'].unitPrice).toBe(30);
      expect(table['Kiwi'].unitPrice).toBe(18);

      done();
    });
  });

  it('should ignore offers for SKUs not present in products', (done) => {
    service.loadPricing().subscribe((rules) => {
      const skus = rules.map((r) => r.sku).sort();

      expect(skus).toEqual(['Apple', 'Kiwi']);

      const table = service.currentTable;
      expect(table['Vegetable']).toBeUndefined();

      done();
    });
  });
});
