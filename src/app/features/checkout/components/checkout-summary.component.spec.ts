import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutSummaryComponent } from './checkout-summary.component';
import { CartService } from '../../cart/cart.service';
import { PricingService } from '../../../shared/services/pricing.service';
import { PricingTable } from '../../../shared/models/pricing.model';
import { CartRow } from '../../../shared/models/cart-row.model';

class CartServiceStub {
  items: string[] = [];

  totalsSignal = () => ({
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  totals() {
    return this.totalsSignal();
  }

  scan(sku: string) {
    this.items.push(sku);
  }

  decrementItem(sku: string) {
    const idx = this.items.indexOf(sku);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  removeItem(sku: string) {
    this.items = this.items.filter((i: string) => i !== sku);
  }

  clear() {
    this.items = [];
  }
}

class PricingServiceStub {
  currentTable: PricingTable = {
    Apple: {
      sku: 'Apple',
      name: 'Apple',
      unitPrice: 30,
    },
    Banana: {
      sku: 'Banana',
      name: 'Banana',
      unitPrice: 50,
    },
  };
}

describe('CheckoutSummaryComponent', () => {
  let component: CheckoutSummaryComponent;
  let fixture: ComponentFixture<CheckoutSummaryComponent>;
  let service: CartServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutSummaryComponent],
      providers: [
        { provide: CartService, useClass: CartServiceStub },
        { provide: PricingService, useClass: PricingServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutSummaryComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(
      CartService
    ) as unknown as CartServiceStub;
    fixture.detectChanges();
  });

  it('should return itemCount based on service items', () => {
    service.items = ['Apple', 'Banana', 'Apple'];
    fixture.detectChanges();

    expect(component.itemCount).toBe(3);
  });

  it('should group rows by SKU', () => {
    service.items = ['Apple', 'Banana', 'Apple'];
    fixture.detectChanges();

    const rows: CartRow[] = component.rows;

    const appleRow = rows.find((r) => r.sku === 'Apple');
    const bananaRow = rows.find((r) => r.sku === 'Banana');

    expect(appleRow?.quantity).toBe(2);
    expect(bananaRow?.quantity).toBe(1);
  });

  it('should call service.scan on increment', () => {
    spyOn(service, 'scan').and.callThrough();

    component.increment('Apple');

    expect(service.scan).toHaveBeenCalledWith('Apple');
  });

  it('should call service.decrementItem on decrement', () => {
    spyOn(service, 'decrementItem').and.callThrough();

    component.decrement('Apple');

    expect(service.decrementItem).toHaveBeenCalledWith('Apple');
  });

  it('should call service.removeItem on remove', () => {
    spyOn(service, 'removeItem').and.callThrough();

    component.remove('Apple');

    expect(service.removeItem).toHaveBeenCalledWith('Apple');
  });

  it('should call service.clear on clear', () => {
    spyOn(service, 'clear').and.callThrough();

    component.clear();

    expect(service.clear).toHaveBeenCalled();
  });
});
