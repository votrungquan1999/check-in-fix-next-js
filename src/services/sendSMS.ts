import { CommonResponse } from './common';
import axios from 'axios';

export interface sendSMSToCustomerBody {
  customer_ids: string[];
  message: string;
}

export async function sendSMSToCustomers(customerIDs: string[], token: string, message: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  let reqURL = `${baseBEURL}/private/sms_sending`;

  const body: sendSMSToCustomerBody = {
    customer_ids: customerIDs,
    message: message,
  };

  try {
    const resp = await axios.post<CommonResponse<{}>>(reqURL, body, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 204) {
      alert(`send sms to customer error, due to ${resp.data.error?.message}`);
      return false;
    }

    return true;
  } catch (error) {
    console.log(error.message);
    alert(`send sms to customers error, please contact tech support for help`);
    return false;
  }
}
