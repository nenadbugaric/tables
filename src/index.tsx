import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import RcTable from "./tables/rc-table";
import ReactTable from './tables/react-table'
import MaterialTable from "./tables/material-table";
import MaterialUITable from "./tables/material-ui-table";
import ReactTableMaterial from "./tables/react-table-mui";

const Section = styled.section`
    margin-bottom: 50px;
    padding-bottom: 50px;
    border-bottom: 1px dotted rgba(0,0,0, .5);
`;

const Title = styled.h2`
    font-weight: 400;
`;

ReactDOM.render(
    <React.StrictMode>
        <Section>
            <Title>React Table + Material UI</Title>
            <ReactTableMaterial/>
        </Section>

        <Section>
            <Title>React Table</Title>
            <ReactTable/>
        </Section>

        <Section>
            <Title>RC Table</Title>
            <RcTable/>
        </Section>

        <Section>
            <Title>Material UI Table</Title>
            <MaterialUITable/>
        </Section>

        <Section>
            <Title>Material-Table</Title>
            <MaterialTable/>
        </Section>
    </React.StrictMode>
    ,
    document.getElementById('root')
);
