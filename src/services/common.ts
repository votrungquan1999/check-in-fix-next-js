import axios, { Method } from 'axios';
import { Product } from './product';

export interface CommonError {
  message: string;
}

export type CommonResponse<T> = {
  data: T;
  error?: CommonError;
};

export async function callPrivateService<T>(path: string, token: string, method: Method, payload?: any) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const url = `${baseBEURL}${path}`;

  try {
    const resp = await axios.request<CommonResponse<T>>({
      method: method,
      data: payload,
      url: url,
      headers: {
        authorization: token,
      },
    });

    return resp;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return;
  }
}
