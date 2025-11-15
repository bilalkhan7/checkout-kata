import { Offer } from '../models/pricing.model';

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function toLocalTimestamp(
  dateStr: string | undefined,
  endOfDay: boolean
): number {
  if (!dateStr) {
    return endOfDay ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  if (DATE_ONLY_REGEX.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return endOfDay
      ? new Date(y, m - 1, d, 23, 59, 59, 999).getTime()
      : new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
  }

  const ts = new Date(dateStr).getTime();
  return Number.isNaN(ts)
    ? endOfDay
      ? Number.POSITIVE_INFINITY
      : Number.NEGATIVE_INFINITY
    : ts;
}

export function isOfferActiveNow(
  offer: Offer | undefined,
  now: number = Date.now()
): boolean {
  if (!offer) return false;

  const from = toLocalTimestamp(offer.validFrom, false);
  const to = toLocalTimestamp(offer.validTo, true);

  return now >= from && now <= to;
}

export function isOfferExpiredNow(
  offer: Offer | undefined,
  now: number = Date.now()
): boolean {
  if (!offer || !offer.validTo) return false;

  const to = toLocalTimestamp(offer.validTo, true);
  return now > to;
}
