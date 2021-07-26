import withAuth from '../src/firebase/withAuth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { isArray, isNil } from 'lodash/fp';
import { CustomSpinner } from '../src/styles/commons';
import { CreateCustomerForm } from '../src/Components/CreateCustomerForm/CreateCustomerForm';
import { useEffect } from 'react';
import { useCallback } from 'react';

export default withAuth(function CreateCustomer(props) {
  const { user, employee } = props;
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>();

  useEffect(() => {
    const rawPhoneNumber = router.query['phone_number'];
    if (isArray(rawPhoneNumber)) {
      return;
    }

    setPhoneNumber(rawPhoneNumber ?? '');
  }, [router]);

  const handleCreateCustomerSuccessfully = useCallback(() => {
    setTimeout(() => {
      router.push('/customers');
    }, 3000);
  }, [router]);

  if (isNil(phoneNumber)) {
    return (
      <div className="h-screen">
        <CustomSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-6/12">
        <CreateCustomerForm
          employee={employee}
          user={user}
          initPhoneNumber={phoneNumber}
          onCreateCustomerSuccessfully={handleCreateCustomerSuccessfully}
        />
      </div>
    </div>
  );
});
