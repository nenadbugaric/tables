import React from "react";
import MaterialTableComponent from 'material-table';

import data from '../rows';

const config = [
  {
    title: "Charge name",
    field: "chargeName",
  },
  {
    title: "Charge code,number",
    field: "chargeCode",
  },
  {
    title: "Price type code, name",
    field: "priceType",
  },
  {
    title: "Total",
    field: "total",
  },
  {
    title: "PK1",
    field: "pk1"
  }
];

export default function MaterialTable() {
  return (
    <MaterialTableComponent
      options={{
        search: false,
        showTitle: false,
        paging: false,
        padding: 'dense'
      }}
      columns={config}
      data={data}
      title="Demo Title"
    />
  );
}
