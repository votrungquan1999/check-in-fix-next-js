import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { createTicket, CreateTicketInput, Ticket } from '../../../services/tickets';
import { InputTicketFormData } from './commons';
import { validateForm } from './helper';
import { InputTicketData } from './TicketInputForm';

interface CreateTicketFormProps extends WithAuthProps {
  customerID: string;
  onCreateSuccessfully?: (ticket: Ticket) => any;
  onCreateFailed?: () => any;
}

export function CreateTicketForm(props: CreateTicketFormProps) {
  const { customerID, onCreateFailed, user, onCreateSuccessfully } = props;
  const [validationStatuses, setValidationStatuses] = useState<object>({});
  const [validationHelpers, setValidationHelpers] = useState<object>({});

  const handleSubmitTicket = useCallback(async (data: InputTicketFormData) => {
    const [newValidationStatuses, newValidationHelpers, hasError] = validateForm(data);

    setValidationStatuses(newValidationStatuses);
    setValidationHelpers(newValidationHelpers);
    if (hasError) {
      return;
    }

    const createTicketInput: CreateTicketInput = {
      customer_id: customerID,
      description: data.description,
      contact_phone_number: data.contact_phone_number,
      sms_notification_enable: data.sms_notification_enable ?? false,
      dropped_off_at: data.dropped_off_at?.toISOString(),
      pick_up_at: data.pick_up_at?.toISOString(),
      devices: data.devices,
    };

    const { token } = await user.getIdTokenResult();
    const ticket = await createTicket(createTicketInput, token);
    if (!ticket) {
      if (onCreateFailed) {
        onCreateFailed();
      }
      return;
    }

    if (onCreateSuccessfully) {
      onCreateSuccessfully(ticket);
    }
  }, []);

  const handleFieldChanges = useCallback(() => {
    setValidationStatuses({});
    setValidationHelpers({});
  }, []);

  return (
    <InputTicketData
      onSubmit={handleSubmitTicket}
      title={'Create Ticket'}
      validationStatuses={validationStatuses}
      validationHelpers={validationHelpers}
      handleFieldChange={handleFieldChanges}
    />
  );
}
