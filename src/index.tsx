import React from 'react';
import ReactDOM from 'react-dom';

import ReactTable from './tables/react-table'
import MaterialTable from "./tables/material-table";
import MaterialUITable from "./tables/material-ui-table";

ReactDOM.render(
  <React.StrictMode>
    <ReactTable />
    <hr />

    <MaterialUITable />
    <hr />

    <MaterialTable />
  </React.StrictMode>,
  document.getElementById('root')
);
