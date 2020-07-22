import React from 'react';
import ReactDOM from 'react-dom';

import ReactTable from './tables/react-table'
import MaterialTable from "./tables/material-table";

ReactDOM.render(
  <React.StrictMode>
    <ReactTable />
    <hr />
    <MaterialTable />
  </React.StrictMode>,
  document.getElementById('root')
);
