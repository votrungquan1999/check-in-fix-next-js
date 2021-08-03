import { isNil } from 'lodash/fp';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { UploadFilesForm } from '../../../src/Components/UploadFilesForm/UploadFilesForm';
import withAuth from '../../../src/firebase/withAuth';
import { getTicketDetail } from '../../../src/services/tickets';
import { CustomSpinner } from '../../../src/styles/commons';

export default withAuth(function (props) {
  const { employee, user } = props;
  const router = useRouter();
  const [ticketID, setTicketID] = useState<string>();

  const handleTicketID = useCallback(async (id: string) => {
    const { token } = await user.getIdTokenResult();
    const ticket = await getTicketDetail(id, token);
    if (isNil(ticket)) {
      return;
    }

    setTicketID(id);
  }, []);

  useEffect(() => {
    const id = router.query['id'];
    if (isNil(id) || typeof id !== 'string') {
      return;
    }

    handleTicketID(id);
  }, [router]);

  if (!ticketID) {
    return (
      <div className="h-screen">
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-9/12 border p-5">
        <UploadFilesForm uploadPath={`tickets/${ticketID}/`} />
      </div>
    </div>
  );
});
