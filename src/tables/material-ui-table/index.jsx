import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import data from '../rows';

const useStyles = makeStyles({
  table: {
    minWidth: 900,
  },
});

export default function MaterialUiTable() {
  const classes = useStyles();

  return (
    <div>
      <h2>material UI table</h2>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Charge name</TableCell>
              <TableCell>Charge code,number</TableCell>
              <TableCell>Price type code, name</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>PK1</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.uuid}>
                <TableCell>{row.chargeName}</TableCell>
                <TableCell>{row.chargeCode}</TableCell>
                <TableCell>{row.priceType}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
                <TableCell align="right">{row.pk1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
}
