import { callPrivateService } from './common';

export interface Purchases {
  id: string;
  subscriber_id: string;
  date?: string;
  reference_number?: string;
  supplier?: string;
  notes?: string;
  status: string;
  discount: number;
  instore_credit: number;
  shipping_fee: number;
  grand_total: number;
  total_discount: number;
  purchase_products: PurchaseProduct[];
}

export interface PurchaseProduct {
  unit_cost: number;
  quantity: number;
  discount: number;
  tax_type: string;
  tax_value: number;
  product_name?: string;
  product_id: string;
  product_code?: string;
  sub_total: number;
}

export interface CreatePurchaseInput {
  subscriber_id: string;
  date?: string;
  reference_number?: string;
  supplier?: string;
  notes?: string;
  status: string;
  discount: number;
  instore_credit: number;
  shipping_fee: number;
  purchase_products: PurchaseProduct[];
}

export async function createPurchase(input: CreatePurchaseInput, token: string) {
  const resp = await callPrivateService<Purchases>('/private/purchases', token, 'POST', input);

  if (!resp) {
    return;
  }

  if (resp.data.error) {
    alert(`create purchase failed due to ${resp.data.error.message}`);
    return;
  }

  return resp.data.data;
}

export async function getListPurchases(subscriberID: string, token: string) {
  const path = `/private/purchases?subscriber_id=${subscriberID}`;

  const resp = await callPrivateService<Purchases[]>(path, token, 'GET');

  if (!resp) {
    return;
  }

  if (resp.data.error) {
    alert(`get list purchase failed due to ${resp.data.error.message}`);
    return;
  }

  return resp.data.data;
}
