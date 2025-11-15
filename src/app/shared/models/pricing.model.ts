export interface Offer {
  quantity: number;
  price: number;
  validFrom?: string;
  validTo?: string;
}

export interface PricingRule {
  sku: string;
  name: string;
  unitPrice: number;
  offer?: Offer;
}

export type PricingTable = Record<string, PricingRule>;

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  total: number;
}

export const DEFAULT_PRICING_TABLE: PricingTable = {
  Apple: {
    sku: 'Apple',
    name: 'Apple',
    unitPrice: 30,
    offer: {
      quantity: 2,
      price: 45,
      validFrom: '2025-11-10',
      validTo: '2025-11-16',
    },
  },
  Banana: {
    sku: 'Banana',
    name: 'Banana',
    unitPrice: 50,
    offer: {
      quantity: 3,
      price: 130,
      validFrom: '2025-11-17',
      validTo: '2025-11-23',
    },
  },
  Peach: {
    sku: 'Peach',
    name: 'Peach',
    unitPrice: 20,
  },
  Kiwi: {
    sku: 'Kiwi',
    name: 'Kiwi',
    unitPrice: 18,
  },
  Mango: {
    sku: 'Mango',
    name: 'Mango',
    unitPrice: 10,
    offer: {
      quantity: 4,
      price: 30,
      validFrom: '2025-11-17',
      validTo: '2025-11-23',
    },
  },
  Orange: {
    sku: 'Orange',
    name: 'Orange',
    unitPrice: 5,
  },
  Melon: {
    sku: 'Melon',
    name: 'Melon',
    unitPrice: 7,
  },
  Grapes: {
    sku: 'Grapes',
    name: 'Grapes',
    unitPrice: 8,
    offer: {
      quantity: 5,
      price: 35,
      validFrom: '2025-11-24',
      validTo: '2025-11-30'
    },
  },
  Watermelon: {
    sku: 'Watermelon',
    name: 'Watermelon',
    unitPrice: 60,
  },
  Pomegranate: {
    sku: 'Pomegranate',
    name: 'Pomegranate',
    unitPrice: 30,
    offer: {
      quantity: 3,
      price: 80,
      validFrom: '2025-11-03',
      validTo: '2025-11-09',
    },
  },
  Pineapple: {
    sku: 'Pineapple',
    name: 'Pineapple',
    unitPrice: 25,
  },
  Strawberry: {
    sku: 'Strawberry',
    name: 'Strawberry',
    unitPrice: 6,
    offer: {
      quantity: 4,
      price: 20,
      validFrom: '2025-11-03',
      validTo: '2025-11-09'
    },
  },
};
