import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers, searchCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
import { CustomSpinner } from '../../styles/commons';
import { CustomerTable } from '../CustomerTable';
import { SearchInput } from '../SearchInput';
import { SendSMSToCustomerModal } from '../SendSMSModal';
import { CustomerTableHeaderStyled } from './styles';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [sendMessageModalVisibility, setSendMessageModalVisibility] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    const getAndSetCustomers = async () => {
      const { token } = await user.getIdTokenResult();
      const customers = await getCustomers(employee.subscriber_id, token);
      if (customers !== undefined) {
        setCustomers(customers);
      }
    };

    getAndSetCustomers();
  }, [employee, user]);

  const bulkSelectCustomerActionsDropdown = useMemo(() => {
    type actionKeys = '1';

    const actions = {
      1: () => {
        setSendMessageModalVisibility(true);
      },
    };

    const handleClickMenu = ({ key }: any) => {
      actions[key as actionKeys]();
    };

    const menu = (
      <Menu onClick={handleClickMenu}>
        <Menu.Item key="1">Send SMS</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} disabled={!selectedRows.length}>
        <Button>
          Actions <DownOutlined />
        </Button>
      </Dropdown>
    );
  }, [selectedRows]);

  const handleSearchCustomer = useCallback(async (value: string) => {
    const { token } = await user.getIdTokenResult();

    const customers = await searchCustomers(employee.subscriber_id, token, value);

    setCustomers(customers);
  }, []);

  return !customers ? (
    <CustomSpinner />
  ) : (
    <div>
      <CustomerTableHeaderStyled>
        {bulkSelectCustomerActionsDropdown}
        <SearchInput searchFunction={handleSearchCustomer} />
      </CustomerTableHeaderStyled>
      <CustomerTable customers={customers} employee={employee} user={user} setSelectedRows={setSelectedRows} />
      <SendSMSToCustomerModal
        sendMessageModalVisibility={sendMessageModalVisibility}
        setSendMessageModalVisibility={setSendMessageModalVisibility}
        customerIDs={selectedRows}
        user={user}
      />
    </div>
  );
}
