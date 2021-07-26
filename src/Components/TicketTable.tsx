import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { find, indexBy, isNil } from 'lodash/fp';
import React, { useMemo } from 'react';
import { Customer } from '../services/customers';
import { Service, serviceMapping, Ticket, TicketStatuses } from '../services/tickets';
import { transformPhoneNumberToDisplay } from '../utils/phoneNumber';

export interface TicketTableProps {
  tickets: Ticket[];
  customers: Customer[];
  ticketStatuses: TicketStatuses[];
  verticalScroll?: number;
}

export function TicketTable(props: TicketTableProps) {
  const { tickets, customers, ticketStatuses, verticalScroll } = props;

  const columns = useMemo(() => {
    return getColumns(ticketStatuses, customers);
  }, [ticketStatuses, customers]);

  return (
    <Table
      columns={columns}
      dataSource={tickets}
      scroll={{
        y: verticalScroll ?? 100000000,
        x: 'max-content',
      }}
      bordered
    />
  );
}

function getColumns(ticketStatuses: TicketStatuses[], customers: Customer[]) {
  const columns: ColumnsType<Ticket> = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
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
      title: 'Opened At',
      dataIndex: 'created_at',
      render: (createdAt: string) => {
        const [date, time] = createdAt.replaceAll('Z', '').split('T');
        const formatedTime = time.slice(0, 8);

        return date + ' ' + formatedTime;
      },
      sorter: (a, b) => (a.created_at > b.created_at ? 1 : -1),
      defaultSortOrder: 'descend',
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
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
      title: 'Service',
      dataIndex: 'service',
      width: 150,
      // render: (service: Service) => {
      //   return serviceMapping[service];
      // },
    },
    {
      title: 'Service Type',
      dataIndex: 'service_id',
      width: 150,
      render: (service: Service) => {
        return serviceMapping[service];
      },
    },
    {
      title: 'Device Model',
      dataIndex: 'device_model',
      width: 150,
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
