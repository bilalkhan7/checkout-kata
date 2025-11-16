import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eur',
  standalone: true,
})
export class EurCurrencyPipe implements PipeTransform {
  private readonly formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });

  transform(value: number | null | undefined): string {
    if (value == null) {
      return this.formatter.format(0);
    }

    return this.formatter.format(value);
  }
}
