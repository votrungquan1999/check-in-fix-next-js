import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { find, isNil } from 'lodash/fp';
import React, { useMemo } from 'react';
import { useCallback } from 'react';
import { Customer } from '../../services/customers';
import { Service, serviceMapping, Ticket, TicketDevice, TicketStatuses } from '../../services/tickets';
import { transformPhoneNumberToDisplay } from '../../utils/phoneNumber';
import { transformDataSourceToHaveKey } from '../../utils/table';
import { convertFromISOTo12Hour } from '../../utils/time';
import { ExpandableTableContainerStyled } from './styles';

export interface TicketTableProps {
  tickets: Ticket[];
  customers: Customer[];
  ticketStatuses: TicketStatuses[];
  verticalScroll?: number;
}

export function TicketTable(props: TicketTableProps) {
  const { tickets, customers, ticketStatuses, verticalScroll } = props;
  const dataSource = transformDataSourceToHaveKey(tickets);

  const columns = useMemo(() => {
    return getMainTableColumns(ticketStatuses, customers);
  }, [ticketStatuses, customers]);

  const checkRowExpandable = useCallback((ticket: Ticket) => {
    return !isNil(ticket.devices);
  }, []);

  return (
    <ExpandableTableContainerStyled>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{
          y: verticalScroll ?? 100000000,
          x: 'max-content',
        }}
        expandable={{
          rowExpandable: checkRowExpandable,
          expandedRowRender: expandedRowRender,
        }}
        bordered
      />
    </ExpandableTableContainerStyled>
  );
}

function getMainTableColumns(ticketStatuses: TicketStatuses[], customers: Customer[]) {
  const columns: ColumnsType<Ticket> = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (value: string) => {
        return {
          children: (
            <Tooltip placement="topLeft" title={value}>
              <div className="overflow-hidden whitespace-nowrap overflow-ellipsis w-40">{value}</div>
            </Tooltip>
          ),
          props: {
            style: {
              maxWidth: 192,
            },
          },
        };
      },
    },
    {
      title: 'Dropped off At',
      dataIndex: 'dropped_off_at',
      key: 'dropped_off_at',
      width: 200,
      render: (droppedOffAt?: string) => {
        return convertFromISOTo12Hour(droppedOffAt);
      },
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Pick up At',
      dataIndex: 'pick_up_at',
      key: 'pick_up_at',
      width: 200,
      render: (pickUpAt?: string) => {
        return convertFromISOTo12Hour(pickUpAt);
      },
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Opened At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 200,
      render: (createdAt?: string) => {
        return convertFromISOTo12Hour(createdAt);
      },
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: number) => {
        return getCurrentStatusName(ticketStatuses, status);
      },
    },
    {
      title: 'Name',
      dataIndex: 'customer_id',
      width: 150,
      render: (customerId: string) => {
        return getCustomerName(customerId, customers);
      },
    },
    {
      title: 'Phone Number',
      dataIndex: ['contact_phone_number'],
      width: 150,
      render: (phoneNumber: string) => {
        return transformPhoneNumberToDisplay(phoneNumber);
      },
    },
    {
      title: 'Grand Total',
      dataIndex: ['quote'],
      width: 150,
    },
    {
      title: 'Paid',
      dataIndex: ['paid'],
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: () => {
        const menu = (
          <Menu>
            <Menu.Item>item 1</Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return columns;
}

function getCurrentStatusName(ticketStatuses: TicketStatuses[], status: number) {
  const currentStatus = find<TicketStatuses>((ticketStatus) => ticketStatus.order === status)(ticketStatuses);
  if (isNil(currentStatus)) {
    return 'N/A';
  }

  return currentStatus.name;
}

function getCustomerName(customerId: string, customers: Customer[]) {
  const currentCustomer = find<Customer>((customer) => customer.id === customerId)(customers);

  if (isNil(currentCustomer)) {
    return 'N/A';
  }

  return currentCustomer.first_name + ' ' + currentCustomer.last_name;
}

function getExpandableTableColumns() {
  const colums: ColumnsType<TicketDevice> = [
    {
      title: 'Device Model',
      dataIndex: 'device_model',
      width: 150,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      width: 150,
    },
    {
      title: 'Is Device Power On',
      dataIndex: 'is_device_power_on',
      width: 165,
      render: (isDevicePowerOn) => {
        if (isDevicePowerOn) {
          return 'True';
        }

        return 'False';
      },
    },

    {
      title: 'IMEI',
      dataIndex: 'imei',
      width: 150,
    },
  ];

  return colums;
}

function expandedRowRender(record: Ticket, index: number, indent: number, expanded: boolean) {
  const columns = getExpandableTableColumns();

  if (!record.devices?.length || !expanded) {
    return undefined;
  }

  const dataSource = transformDataSourceToHaveKey(record.devices);

  return (
    <Table
      key={index}
      rowKey={index.toString()}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      scroll={{
        x: 'max-content',
      }}
      bordered
    />
  );
}