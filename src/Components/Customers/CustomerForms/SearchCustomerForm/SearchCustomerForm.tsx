import { Select } from 'antd';
import axios from 'axios';
import React, { useState, useCallback, useMemo } from 'react';
import { WithAuthProps } from '../../../../firebase/withAuth';
import { Customer, searchCustomers } from '../../../../services/customers';
import { useContinuousRequest } from '../../../../utils/asyncReq';
import { transformPhoneNumberToDisplay } from '../../../../utils/phoneNumber';

interface SearchCustomerFormProps extends WithAuthProps {
  setSelectedCustomer?: (customerID: string) => any;
}

export function SearchCustomerForm(props: SearchCustomerFormProps) {
  const { employee, user, setSelectedCustomer } = props;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const continuousReq = useContinuousRequest();

  const handleSearchKeyChange = useCallback(
    async (value) => {
      const { token } = await user.getIdTokenResult();

      const newReqID = continuousReq.getNewestID();

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      continuousReq.addReq(newReqID, source);

      const customerList = await searchCustomers(employee.subscriber_id, token, value, source);

      const isLatestData = continuousReq.processReqResponse(newReqID);
      if (isLatestData) {
        setCustomers(customerList);
      }
    },
    [user, employee, continuousReq],
  );

  const options = useMemo(() => {
    return customers.map((customer) => {
      const phoneNumber = transformPhoneNumberToDisplay(customer.phone_number);

      return (
        <Select.Option value={customer.id} key={customer.id}>
          <div>
            <div className="text-lg">
              {customer.first_name} {customer.last_name}
            </div>
            <div className="text-sm text-gray-400">{phoneNumber}</div>
          </div>
        </Select.Option>
      );
    });
  }, [customers]);

  const handleSelectCustomer = useCallback((customerID: string) => {
    setSelectedCustomer && setSelectedCustomer(customerID);
  }, []);

  return (
    <div className="w-full">
      <Select
        className="w-full"
        placeholder={'Enter Search Key Here'}
        showSearch
        filterOption={false}
        onSearch={handleSearchKeyChange}
        onSelect={handleSelectCustomer}
      >
        {options}
      </Select>
    </div>
  );
}
