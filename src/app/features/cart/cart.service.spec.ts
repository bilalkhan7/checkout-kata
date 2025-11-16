import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { DEFAULT_PRICING_TABLE } from '../../shared/models/pricing.model';
import { PricingService } from '../../shared/services/pricing.service';


class PricingServiceStub {
  get currentTable() {
    return DEFAULT_PRICING_TABLE;
  }
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: PricingService, useClass: PricingServiceStub },
      ],
    });

    service = TestBed.inject(CartService);
    service.clear();

    (service as any).clock = () => new Date('2025-11-15T12:00:00Z');
  });

  it('should add scanned items to the cart', () => {
    service.scan('Apple');
    service.scan('Banana');

    expect(service.items).toEqual(['Apple', 'Banana']);
  });

  it('should apply Apple 2 for 45€ offer correctly', () => {
    service.scan('Apple');
    service.scan('Apple');

    const totals = service.totals();

    expect(totals.subtotal).toBe(60);
    expect(totals.total).toBe(45);
    expect(totals.discount).toBe(15);
  });

  it('should apply Banana 3 for 130€ offer correctly', () => {
    service.scan('Banana');
    service.scan('Banana');
    service.scan('Banana');

    const totals = service.totals();

    expect(totals.subtotal).toBe(150);
    expect(totals.total).toBe(130);
    expect(totals.discount).toBe(20);
  });

  it('should handle a mix of offers and non-offer items', () => {
    service.scan('Apple');
    service.scan('Apple');
    service.scan('Kiwi');

    const totals = service.totals();

    expect(totals.subtotal).toBe(78);
    expect(totals.total).toBe(63);
    expect(totals.discount).toBe(15);
  });

  it('should decrement a single item instance', () => {
    service.scan('Apple');
    service.scan('Apple');
    service.scan('Apple');

    service.decrementItem('Apple');

    expect(service.items.filter((i) => i === 'Apple').length).toBe(2);
  });

  it('should remove all items for a SKU', () => {
    service.scan('Apple');
    service.scan('Apple');
    service.scan('Banana');

    service.removeItem('Apple');

    expect(service.items).toEqual(['Banana']);
  });

  it('should clear the cart', () => {
    service.scan('Apple');
    service.scan('Banana');

    service.clear();

    expect(service.items.length).toBe(0);

    const totals = service.totals();
    expect(totals.subtotal).toBe(0);
    expect(totals.total).toBe(0);
    expect(totals.discount).toBe(0);
  });
});
