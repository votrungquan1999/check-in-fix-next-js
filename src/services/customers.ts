import axios from 'axios';
import { isUndefined } from 'lodash';
import { omitBy } from 'lodash/fp';
import { CommonResponse } from './common';

export interface Customer {
  id: string;
  phone_number: string;
  contact_phone_number?: string;
  first_name: string;
  last_name: string;
  email?: string;
  subscriber_id?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export async function searchCustomers(subscriberID: string, token: string, key: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let reqURL = `${baseBEURL}/private/customers?subscriber_id=${subscriberID}&filter=${key}`;

  try {
    const resp = await axios.get<CommonResponse<Customer[]>>(reqURL, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get customer error, due to ${resp.data.error?.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get customers error, please contact tech support for help`);
  }
}

export async function getCustomers(subscriberID: string, token: string, phoneNumber?: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let reqURL = `${baseBEURL}/private/customers?subscriber_id=${subscriberID}`;

  if (phoneNumber) {
    reqURL += `&phone_number=${phoneNumber}`;
  }

  try {
    const resp = await axios.get<CommonResponse<Customer[]>>(reqURL, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get customer error, due to ${resp.data.error?.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get customers error, please contact tech support for help`);
    return [];
  }
}

export async function getCustomersByIDs(token: string, customerIDs: string[]) {
  if (!customerIDs.length) {
    return [];
  }

  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let reqURL = `${baseBEURL}/private/customers`;

  const initialID = customerIDs.pop();
  reqURL += `?customer_id=${initialID}`;

  customerIDs.forEach((id) => {
    reqURL += `&customer_id=${id}`;
  });

  try {
    const resp = await axios.get<CommonResponse<Customer[]>>(reqURL, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get customer error, due to ${resp.data.error?.message}`);
      return [];
    }

    // console.log(resp.data);

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get customers error, please contact tech support for help`);
    return [];
  }
}

export interface CreateCustomerInput {
  phone_number: string;
  first_name: string;
  last_name: string;
  email?: string;
  subscriber_id: string;
  address_line_1: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

export async function createCustomer(
  input: CreateCustomerInput,
  // subscriberID: string,
  token: string,
) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // input.subscriber_id = subscriberID;

  try {
    const resp = await axios.post<CommonResponse<Customer>>(`${baseBEURL}/private/customers`, input, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 201) {
      alert(`update customer error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`update customers error, please contact tech support for help`);
    return;
  }
}

export async function updateCustomer(id: string, updateCustomerInput: Partial<Customer>, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const updateInput = omitBy(isUndefined)(updateCustomerInput);

  try {
    const resp = await axios.patch<CommonResponse<Customer>>(`${baseBEURL}/private/customers/${id}`, updateInput, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`update customer error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`update customers error, please contact tech support for help`);
    return;
  }
}

export async function deleteCustomersByIDs(IDs: string[], token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const deleteCustomersPayload = {
    customers: IDs.map((id) => ({ id })),
  };

  try {
    const resp = await axios.delete<CommonResponse<Customer>>(`${baseBEURL}/private/customers`, {
      data: deleteCustomersPayload,
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`delete customer error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert(`delete customers error, please contact tech support for help`);
    return;
  }
}

export async function getCustomerDetailByID(id: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const resp = await axios.get<CommonResponse<Customer>>(`${baseBEURL}/private/customers/${id}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get detail customer error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert(`get detail customer error, please contact tech support for help`);
    return;
  }
}
