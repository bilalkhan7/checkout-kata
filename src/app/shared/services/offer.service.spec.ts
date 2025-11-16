import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { OfferService } from './offer.service';
import { DEFAULT_PRICING_TABLE } from '../models/pricing.model';

describe('OfferService', () => {
  let service: OfferService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(OfferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should load offers from API and map them', (done) => {
    service.loadOffers().subscribe((offers) => {
      expect(service.loading).toBeFalse();
      expect(service.error).toBeFalse();

      expect(offers.length).toBe(1);
      expect(offers[0]).toEqual({
        sku: 'Apple',
        quantity: 2,
        price: 45,
        validFrom: '2025-11-10',
        validTo: '2025-11-20',
      });

      done();
    });

    const req = http.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: '1',
        sku: 'Apple',
        quantity: 2,
        price: 45,
        validFrom: '2025-11-10',
        validTo: '2025-11-20',
      },
    ]);
  });

  it('should fall back to DEFAULT_PRICING_TABLE on error', (done) => {
    service.loadOffers().subscribe((offers) => {
      expect(service.loading).toBeFalse();
      expect(service.error).toBeTrue();

      const expectedSkus = Object.values(DEFAULT_PRICING_TABLE)
        .filter((r) => r.offer)
        .map((r) => r.sku)
        .sort();

      expect(offers.map((o) => o.sku).sort()).toEqual(expectedSkus);

      done();
    });

    const req = http.expectOne(service['apiUrl']);
    req.flush('fail', { status: 500, statusText: 'Server Error' });
  });
});
