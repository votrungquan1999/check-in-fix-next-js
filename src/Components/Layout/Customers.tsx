import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Typography, message } from 'antd';
import { find, get } from 'lodash/fp';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WithAuthProps } from '../../firebase/withAuth';
import { Customer, getCustomers, searchCustomers } from '../../services/customers';
import { Subscriber } from '../../services/subscribers';
import { CustomSpinner, MainContainerFullHeightStyled, MainContainerLoadingStyled } from '../../styles/commons';
import { CreateCustomerModal } from '../Customers/CustomerModals/CreateCustomerModal';
import { CustomerTable } from '../Customers/CustomerTables/CustomerTable';
import { DeleteCustomerModal } from '../Customers/CustomerModals/DeleteCustomersModal';
import { SearchInput } from '../SearchInput';
import { SendSMSToCustomerModal } from '../SendSMSModal';
import { EditCustomerModal } from '../Customers/CustomerModals/EditCustomerModal';
import { CustomerDetailModal } from '../Customers/CustomerModals/CustomerDetailModal';

export interface CustomerProps extends WithAuthProps {
  subscriber: Subscriber | undefined;
}

export function Customers(props: WithAuthProps) {
  const { employee, user } = props;
  const [customers, setCustomers] = useState<Customer[]>();
  const [sendMessageModalVisibility, setSendMessageModalVisibility] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [toBeDeletedCustomers, setToBeDeletedCustomers] = useState<Customer[]>([]);
  const [toBeEditedCustomer, setToBeEditedCustomer] = useState<Customer>();
  const [detailCustomer, setDetailCustomer] = useState<Customer>();
  const [loading, setLoading] = useState(false);
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] = useState(false);

  const getAndSetCustomers = useCallback(async () => {
    const { token } = await user.getIdTokenResult();
    const customerList = await getCustomers(employee.subscriber_id, token);
    if (customerList !== undefined) {
      setCustomers(customerList);
    }
  }, [user]);

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

  const handleFinishDeleteCustomers = useCallback(
    async (deleted: boolean = false) => {
      setToBeDeletedCustomers([]);

      if (deleted) {
        setLoading(true);
        await getAndSetCustomers();
        setLoading(false);
      }
    },
    [setToBeDeletedCustomers, setCustomers, setLoading],
  );

  const handleFinishCreateCustomer = useCallback(
    async (createSuccessfully: boolean = false) => {
      setIsCreateCustomerModalVisible(false);
      if (createSuccessfully) {
        message.success('create customer successfully');
        setLoading(true);
        await getAndSetCustomers();
        setLoading(false);
      }
    },
    [getAndSetCustomers],
  );

  const handleFisnishEditCustomer = useCallback(
    async (updatedSuccessfully: boolean = false) => {
      setToBeEditedCustomer(undefined);
      if (updatedSuccessfully) {
        message.success('update customer successfully');
        setLoading(true);
        await getAndSetCustomers();
        setLoading(false);
      }
    },
    [getAndSetCustomers],
  );

  const handleCloseCustomerDetail = useCallback(async (isCustomerUpdated: boolean) => {
    setDetailCustomer(undefined);
    if (isCustomerUpdated) {
      setLoading(true);
      await getAndSetCustomers();
      setLoading(false);
    }
  }, []);

  const handleClickDeleteCustomer = useCallback((customer: Customer) => {
    setToBeDeletedCustomers([customer]);
  }, []);

  const handleClickEditCustomer = useCallback((customer: Customer) => {
    setToBeEditedCustomer(customer);
  }, []);

  const handleClickDetailCustomer = useCallback((customer: Customer) => {
    setDetailCustomer(customer);
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
            // employee={employee}
            // user={user}
            onClickDetailCustomer={handleClickDetailCustomer}
            setSelectedRows={handleRowsSelected}
            height={window.innerHeight - 271}
            onClickDelete={handleClickDeleteCustomer}
            onClickEdit={handleClickEditCustomer}
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

        <EditCustomerModal
          employee={employee}
          user={user}
          customer={toBeEditedCustomer}
          finishUpdateCustomer={handleFisnishEditCustomer}
        />

        <CustomerDetailModal
          employee={employee}
          user={user}
          customerID={detailCustomer?.id}
          onCloseDetailModal={handleCloseCustomerDetail}
        />
      </div>
    </div>
  );
}
