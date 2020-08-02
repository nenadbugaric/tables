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
`;
const TD_NONE = styled.td`
  visibility: hidden;
  border: none;
  border-right: 1px solid black;
`;

export default function ReactTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Charge name",
        accessor: "chargeName",
      },
      {
        Header: "Charge code,number",
        accessor: "chargeCode",
      },
      {
        Header: "Price type code, name",
        accessor: "priceType",
      },
      {
        Header: "PK1",
        accessor: "pk1",
      },
      {
        Header: "PK2",
        accessor: "pk2",
      },
      {
        Header: "Total",
        style: {
          background: "red",
          color: "white",
        },
        accessor: (row) => {
          const columnsToInlude = ["pk1", "pk2"];
          return columnsToInlude.reduce((sum, column) => row[column] + sum, 0);
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
      </TABLE>
    </div>
  );
}
