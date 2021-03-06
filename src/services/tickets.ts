import axios from 'axios';
import { CommonResponse } from './common';

export interface CreateTicketInput {
  customer_id: string;
  service_id?: string;
  description?: string;
  contact_phone_number?: string;
  sms_notification_enable?: boolean;
  dropped_off_at?: string;
  pick_up_at?: string;
  devices?: {
    is_device_power_on?: boolean;
    imei?: string;
    device_model?: string;
    service?: string;
  }[];
  quote?: number;
  paid?: number;
}

export interface UpdateTicketInput {
  description?: string;
  contact_phone_number?: string;
  sms_notification_enable?: boolean;
  dropped_off_at?: string;
  pick_up_at?: string;
  devices?: {
    is_device_power_on?: boolean;
    imei?: string;
    device_model?: string;
    service?: string;
  }[];
  quote?: number;
  paid?: number;
}

export enum TicketStatusesType {
  Pending,
  Completed,
}

export interface TicketStatuses {
  id: string;
  name: string;
  subscriber_id: string;
  order: number;
  type: TicketStatusesType;
}

export type Service = '1';

export const serviceMapping = {
  1: 'Default',
};

export interface Ticket {
  id: string;
  customer_id: string;
  subscriber_id: string;
  description?: string;
  contact_phone_number?: string;
  sms_notification_enable: boolean;
  status: number;
  payment_status?: number;
  quote?: number;
  paid?: number;

  devices?: TicketDevice[];

  created_at: string;
  updated_at: string;

  dropped_off_at?: string;
  pick_up_at?: string;

  approved_by?: string;
  technician_notes?: string;
  problem?: string;
}

export interface TicketDevice {
  is_device_power_on?: boolean;
  imei?: string;
  device_model?: string;
  service?: string;
}

export async function createTicket(input: CreateTicketInput, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.post<CommonResponse<Ticket>>(`${baseBEURL}/private/tickets`, input, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 201 && resp.data.error) {
      alert(`create ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
  }
}

export async function getTicketsBySubscriberID(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Ticket[]>>(
      `${baseBEURL}/private/tickets?subscriber_id=${subscriberID}`,
      {
        headers: {
          authorization: token,
        },
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    if (resp.status !== 200 && resp.data.error) {
      alert(`get tickets failed due to ${resp.data.error.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    alert('internal server error, please contact tech support for help');
    return [];
  }
}

export async function getTicketsByCustomerID(customerID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Ticket[]>>(`${baseBEURL}/private/tickets?customer_id=${customerID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`get tickets failed due to ${resp.data.error.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return [];
  }
}

export async function getTicketStatusesBySubscriberID(subscriberID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<TicketStatuses[]>>(
      `${baseBEURL}/private/settings/ticket-statuses?subscriber_id=${subscriberID}`,
      {
        headers: {
          authorization: token,
        },
        responseType: 'json',
        validateStatus: (status) => status < 500,
      },
    );

    if (resp.status !== 200 && resp.data.error) {
      alert(`get subscriber's ticket statuses failed due to ${resp.data.error.message}`);
      return [];
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return [];
  }
}

export async function getTicketDetail(ticketID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.get<CommonResponse<Ticket>>(`${baseBEURL}/private/tickets/${ticketID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`get ticket detail failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, please contact tech support for help');
    return;
  }
}

export async function updateTicket(ticketID: string, updateData: UpdateTicketInput, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.patch<CommonResponse<Ticket>>(`${baseBEURL}/private/tickets/${ticketID}`, updateData, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`update ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, can not update ticket, please contact tech support for help');
    return;
  }
}

export async function deleteTicket(ticketID: string, token: string) {
  const baseBEURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const resp = await axios.delete<CommonResponse<Ticket>>(`${baseBEURL}/private/tickets/${ticketID}`, {
      headers: {
        authorization: token,
      },
      responseType: 'json',
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200 && resp.data.error) {
      alert(`delete ticket failed due to ${resp.data.error.message}`);
      return;
    }

    return resp.data.data;
  } catch (error) {
    console.log(error);
    alert('internal server error, can not delete ticket, please contact tech support for help');
    return;
  }
}
