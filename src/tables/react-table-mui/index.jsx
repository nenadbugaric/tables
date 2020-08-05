import React from "react";
import {useTable} from "react-table";
import {useRowSpan} from './useRowSpan';

import {TableContainer} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import data from "../rows";

const useStyles = makeStyles({
  table: {
    minWidth: 800,
    textAlign: 'left'
  },
  td: {
    verticalAlign: 'top'
  }
});

const aggregations = {
  0: ['sum', 'count'],
};

const columnSum = (column, rows) => rows.reduce((sum, row) => sum + row.values?.[column], 0);

export default function ReactTableMaterial() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Charge name",
        accessor: 'chargeName',
        enableRowSpan: true,
      },
      {
        Header: "Charge code,number",
        accessor: "chargeCode",
        enableRowSpan: true
      },
      {
        Header: "Price type code, name",
        accessor: "priceType",
        enableRowSpan: true
      },
      {
        Header: "PK1",
        accessor: "pk1",
        agg: true,
      },
      {
        Header: "PK2",
        accessor: "pk2",
        agg: true,
      },
      {
        Header: "Total",
        uuid: 'horizontalTotal',
        accessor: (row) => {
          const columnsToInlude = ["pk1", "pk2"];
          return columnsToInlude.reduce((sum, column) => row[column] + sum, 0);
        },
        agg: true,
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
    spanRow,
  } = useTable({columns, data}, useRowSpan);

  const preparedRows = rows.map((row, i) => {
    prepareRow(row);
    return spanRow(row, i);
  });

  const classes = useStyles();

  return (
    <div>
      <CssBaseline/>

      <TableContainer>
        <MaUTable className={classes.table} {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell style={{ backgroundColor: '#f0f0f0', color: '#404040'}} key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {preparedRows.map((row, i) => (
              <React.Fragment key={row.id}>
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    if (cell.isRowSpanned) return null;

                    return (
                      <TableCell className={classes.td} key={cell.column.id}
                                 rowSpan={cell.rowSpan} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>

                <AggRows rowIndex={i} cells={row.cells} rows={rows} aggregations={aggregations}  />
              </React.Fragment>
            ))}
          </TableBody>
        </MaUTable>
      </TableContainer>
    </div>
  );
}

const AggRows = ({ cells, rows, aggregations, rowIndex }) => {
  if (!aggregations || rowIndex !== rows.length - 1) return null;

  // const minAggIndes = Math.min(...Object.keys(aggregations).map(parseInt));

  return (
    aggregations[0].map(aggFunc => (
      <TableRow key={aggFunc}>
        {cells.map((cell, columnIndex) => {
          return (
            <TableCell key={cell.column.id} style={{ backgroundColor: '#e0f5ff', color: '#404040', fontWeight: 800 }}>
              {aggregations[columnIndex] && aggFunc === 'sum' && 'Total'}
              {aggregations[columnIndex] && aggFunc === 'count' && 'Count'}

              {!aggregations[columnIndex] && cell.column.agg && aggFunc === "sum" && columnSum(cell.column.id, rows)}
              {!aggregations[columnIndex] && cell.column.agg && aggFunc === "count" && rows.length}
            </TableCell>
          )
        })}
      </TableRow>
    ))
  );
}
