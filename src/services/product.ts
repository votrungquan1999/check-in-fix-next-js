import axios from 'axios';
import { CommonResponse } from './common';

export interface Product {
  id: string;
  subscriber_id: string;
  product_type?: string;
  product_name?: string;
  product_code?: string;
  alert_quantity?: number;
  quantity?: number;
  product_tax?: string;
  tax_method?: string;
  product_unit?: number;
  product_cost?: number;
  product_price?: number;
  product_detail?: string;
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Omit<Product, 'id' | 'subscriber_id'>;

export async function createProduct(payload: CreateProductInput, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.post<CommonResponse<Product>>(`${baseBEURL}/private/products`, payload, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return;
  }
}

export async function getProductsBySubscriberID(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.get<CommonResponse<Product[]>>(
      `${baseBEURL}/private/products?subscriber_id=${subscriberID}`,
      {
        headers: {
          authorization: token,
        },
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    if (resp.status !== 200 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return [];
  }
}

export async function getProductDetail(productID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.get<CommonResponse<Product>>(`${baseBEURL}/private/products/${productID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return;
  }
}

export async function updateProduct(productID: string, payload: UpdateProductInput, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.patch<CommonResponse<Product>>(`${baseBEURL}/private/products/${productID}`, payload, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return;
  }
}

export async function deleteProduct(productID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.delete<CommonResponse<{}>>(`${baseBEURL}/private/products/${productID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 204 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return false;
  }
}
