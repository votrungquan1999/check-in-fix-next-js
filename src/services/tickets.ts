import axios from 'axios';
import { CommonResponse } from './common';

export interface CreateTicketInput {
  customer_id: string;
  service_id: string;
  description: string;
  phone_type: string;
  contact_phone_number: string;
  sms_notification_enable: boolean;
}

export interface Ticket {
  id: string;
  customer_id: string;
  subscriber_id: string;
  service_id: string;
  description: string;
  approved_by: string;
  phone_type: string;
  contact_phone_number: string;
  sms_notification_enable: boolean;
}

export async function createTicket(input: CreateTicketInput, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.post<CommonResponse<Ticket>>(`${baseBEURL}/private/tickets/`, input, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 201 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
  }
}
