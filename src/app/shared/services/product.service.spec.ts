import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { DEFAULT_PRICING_TABLE } from '../models/pricing.model';

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should load products from API and maps them', (done) => {
    service.loadProducts().subscribe((products) => {
      expect(service.loading).toBeFalse();
      expect(service.error).toBeFalse();

      expect(products.length).toBe(1);
      expect(products[0]).toEqual({
        sku: 'Apple',
        name: 'Apple',
        unitPrice: 30,
      });

      done();
    });

    const req = http.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');

    req.flush([{ id: '1', sku: 'Apple', name: 'Apple', unitPrice: 30 }]);
  });

  it('should fall back to DEFAULT_PRICING_TABLE on error', (done) => {
    service.loadProducts().subscribe((products) => {
      expect(service.loading).toBeFalse();
      expect(service.error).toBeTrue();

      const expectedSkus = Object.keys(DEFAULT_PRICING_TABLE).sort();
      expect(products.map((p) => p.sku).sort()).toEqual(expectedSkus);

      done();
    });

    const req = http.expectOne(service['apiUrl']);
    req.flush('fail', { status: 500, statusText: 'Server Error' });
  });
});
