import { Select } from 'antd';
import axios from 'axios';
import React, { useState, useCallback, useMemo } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Customer, searchCustomers } from '../../../services/customers';
import { useContinuousRequest } from '../../../utils/asyncReq';
import { objectContain } from '../../../utils/object';
import { transformPhoneNumberToDisplay } from '../../../utils/phoneNumber';

interface SearchCustomerFormProps {
  setSelectedCustomer?: (customerID: string) => any;
  customers: Customer[];
}

export function SearchCustomerForm(props: SearchCustomerFormProps) {
  const { setSelectedCustomer, customers } = props;
  const [customersHint, setCustomersHint] = useState(customers);

  const handleSearchKeyChange = useCallback(
    async (value) => {
      const newCustomerList = customers.filter((customer) => {
        const formattedCustomer = {
          ...customer,
          name: customer.first_name + ' ' + customer.last_name,
        };

        return objectContain(formattedCustomer, value);
      });
      setCustomersHint(newCustomerList);
    },
    [, customers],
  );

  const options = useMemo(() => {
    return customersHint.map((customer) => {
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
  }, [customersHint]);

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
