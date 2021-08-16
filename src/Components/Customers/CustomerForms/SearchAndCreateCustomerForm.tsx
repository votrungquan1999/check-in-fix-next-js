import { FileAddOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { WithAuthProps } from '../../../firebase/withAuth';
import { CreateCustomerModal } from '../CustomerModals/CreateCustomerModal';
import { SearchCustomerForm } from './SearchCustomerForm';

interface SearchAndCreateCustomerFormProps extends WithAuthProps {
  setSelectedCustomer?: (customerID: string) => any;
}

export function SearchAndCreateCustomerForm(props: SearchAndCreateCustomerFormProps) {
  const { user, employee } = props;
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);

  const handleClickCreateCustomer = useCallback(() => {
    setIsCreateCustomerModalVisible(true);
  }, []);

  const handleFinishCreateCustomer = useCallback(() => {
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
