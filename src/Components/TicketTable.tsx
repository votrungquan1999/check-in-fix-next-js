import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { indexBy } from 'lodash/fp';
import React, { useMemo } from 'react';
import { Customer } from '../services/customers';
import { Ticket } from '../services/tickets';
import { TicketTableContainerStyled } from '../styles/Components/TicketTable';

export interface TicketTableProps {
  tickets: Ticket[];
  customers: Customer[];
}

export function TicketTable(props: TicketTableProps) {
  const { tickets, customers } = props;

  const columns: ColumnsType<any> = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      // responsive: ['md'],
      // width: 150,
      // colSpan: 1,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      // colSpan: 1,
    },
    {
      title: 'Customer Name',
      dataIndex: ['customer', 'name'],
      // colSpan: 1,
    },
    {
      title: 'Phone Number',
      dataIndex: ['customer', 'phone_number'],
      // colSpan: 1,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      // colSpan: 1,
    },
    {
      title: 'Device Model',
      dataIndex: 'device_model',
      // colSpan: 1,
    },
  ];

  const displayData = useMemo(() => transformDataToDisplay(customers, tickets), [customers, tickets]);

  return <Table columns={columns} dataSource={displayData} scroll={{ y: 100000000 }} />;
}

function transformDataToDisplay(customers: Customer[], tickets: Ticket[]) {
  const mapIDCustomer = indexBy('id', customers);

  // console.log(customers);

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

  console.log(data);

  return data;
}
