import Table, { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { Review } from '../services/reviews';
import { TableContainerStyled } from './Layout/styles';

interface ReviewTableProps {
  reviews: Review[];
}

export function ReviewTable(props: ReviewTableProps) {
  const { reviews } = props;

  return (
    <div>
      <TableContainerStyled>
        <Table columns={columns} dataSource={reviews} pagination={{ pageSize: 50 }} />
      </TableContainerStyled>
    </div>
  );
}

const columns: ColumnsType<any> = [
  {
    title: 'Customer ID',
    dataIndex: 'customer_id',
    width: 250,
    ellipsis: true,
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
  },
];
