import axios from 'axios';
import { CommonResponse } from './common';

export interface Employee {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscriber_id: string;
  scopes: string[];
}

export async function getEmployeeInfo(token: string | null) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Employee>>(`${baseBEURL}/private/auth/employee-info`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      alert(`get review error, due to ${resp.data.error?.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get employee info error, please contact tech support for help`);
  }
}
