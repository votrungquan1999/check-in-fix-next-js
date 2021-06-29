import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import withAuth from '../src/firebase/withAuth';
import { CustomResult } from '../src/styles/commons';

export default withAuth(function CreateCustomerSuccessfully(props) {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/customers');
    }, 3000);
  });

  return (
    <div className="h-screen">
      <CustomResult title="Create Customer Successfully" status="success" />
    </div>
  );
});
