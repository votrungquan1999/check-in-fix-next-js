import { set } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { FormFieldData } from '../../../commons/formFields';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Ticket, updateTicket, UpdateTicketInput } from '../../../services/tickets';
import { InputTicketFormData } from './commons';
import { validateFieldChanged, validateForm } from './helper';
import { InputTicketData, InputTicketDataProps } from './TicketInputForm';

interface EditTicketFormProps extends WithAuthProps {
  ticket: Ticket;
  onUpdateFailed?: () => {};
  onUpdateSucessfully?: (ticket: Ticket) => any;
}

export function EditTicketForm(props: EditTicketFormProps) {
  const { ticket, user, onUpdateSucessfully, onUpdateFailed } = props;
  const [validationStatuses, setValidationStatuses] = useState<object>({});
  const [validationHelpers, setValidationHelpers] = useState<object>({});

  const initData: InputTicketFormData = useMemo(() => {
    return {
      contact_phone_number: ticket.contact_phone_number,
      description: ticket.description,
      devices: ticket.devices,
      dropped_off_at: ticket.dropped_off_at ? moment(ticket.dropped_off_at) : undefined,
      pick_up_at: ticket.pick_up_at ? moment(ticket.pick_up_at) : undefined,
      sms_notification_enable: ticket.sms_notification_enable,
    };
  }, [ticket]);

  const handleSubmitForm = useCallback(
    async (values: InputTicketFormData) => {
      const [newValidationStatuses, newValidationHelpers, hasError] = validateForm(values);

      setValidationStatuses(newValidationStatuses);
      setValidationHelpers(newValidationHelpers);
      if (hasError) {
        return;
      }

      const updateTicketData: UpdateTicketInput = {
        description: values.description,
        contact_phone_number: values.contact_phone_number,
        sms_notification_enable: values.sms_notification_enable ?? false,
        dropped_off_at: values.dropped_off_at?.toISOString(),
        pick_up_at: values.pick_up_at?.toISOString(),
        devices: values.devices,
      };

      const { token } = await user.getIdTokenResult();
      const updatedTicket = await updateTicket(ticket.id, updateTicketData, token);
      if (!updatedTicket) {
        if (onUpdateFailed) {
          onUpdateFailed();
        }
        return;
      }

      if (onUpdateSucessfully) {
        onUpdateSucessfully(ticket);
      }
    },
    [ticket],
  );

  const handleFieldChange = useCallback(
    (changedFields: FormFieldData[], allFields: FormFieldData[]) => {
      let newValidationStatus = {};
      for (const changedField of allFields) {
        const path = changedField.name;
        if (path === 'devices') {
          return;
        }

        const isFieldChanged = validateFieldChanged(changedField, initData);
        if (isFieldChanged) {
          set(newValidationStatus, path, 'warning');
        }
      }
      setValidationStatuses(newValidationStatus);
    },
    [validationStatuses],
  );

  return (
    <div>
      <InputTicketData
        onSubmit={handleSubmitForm}
        initData={initData}
        title={'Edit Ticket'}
        handleFieldChange={handleFieldChange}
        validationStatuses={validationStatuses}
        validationHelpers={validationHelpers}
      />
    </div>
  );
}
