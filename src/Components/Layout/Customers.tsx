import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Typography } from 'antd';
import { find, get } from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers, searchCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
import { CustomSpinner, MainContainerFullHeightStyled, MainContainerLoadingStyled } from '../../styles/commons';
import { CreateCustomerModal } from '../CreateCustomerModal/CreateCustomerModal';
import { CustomerTable } from '../CustomerTable';
import { DeleteCustomerModal } from '../DeleteCustomersModal';
import { SearchInput } from '../SearchInput';
import { SendSMSToCustomerModal } from '../SendSMSModal';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [sendMessageModalVisibility, setSendMessageModalVisibility] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [toBeDeletedCustomers, setToBeDeletedCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);

  const getAndSetCustomers = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    const customerList = await getCustomers(employee.subscriber_id, token);
    if (customerList !== undefined) {
      setCustomers(customerList);
    }
  }, [user, setCustomers]);

  useEffect(() => {
    getAndSetCustomers();
  }, [getAndSetCustomers]);

  const tableName = useMemo(() => {
    return (
      <div>
        <Typography.Title style={{ margin: 0 }} level={5}>
          Customer
        </Typography.Title>
      </div>
    );
  }, []);

  const bulkSelectCustomerActionsDropdown = useMemo(() => {
    type actionKeys = '1' | '2';

    const actions = {
      1: () => {
        setSendMessageModalVisibility(true);
      },
      2: () => {
        setToBeDeletedCustomers(selectedCustomers);
      },
    };

    const handleClickMenu = ({ key }: any) => {
      actions[key as actionKeys]();
    };

    const menu = (
      <Menu onClick={handleClickMenu}>
        <Menu.Item key="1">Send SMS</Menu.Item>
        <Menu.Item key="2">Delete Selected Customers</Menu.Item>
      </Menu>
    );

    return (
      <div className="mr-2 ml-auto">
        <Dropdown overlay={menu} disabled={!selectedCustomers.length}>
          <Button>
            Actions <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    );
  }, [selectedCustomers, setToBeDeletedCustomers, setSendMessageModalVisibility]);

  const handleSearchCustomer = useCallback(
    async (value: string) => {
      setLoading(true);

      const { token } = await user.getIdTokenResult();
      const customerList = await searchCustomers(employee.subscriber_id, token, value);
      setCustomers(customerList);

      setLoading(false);
    },
    [setLoading, setCustomers],
  );

  const createCustomerButton = useMemo(() => {
    return (
      <div className="mr-2">
        <Button onClick={() => setIsCreateCustomerModalVisible(true)}>
          {/* <a href="/create-customer" target="_blank">
          </a> */}
          Create New Customer
        </Button>
      </div>
    );
  }, []);

  const searchByWildCard = useMemo(() => {
    return (
      <div>
        <SearchInput searchFunction={handleSearchCustomer} />
      </div>
    );
  }, []);

  const handleRowsSelected = useCallback(
    (rows: string[]) => {
      const selected = rows
        .map((id) => find<Customer>((customer) => get('id')(customer) === id)(customers))
        .filter((customer) => !!customer) as Customer[];

      setSelectedCustomers(selected);
    },
    [customers, setSelectedCustomers],
  );

  const handleFinishDeleteCustomers = useCallback(async () => {
    setToBeDeletedCustomers([]);

    setLoading(true);
    await getAndSetCustomers();
    setLoading(false);
  }, [setToBeDeletedCustomers, setCustomers, setLoading]);

  const handleFinishCreateCustomer = useCallback(async () => {
    setIsCreateCustomerModalVisible(false);
    setLoading(true);
    await getAndSetCustomers();
    setLoading(false);
  }, []);

  return !customers ? (
    <MainContainerLoadingStyled />
  ) : (
    <div className="p-5 pb-0">
      <div className="bg-white rounded-md">
        <div className="flex p-2 items-center">
          {tableName}
          {bulkSelectCustomerActionsDropdown}
          {createCustomerButton}
          {searchByWildCard}
        </div>
        {loading ? (
          <div style={{ height: 'calc(100vh - 152px)' }}>
            <CustomSpinner />
          </div>
        ) : (
          <CustomerTable
            customers={customers}
            employee={employee}
            user={user}
            setSelectedRows={handleRowsSelected}
            height={window.innerHeight - 271}
            setToBeDeletedCustomers={setToBeDeletedCustomers}
          />
        )}

        <DeleteCustomerModal
          toBeDeletedCustomers={toBeDeletedCustomers}
          finishDeleteCustomers={handleFinishDeleteCustomers}
          employee={employee}
          user={user}
        />

        <SendSMSToCustomerModal
          customers={selectedCustomers}
          sendMessageModalVisibility={sendMessageModalVisibility}
          setSendMessageModalVisibility={setSendMessageModalVisibility}
          user={user}
        />

        <CreateCustomerModal
          employee={employee}
          user={user}
          finishCreateCustomer={handleFinishCreateCustomer}
          isCreateCustomerModalVisible={isCreateCustomerModalVisible}
        />
      </div>
    </div>
  );
}
