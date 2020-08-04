import React from "react";
import {useTable} from "react-table";
import {useRowSpan} from './useRowSpan';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'

import data from "../rows";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    textAlign: 'left'
  },
  td: {
    verticalAlign: 'top'
  }
});

const config = {
  total: 2,
}

const columnSum = (column, rows) => rows.reduce((sum, row) => sum + row.values?.[column], 0);

export default function ReactTableMaterial() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Charge name",
        accessor: 'chargeName',
        Footer: 'Total',
        enableRowSpan: true
      },
      {
        Header: "Charge code,number",
        accessor: "chargeCode",
        Footer: '',
        enableRowSpan: true
      },
      {
        Header: "Price type code, name",
        accessor: "priceType",
        Footer: '',
        enableRowSpan: true
      },
      {
        Header: "PK1",
        accessor: "pk1",
        Footer: data => columnSum('pk1', data.rows)
      },
      {
        Header: "PK2",
        accessor: "pk2",
        Footer: data => columnSum('pk2', data.rows)
      },
      {
        Header: "Total",
        uuid: 'horizontalTotal',
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
    spanRow,
  } = useTable({columns, data}, useRowSpan);

  const preparedRows = rows.map((row, i) => {
    prepareRow(row);
    return spanRow(row, i);
  });

  const classes = useStyles();

  return (
    <div>
      <CssBaseline />

      <MaUTable className={classes.table} {...getTableProps()} size="small">
        <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell key={column.id} {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
        {preparedRows.map((row, i) => (
          <TableRow {...row.getRowProps()}>
            {row.cells.map(cell => {
              if (cell.isRowSpanned) return null;

              return (
                <TableCell className={classes.td} key={row.id} rowSpan={cell.rowSpan} {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
        </TableBody>

        {config.total && (
          <TableFooter>
          {footerGroups.map(group => (
            <TableRow {...group.getFooterGroupProps()}>
              {group.headers.map(column => (
                <TableCell {...column.getFooterProps()}>{column.render("Footer")}</TableCell>
              ))}
            </TableRow>
          ))}
          </TableFooter>
        )}
      </MaUTable>
    </div>
  );
}
