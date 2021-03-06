import { useCallback } from 'react';
import { ensurePluginOrder } from 'react-table';

export const useTotals = hooks => {
  hooks.useInstance.push(useInstance);
  hooks.visibleColumns.push(visibleColumns);
}

useTotals.pluginName = 'useTotals';

function useInstance(instance) {
  const {
    plugins,
    rows,
    rowSpanEnabled = true,
    rowSpanHierarchy = true
  } = instance;

  ensurePluginOrder(plugins, ['useColumnOrder', 'useFilters', 'useSortBy'], 'useTotals');

  const spanRow = useCallback((row, i) => {
    let numCells = row.allCells.length;

    let parentBoundary = false;
    for (let j = 0; j < numCells; j++) {
      let cell = row.allCells[j];
      let column = cell.column;

      if (rowSpanEnabled && column.enableRowSpan) {
        if (
          column.topCellValue !== cell.value // we have a non-duplicate cell
          || cell.value === ""             // or we have a blank cell
          || (rowSpanHierarchy && parentBoundary) // or boundary crossed
          || column.topCellValue === null // or we are on the first row
        ) { // this is a top cell.
          if (i !== 0) {
            const prevRowIndex = row.index === (rows.length - 1)
              ? i
              : i - 1;

            rows[prevRowIndex].allCells[j].min = column.topCellIndex;
          }

          column.topCellValue = cell.value;
          column.topCellIndex = i;
          // parentBoundary = true;
          cell.isRowSpanned = false;
        } else { // cell is a duplicate and should be row-spanned.
          cell.isRowSpanned = true;
          // update the top cell. need to reach back in the array.
          /* todo
            rows[column.topCellIndex].allCells[j].rowSpan++;
            rows[column.topCellIndex].allCells[j].spannedRows.push(row);
          */
        }
      } // else rowspan disabled for this cell - do nothing.
    }

    return row;
  }, [rows, rowSpanEnabled, rowSpanHierarchy]);

  Object.assign(instance, {
    spanRow
  })
}

function visibleColumns(columns) {
  columns.forEach(column => {
    if (column.enableRowSpan) {
      column.topCellValue = null;
      column.topCellIndex = 0;
    }
  })

  return columns;
}
