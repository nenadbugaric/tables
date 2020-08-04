import React from 'react';
import Table from 'rc-table';

import data from '../rows';

export default function RcTable() {
  const config = [
    {
      title: "Charge name",
      dataIndex: "chargeName",
    },
    {
      title: "Charge code,number",
      dataIndex: "chargeCode",
    },
    {
      title: "Price type code, name",
      dataIndex: "priceType",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "PK1",
      dataIndex: "pk1",
    }
  ];

  return <Table rowKey="uuid" columns={config} data={data} />
}
