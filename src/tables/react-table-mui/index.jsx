import React from "react";
import {useTable, useSortBy} from "react-table";
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
  },
  total: {
    backgroundColor: '#e0f5ff',
    color: '#404040',
    fontWeight: 800
  }
});

const columnSum = (column, rows) => rows.reduce((sum, row) => sum + row.values?.[column], 0);
const columnAvg = (column, rows) => columnSum(column, rows) / rows.length;

export default function ReactTableMaterial() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Charge name",
        accessor: 'chargeName',
        enableRowSpan: true
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
      },
      {
        Header: "Total",
        isTotal: true,
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

  const instance = useTable({
    columns,
    data,
    initialState: {
      aggregations: {
        0: ['sum', 'count'],
        1: ['sum'],
        2: ['sum', 'avg', 'count'],
      }
    }
  }, useSortBy, useRowSpan);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    spanRow,
    state,
    columns: finalColumns
  } = instance;

  const preparedRows = rows.map((row, i) => {
    prepareRow(row);
    return spanRow(row, i);
  });

  const isTableSorted = finalColumns.some(column => column.isSorted);

  const classes = useStyles();

  return (
    <div>
      <CssBaseline/>

      <TableContainer>
        <MaUTable className={classes.table} {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const style = column.isTotal
                    ? classes.total
                    : classes.td;

                  return (
                    <TableCell
                      className={style}
                      key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {preparedRows.map((row, i) => (
              <React.Fragment key={row.id}>
                <TableRow {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    const style = cell.column.isTotal
                      ? classes.total
                      : classes.td;

                    if (!isTableSorted && cell.isRowSpanned) {
                      return <TableCell className={classes.td} key={cell.column.id}></TableCell>
                    }

                    return (
                      <TableCell className={style} key={cell.column.id}
                                 rowSpan={cell.rowSpan} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>

                <AggRows rowIndex={i} cells={row.cells} rows={rows} isTableSorted={isTableSorted}
                         aggregations={state.aggregations}/>
              </React.Fragment>
            ))}
          </TableBody>
        </MaUTable>
      </TableContainer>
    </div>
  );
}

const getAggColumns = (rows, rowIndex, cells, aggregations) => {
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

  return [...rowColumnsToAggregate].sort((a, b) => b - a);
};

const AggRows = ({cells, rows, aggregations, rowIndex, isTableSorted}) => {
  if (isTableSorted) return null;

  const rowColumnsToAggregateDesc = getAggColumns(rows, rowIndex, cells, aggregations);
  if (!rowColumnsToAggregateDesc) return null;

  return (
    rowColumnsToAggregateDesc.map(cellAggIndex => (
      aggregations[cellAggIndex].map(aggFunc => (
        <TableRow key={aggFunc}>
          {cells.map((cell, columnIndex) => {
            if (columnIndex < cellAggIndex) {
              return <TableCell key={cell.column.id}></TableCell>;
            }

            const minRow = cell?.min || 0;
            const aggRows = rows.slice(minRow, rowIndex + 1);

            return (
              <TableCell key={cell.column.id}
                         style={{backgroundColor: '#e0f5ff', color: '#404040', fontWeight: 800}}>
                {aggregations[cellAggIndex] && aggFunc === 'sum' && cellAggIndex === columnIndex && 'Total'}
                {aggregations[cellAggIndex] && aggFunc === 'count' && cellAggIndex === columnIndex && 'Count'}
                {aggregations[cellAggIndex] && aggFunc === 'avg' && cellAggIndex === columnIndex && 'Average'}

                {aggregations[cellAggIndex] && cell.column.agg && aggFunc === "sum" && columnSum(cell.column.id, aggRows)}
                {aggregations[cellAggIndex] && cell.column.agg && aggFunc === "avg" && columnAvg(cell.column.id, aggRows)}
                {aggregations[cellAggIndex] && cell.column.agg && aggFunc === "count" && aggRows.length}
              </TableCell>
            )
          })}
        </TableRow>
      ))
    )));
}
