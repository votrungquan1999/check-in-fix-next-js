import axios, { AxiosError } from 'axios';

export interface Customer {
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  id: string;
  subscriber_id: string;
}

export interface GetCustomers {
  data: Customer[];
}

export async function getCustomers(phoneNumber: string, subscriberID: string, token: string): Promise<Customer[]> {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<GetCustomers>(
      `${baseBEURL}/private/subscribers/${subscriberID}/customers/${phoneNumber}`,
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
    alert(`get customsers info error, please contact tech support for help`);
  }

  return [];
}
