import React from "react";
import { useTable } from "react-table";
import styled from 'styled-components';

const TABLE = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
`;
const TH = styled.th`
  border-right: 1px solid black;
  border-top: 1px solid black;
  background: ${(props) => {
    const colors = {
      isParent: 'gray',
      isTotal: 'blue'
    };
    
    const propsColors = Object.keys(props)
      .filter(prop => props[prop]);

    const propsToUse = Object.keys(colors)
      .find(color => propsColors.includes(color))
    
    return !propsToUse
      ? 'transparent'
      : colors[propsToUse];
}}
`;
const TD = styled.td`
  border: 1px solid black;
  border-bottom: none;
  background: ${(props) => !props.isTotal ? 'transparent' : 'blue'}
`;
const TD_NONE = styled.td`
  visibility: hidden;
  border: none;
  border-right: 1px solid black;
`;

function sum(vals) {
  return vals.reduce((x, y) => x + y, 0);
}

export default function ReactTable() {
  const data = React.useMemo(
    () => [
      {
        chargeName: "Vorverkaufsgebühr",
        chargeCode: "VVG-C, 4",
        priceType: "KIND, Kind",
        total: '514',
        pk1: '74'
      },
      {
        chargeName: "Vorverkaufsgebühr",
        chargeCode: "VVG-C, 4",
        priceType: "KIND, Kind",
        total: '604',
        pk1: '296'
      },
      {
        chargeName: "Vorverkaufsgebühr",
        chargeCode: "VVG-C, 4",
        priceType: "SCHU, Schüler",
        total: '265',
        pk1: '0'
      },
      {
        chargeName: "Vorverkaufsgebühr",
        chargeCode: "VVG-C, 4",
        priceType: "SCHU, Schüler",
        total: '588.80',
        pk1: '0'
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Ticket service charges",
        columns: [
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
            Header: "Total",
            accessor: "total",
            Aggregated: props => props.value,
            aggregate: sum
          },
        ]
      },
      {
        Header: "PK1",
        accessor: "pk1"
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

  return (
    <TABLE {...getTableProps()} style={{ borderCollapse: 'collapse'}}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              return (
                <TH isTotal={column.id === 'total'} isParent={!!column.columns?.length} {...column.getHeaderProps()}>
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
              {row.cells.map((cell) => {
                if (row.index > 0 && ['chargeName', 'chargeCode'].includes(cell.column.id)) {
                  return <TD_NONE key={cell.column.id}/>
                }

                return (
                  <TD isTotal={cell.column.id === 'total'} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TD>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </TABLE>
  );
}
