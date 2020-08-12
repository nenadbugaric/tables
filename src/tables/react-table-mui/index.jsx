import React from "react";
import {useTable, useSortBy, useColumnOrder} from "react-table";
import {useTotals} from './useTotals';

import MaUTable from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import {TableContainer} from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import CssBaseline from '@material-ui/core/CssBaseline'
import makeStyles from '@material-ui/core/styles/makeStyles';

import SortIcon from '@material-ui/icons/Sort';

import ContextMenu from './ContextMenu';

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
        enableRowSpan: true,
        disableSortBy: true,
      },
      {
        Header: "Charge code,number",
        accessor: "chargeCode",
        enableRowSpan: true,
        disableSortBy: true
      },
      {
        Header: "Price type code, name",
        accessor: "priceType",
        enableRowSpan: true,
        disableSortBy: true
      },
      {
        Header: "PK1",
        accessor: "pk1",
        enableTotal: true,
      },
      {
        Header: "PK2",
        accessor: "pk2",
      },
      {
        Header: "Total",
        isTotal: true,
        id: 'total',
        accessor: (row) => {
          const columnsToInclude = ["pk1", "pk2"];
          return columnsToInclude.reduce((sum, column) => row[column] + sum, 0);
        },
        enableTotal: true,
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
    spanRow,
    state,
    columns: finalColumns,
    setColumnOrder
  } = useTable({
    columns,
    data,
    initialState: {
      totals: {
        config: {
          0: ['sum', 'count'],
          1: ['sum'],
          2: ['sum', 'avg', 'count'],
        },
        order: [0, 1, 2]
      },
      columnOrder: columns.map(column => column.id || column.accessor)
    }
  }, useColumnOrder, useSortBy, useTotals);

  const preparedRows = rows.map((row, i) => {
    prepareRow(row);
    return spanRow(row, i);
  });

  const isTableSorted = finalColumns.some(column => column.isSorted);

  const classes = useStyles();

  const moveRight = () => {
    const last = state.columnOrder.pop();
    setColumnOrder([last, ...state.columnOrder])
  }

  const moveLeft = () => {
    const [first, ...rest] = state.columnOrder;
    setColumnOrder([...rest, first])
  }

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
                      key={column.id} {...column.getHeaderProps()}>
                      <ContextMenu
                        items={[{
                          label: 'Move Right',
                          onClick: moveRight
                        }, {
                          label: 'Move Left',
                          onClick: moveLeft
                        }]}
                      >
                      {column.render("Header")}
                        {' '}
                        {column.canSort && <SortIcon onClick={column.getSortByToggleProps()?.onClick}  />}
                      {/*<span>*/}
                      {/*  {column.isSorted*/}
                      {/*    ? column.isSortedDesc*/}
                      {/*      ? ' 🔽'*/}
                      {/*      : ' 🔼'*/}
                      {/*    : ''}*/}
                      {/*</span>*/}
                      </ContextMenu>
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
                         totals={state.totals}/>
              </React.Fragment>
            ))}
          </TableBody>
        </MaUTable>
      </TableContainer>
    </div>
  );
}

const getAggColumns = (rows, rowIndex, cells, totals) => {
  const nextRowCells = rows[rowIndex + 1]?.cells;
  const configColumnsToAggregate = totals.order;

  const rowColumnsToAggregate = configColumnsToAggregate
    .map(columnIndex => (
      cells[columnIndex]?.isRowSpanned && !nextRowCells?.[columnIndex]?.isRowSpanned
      || !cells[columnIndex]?.isRowSpanned && !nextRowCells?.[columnIndex]?.isRowSpanned
        ? columnIndex
        : null
    ))
    .filter(ind => ind !== null);

  if (!rowColumnsToAggregate.length || !configColumnsToAggregate.some(ind => rowColumnsToAggregate.includes(ind))) return null;
  // console.log('rowColumnsToAggregate inner: ', rowColumnsToAggregate)
  return configColumnsToAggregate.filter(ind => rowColumnsToAggregate.includes(ind)).sort((a, b) => b - a);
};

const AggRows = ({cells, rows, totals, rowIndex, isTableSorted}) => {
  if (isTableSorted) return null;

  const rowColumnsToAggregateDesc = getAggColumns(rows, rowIndex, cells, totals);
  if (!rowColumnsToAggregateDesc) return null;

  // console.log('rowColumnsToAggregateDesc: ', rowColumnsToAggregateDesc);

  return (
    rowColumnsToAggregateDesc.map(cellAggIndex => (
      totals.config[cellAggIndex].map(aggFunc => (
        <TableRow key={aggFunc}>
          {cells.map((cell, columnIndex) => {
            if (columnIndex < cellAggIndex) {
              return <TableCell key={cell.column.id}></TableCell>;
            }

            const minRow = cell?.min || 0;
            const aggRows = rows.slice(minRow, rowIndex + 1);

            return (
              <TableCell key={cell.column.id} style={{backgroundColor: '#e0f5ff', color: '#404040', fontWeight: 800}}>
                {aggFunc === 'sum' && cellAggIndex === columnIndex && 'Total'}
                {aggFunc === 'count' && cellAggIndex === columnIndex && 'Count'}
                {aggFunc === 'avg' && cellAggIndex === columnIndex && 'Average'}

                {cellAggIndex !== columnIndex && cell.column.enableTotal && aggFunc === "sum" && columnSum(cell.column.id, aggRows)}
                {cellAggIndex !== columnIndex && cell.column.enableTotal && aggFunc === "avg" && columnAvg(cell.column.id, aggRows)}
                {cellAggIndex !== columnIndex && cell.column.enableTotal && aggFunc === "count" && aggRows.length}
              </TableCell>
            )
          })}
        </TableRow>
      ))
    )));
}
