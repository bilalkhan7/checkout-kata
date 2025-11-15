export interface CartRow {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  offerApplied: boolean;
}
