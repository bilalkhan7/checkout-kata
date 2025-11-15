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

export interface ApiOffer {
  id: string;
  sku: string;
  quantity: number;
  price: number;
  validFrom?: string;
  validTo?: string;
}

export interface OfferDto {
  sku: string;
  quantity: number;
  price: number;
  validFrom?: string;
  validTo?: string;
}

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly apiUrl =
    'https://6919ee389ccba073ee945e7e.mockapi.io/api/offers';

  loading = false;
  error = false;

  private offers$?: Observable<OfferDto[]>;

  constructor(private readonly http: HttpClient) {}

  loadOffers(): Observable<OfferDto[]> {
    if (!this.offers$) {
      this.loading = true;
      this.error = false;

      this.offers$ = this.http.get<ApiOffer[]>(this.apiUrl).pipe(
        map((raw) =>
          raw.map((o) => ({
            sku: o.sku,
            quantity: o.quantity,
            price: o.price,
            validFrom: o.validFrom,
            validTo: o.validTo,
          }))
        ),
        tap(() => {
          this.loading = false;
        }),
        catchError((err) => {
          console.warn(
            '[OfferService] API call failed, falling back to DEFAULT_PRICING_TABLE offers',
            err
          );
          this.loading = false;
          this.error = true;

          const fallback: OfferDto[] = Object.values(DEFAULT_PRICING_TABLE)
            .filter((rule) => rule.offer)
            .map((rule) => ({
              sku: rule.sku,
              quantity: rule.offer!.quantity,
              price: rule.offer!.price,
              validFrom: rule.offer!.validFrom,
              validTo: rule.offer!.validTo,
            }));

          return of(fallback);
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }

    return this.offers$;
  }
}
