import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Spin } from 'antd';
import { find, get } from 'lodash/fp';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers, searchCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
import { CustomSpinner } from '../../styles/commons';
import { CustomerTable } from '../CustomerTable';
import { SearchInput } from '../SearchInput';
import { SendSMSToCustomerModal } from '../SendSMSModal';
import { CustomerTableActionContainerStyled, CustomerTableHeaderStyled } from './styles';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [sendMessageModalVisibility, setSendMessageModalVisibility] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

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
      <Dropdown overlay={menu} disabled={!selectedCustomers.length}>
        <Button>
          Actions <DownOutlined />
        </Button>
      </Dropdown>
    );
  }, [selectedCustomers]);

  const handleSearchCustomer = useCallback(async (value: string) => {
    setLoading(true);
    try {
      const { token } = await user.getIdTokenResult();

      const customers = await searchCustomers(employee.subscriber_id, token, value);

      setCustomers(customers);
    } catch (error) {}

    setLoading(false);
  }, []);

  const createCustomerButton = useMemo(() => {
    return (
      <Button>
        <a href="/create-customer" target="_blank">
          Create New Customer
        </a>
      </Button>
    );
  }, []);

  const handleRowsSelected = useCallback(
    (rows: string[]) => {
      // setSelectedRows(rows);
      const selected = rows
        .map((id) => find<Customer>((customer) => get('id')(customer) === id)(customers))
        .filter((customer) => !!customer) as Customer[];

      setSelectedCustomers(selected);
    },
    [customers],
  );

  return !customers ? (
    <CustomSpinner />
  ) : (
    <div>
      <CustomerTableHeaderStyled>
        <CustomerTableActionContainerStyled>
          {bulkSelectCustomerActionsDropdown}
          {createCustomerButton}
        </CustomerTableActionContainerStyled>
        <SearchInput searchFunction={handleSearchCustomer} />
      </CustomerTableHeaderStyled>
      {loading ? (
        <CustomSpinner />
      ) : (
        <CustomerTable customers={customers} employee={employee} user={user} setSelectedRows={handleRowsSelected} />
      )}

      <SendSMSToCustomerModal
        customers={selectedCustomers}
        sendMessageModalVisibility={sendMessageModalVisibility}
        setSendMessageModalVisibility={setSendMessageModalVisibility}
        // customerIDs={selectedRows}
        user={user}
      />
    </div>
  );
}
