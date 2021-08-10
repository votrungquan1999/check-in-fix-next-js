import { Moment } from 'moment-timezone';

export interface InputTicketFormData {
  contact_phone_number?: string;
  description?: string;
  dropped_off_at?: Moment;
  pick_up_at?: Moment;
  sms_notification_enable?: boolean;
  devices?: InputTicketDeviceForm[];
}

export interface InputTicketDeviceForm {
  is_device_power_on?: boolean;
  imei?: string;
  device_model?: string;
  service?: string;
}
