import axios from 'axios';

export interface Employee {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscriber_id: string;
  scopes: string[];
}

export interface GetEmployeeInfo {
  data: Employee;
}

export async function getEmployeeInfo(token: string | null) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    console.log(token);
    const resp = await axios.get<GetEmployeeInfo>(`${baseBEURL}/private/auth/employee-info`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    return resp.data.data;
  } catch (error) {
    console.log(error.message);
    alert(`get employee info error, please contact tech support for help`);
  }

  return;
}
