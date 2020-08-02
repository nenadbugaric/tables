import React from "react";
import { useTable } from "react-table";
import styled from "styled-components";

import data from "../rows";

const TABLE = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
`;
const TH = styled.th`
  border-right: 1px solid black;
  border-top: 1px solid black;
  background: ${({ style }) => style?.background ?? "transparent"};
  color: ${({ style }) => style?.color ?? "black"};
`;
const TD = styled.td`
  border: 1px solid black;
  border-bottom: none;
  background: ${({ style }) => style?.background ?? "transparent"};
  color: ${({ style }) => style?.color ?? "black"};
  font-weight: ${({ style }) => style?.['font-weight'] ?? "400"};
`;

const config = {
  total: 2,
}

const columnSum = (column, rows) => rows.reduce((sum, row) => sum + row.values?.[column], 0);

export default function ReactTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Charge name",
        accessor: "chargeName",
        Footer: 'Total',
      },
      {
        Header: "Charge code,number",
        accessor: "chargeCode",
        Footer: '',
      },
      {
        Header: "Price type code, name",
        accessor: "priceType",
        Footer: '',
      },
      {
        Header: "PK1",
        accessor: "pk1",
        Footer: data => columnSum('pk1', data.rows),
      },
      {
        Header: "PK2",
        accessor: "pk2",
        Footer: data => columnSum('pk2', data.rows),
      },
      {
        Header: "Total",
        uuid: 'horizontalTotal',
        style: {
          background: "red",
          color: "white",
        },
        accessor: (row) => {
          const columnsToInlude = ["pk1", "pk2"];
          return columnsToInlude.reduce((sum, column) => row[column] + sum, 0);
        },
        Footer: data => columnSum('Total', data.rows),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  console.log("headerGroup.headers: ", headerGroups);

  return (
    <div>
      <h2>react-table</h2>
      <TABLE {...getTableProps()} style={{ borderCollapse: "collapse" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <TH style={column.style} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </TH>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                    <TD style={cell?.column?.style} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TD>
                  ))}
              </tr>
            );
          })}
        </tbody>

        {config.total && (
          <tfoot>
          {footerGroups.map(group => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map(column => (
                <TD style={column?.style} {...column.getFooterProps()}>{column.render("Footer")}</TD>
              ))}
            </tr>
          ))}
        </tfoot>
        )}
      </TABLE>
    </div>
  );
}
