import axios, { AxiosError } from 'axios';
import { CommonError, CommonResponse } from './common';

export interface Customer {
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  subscriber_id: string;
}

export async function getCustomersByPhoneNumber(
  phoneNumber: string,
  subscriberID: string,
  token: string,
): Promise<Customer[]> {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Customer[]>>(
      `${baseBEURL}/private/subscribers/${subscriberID}/customer/${phoneNumber}`,
      {
        headers: {
          authorization: token,
        },
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get customers error, please contact tech support for help`);
  }

  return [];
}

export async function getCustomers(subscriberID: string, token: string, phoneNumber?: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let reqURL = `${baseBEURL}/private/subscribers/${subscriberID}/customer`;

  if (phoneNumber) {
    reqURL += `?phone_number=${phoneNumber}`;
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
  }
}

export interface CreateCustomerInput {
  phone_number: string;
  first_name: string;
  last_name: string;
  email: string;
}

export async function createCustomer(
  input: CreateCustomerInput,
  subscriberID: string,
  token: string,
): Promise<Customer> {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const resp = await axios.post<CommonResponse<Customer>>(
    `${baseBEURL}/private/subscribers/${subscriberID}/customer`,
    input,
    {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    },
  );

  if (resp.data.error) {
    throw Error(resp.data.error.message);
  }

  return resp.data.data;
}
