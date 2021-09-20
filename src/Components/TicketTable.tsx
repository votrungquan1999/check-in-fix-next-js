import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { indexBy } from 'lodash/fp';
import React, { useMemo } from 'react';
import { Customer } from '../services/customers';
import { Ticket } from '../services/tickets';

export interface TicketTableProps {
  tickets: Ticket[];
  customers: Customer[];
}

export function TicketTable(props: TicketTableProps) {
  const { tickets, customers } = props;

  const displayData = useMemo(() => transformDataToDisplay(customers, tickets), [customers, tickets]);

  return <Table columns={columns} dataSource={displayData} scroll={{ y: 100000000 }} />;
}

function transformDataToDisplay(customers: Customer[], tickets: Ticket[]) {
  const mapIDCustomer = indexBy('id', customers);

  const data = tickets.map((ticket) => {
    const currentCustomer = mapIDCustomer[ticket.customer_id];

    return {
      ...ticket,
      customer: currentCustomer
        ? {
            ...currentCustomer,
            name: currentCustomer.first_name + ' ' + currentCustomer.last_name,
          }
        : undefined,
    };
  });

  return data;
}

const columns: ColumnsType<any> = [
  {
    title: 'Ticket ID',
    dataIndex: 'id',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Customer Name',
    dataIndex: ['customer', 'name'],
  },
  {
    title: 'Phone Number',
    dataIndex: ['customer', 'phone_number'],
  },
  {
    title: 'Service',
    dataIndex: 'service',
  },
  {
    title: 'Device Model',
    dataIndex: 'device_model',
  },
];
