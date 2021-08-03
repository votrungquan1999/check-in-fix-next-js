import axios from 'axios';
import { CommonResponse } from './common';

export interface Subscriber {
  id: string;
  email: string;
  name: string;
}

export async function getSubscriber(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Subscriber>>(`${baseBEURL}/private/subscribers/${subscriberID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`get subscriber failed due to ${resp.data.error.message}`);
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get subscriber info error, please contact tech support for help`);
  }
}
