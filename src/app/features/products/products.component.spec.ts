import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { ProductsComponent } from './products.component';
import { CartService } from '../cart/cart.service';
import { PricingService } from '../../shared/services/pricing.service';
import { ProductService } from '../../shared/services/product.service';

class CartServiceStub {
  private readonly _items = signal<string[]>([]);

  readonly itemsSignal = this._items.asReadonly();

  get items(): string[] {
    return this._items();
  }

  scan(sku: string) {
    this._items.update(items => [...items, sku]);
  }

  clear() {
    this._items.set([]);
  }
}

class PricingServiceStub {
  loadPricing() {
    return of([
      { sku: 'Apple', name: 'Apple', unitPrice: 30 },
    ] as any);
  }
}

class ProductServiceStub {
  loading = false;
  error = false;
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let checkoutService: CartServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: CartService, useClass: CartServiceStub },
        { provide: PricingService, useClass: PricingServiceStub },
        { provide: ProductService, useClass: ProductServiceStub },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    checkoutService = TestBed.inject(
      CartService
    ) as unknown as CartServiceStub;

    fixture.detectChanges();
  });

  it('should show at least one product card', () => {
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(
      By.css('[data-testid="product-card"], .product-card')
    );

    expect(cards.length).toBeGreaterThan(0);
  });

  it('should add a product to cart when "Add to cart" is clicked', () => {
    spyOn(checkoutService, 'scan').and.callThrough();

    fixture.detectChanges();

    const addButton = fixture.debugElement.query(
      By.css('[data-testid="add-to-cart"], .product-card button')
    );

    addButton.triggerEventHandler('click', null);

    expect(checkoutService.scan).toHaveBeenCalled();
  });
});