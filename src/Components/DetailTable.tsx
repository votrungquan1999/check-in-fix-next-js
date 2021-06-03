import { Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { useMemo } from 'react';

interface DetailTableProps {
  fields: string[];
  data: any;
}

export function DetailTable(props: DetailTableProps) {
  const { fields, data } = props;

  // const columns = useMemo(() => {
  //   return fields.map((field) => {
  //     const column: ColumnType<any> = {
  //       title: field.toUpperCase(),
  //       dataIndex: field,
  //     };

  //     return column;
  //   });
  // }, [fields]);

  const columns: ColumnsType<any> = [
    {
      // title: 'Field',
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

  return <Table columns={columns} dataSource={displayData} />;
}
