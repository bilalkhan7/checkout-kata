import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  map,
  of,
  tap,
  Observable,
  shareReplay,
} from 'rxjs';
import { DEFAULT_PRICING_TABLE } from '../models/pricing.model';

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
}

export interface ProductDto {
  sku: string;
  name: string;
  unitPrice: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl =
    'https://6919ee389ccba073ee945e7e.mockapi.io/api/products';

  loading = false;
  error = false;

  private products$?: Observable<ProductDto[]>;

  constructor(private readonly http: HttpClient) {}

  loadProducts(): Observable<ProductDto[]> {
    if (!this.products$) {
      this.loading = true;
      this.error = false;

      this.products$ = this.http.get<ApiProduct[]>(this.apiUrl).pipe(
        map((raw) =>
          raw.map((p) => ({
            sku: p.sku,
            name: p.name,
            unitPrice: p.unitPrice,
          }))
        ),
        tap(() => {
          this.loading = false;
        }),
        catchError((err) => {
          console.warn(
            '[ProductService] API failed, falling back to DEFAULT_PRICING_TABLE',
            err
          );
          this.loading = false;
          this.error = true;

          const fallback: ProductDto[] = Object.values(
            DEFAULT_PRICING_TABLE
          ).map((rule) => ({
            sku: rule.sku,
            name: rule.name,
            unitPrice: rule.unitPrice,
          }));

          return of(fallback);
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this.products$;
  }
}
