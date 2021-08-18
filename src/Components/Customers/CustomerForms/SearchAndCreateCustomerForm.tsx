import { FileAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { Customer } from '../../../services/customers';
import { CreateCustomerModal } from '../CustomerModals/CreateCustomerModal';
import { SearchCustomerForm } from './SearchCustomerForm';

interface SearchAndCreateCustomerFormProps extends WithAuthProps {
  customers: Customer[];
  setSelectedCustomer?: (customerID: string) => any;
}

export function SearchAndCreateCustomerForm(props: SearchAndCreateCustomerFormProps) {
  const { user, employee, setSelectedCustomer } = props;
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);

  const handleClickCreateCustomer = useCallback(() => {
    setIsCreateCustomerModalVisible(true);
  }, []);

  const handleFinishCreateCustomer = useCallback((created?: boolean, customer?: Customer) => {
    if (created && !isNil(customer) && setSelectedCustomer) {
      setSelectedCustomer(customer.id);
    }

    setIsCreateCustomerModalVisible(false);
  }, []);

  return (
    <div className="flex w-full">
      <Button type="primary" className="flex items-center" onClick={handleClickCreateCustomer}>
        <FileAddOutlined />
        Add New Customer
      </Button>
      <SearchCustomerForm {...props} />
      <CreateCustomerModal
        employee={employee}
        user={user}
        isCreateCustomerModalVisible={isCreateCustomerModalVisible}
        finishCreateCustomer={handleFinishCreateCustomer}
      />
    </div>
  );
}
