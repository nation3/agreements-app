import React from 'react';

import { Table } from '../../src/components/table';

export default {
    title: 'Organisms/Table',
    component: Table,
}

const columns = ["account", "amount", "organization"];
const data = [
    ["vitalik.eth", "6.9", "Ethereum Foundation"],
    ["luisc.eth", "4.2", "Aragon"],
    ["gallego.eth", "3.14", "Solar Guild"]
];

const Template = (args) => <Table {...args}/>;

export const Example = Template.bind({});

Template.args = {
    data: data,
    columns: columns
}
