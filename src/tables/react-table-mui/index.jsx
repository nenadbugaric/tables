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
    state,
  } = useTable({
    columns,
    data,
    initialState: {
      aggregations: {
        0: ['sum', 'count'],
        1: ['sum'],
        2: ['sum', 'count'],
      }
    }
  }, useRowSpan);

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
                  <TableCell style={{backgroundColor: '#f0f0f0', color: '#404040'}}
                             key={column.id} {...column.getHeaderProps()}>
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
                    if (cell.isRowSpanned) {
                      return <TableCell className={classes.td} key={cell.column.id}></TableCell>
                    }

                    return (
                      <TableCell className={classes.td} key={cell.column.id}
                                 rowSpan={cell.rowSpan} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>

                <AggRows rowIndex={i} cells={row.cells} rows={rows}
                         aggregations={state.aggregations}/>
              </React.Fragment>
            ))}
          </TableBody>
        </MaUTable>
      </TableContainer>
    </div>
  );
}

const AggRows = ({cells, rows, aggregations, rowIndex}) => {
  const nextRowCells = rows[rowIndex + 1]?.cells;
  const configColumnsToAggregate = Object.keys(aggregations).map(b => Number.parseInt(b, 10));

  const rowColumnsToAggregate = cells
    .map((cell, cellIndex) => (
      cell.isRowSpanned && !nextRowCells?.[cellIndex]?.isRowSpanned
        ? cellIndex
        : null
    ))
    .filter(ind => ind !== null);

  if (!rowColumnsToAggregate.length || !configColumnsToAggregate.some(ind => rowColumnsToAggregate.includes(ind))) return null;

  const rowColumnsToAggregateDesc = [...rowColumnsToAggregate].sort((a, b) => b - a);

  return (
    rowColumnsToAggregateDesc.map(cellAggIndex => (
      aggregations[cellAggIndex].map(aggFunc => (
        <TableRow key={aggFunc}>
          {cells.map((cell, columnIndex) => {
            if (columnIndex < cellAggIndex) {
              return <TableCell key={cell.column.id}></TableCell>;
            }

            const minRow = cells[cellAggIndex].column.mins[rowIndex] || 0;
            const aggRows = rows.slice(minRow, rowIndex + 1);
            // console.log(rows.slice(cells[cellAggIndex]?.mins[rowIndex]), rowIndex)

            return (
              <TableCell key={cell.column.id}
                         style={{backgroundColor: '#e0f5ff', color: '#404040', fontWeight: 800}}>
                {aggregations[cellAggIndex] && aggFunc === 'sum' && cellAggIndex === columnIndex && 'Total'}
                {aggregations[cellAggIndex] && aggFunc === 'count' && cellAggIndex === columnIndex && 'Count'}

                {aggregations[cellAggIndex] && cell.column.agg && aggFunc === "sum" && columnSum(cell.column.id, aggRows)}
                {aggregations[cellAggIndex] && cell.column.agg && aggFunc === "count" && aggRows.length}
              </TableCell>
            )
          })}
        </TableRow>
      ))
    )));
}
