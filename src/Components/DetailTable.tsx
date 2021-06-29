import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useMemo } from 'react';

interface DetailTableProps {
  fields: string[];
  data: any;
}

export function DetailTable(props: DetailTableProps) {
  const { fields, data } = props;

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'field',
    },
    {
      dataIndex: 'value',
    },
  ];

  const displayData = useMemo(() => {
    return fields.map((field) => ({
      field: field,
      value: data[field],
    }));
  }, [fields, data]);

  return <Table columns={columns} dataSource={displayData} pagination={{ disabled: true }} />;
}
