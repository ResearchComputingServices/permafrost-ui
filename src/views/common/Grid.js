import 'react-table/react-table.css';
import React, { Component } from 'react';
import ReactTable from 'react-table';
import * as _ from 'lodash';

export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            selectedItemIndex: -1
        };
    }

    onRowClick(state, rowInfo) {
        return {
            onClick: (e, handleOriginal) => {
                const index = _.get(rowInfo, 'index');
                const row = _.get(rowInfo, 'row');
                if (!_.isNil(row)) {
                    this.setState({
                        ...this.state,
                        selectedItemIndex: index === this.state.selectedItemIndex ? -1 : index
                    });
                }
                if (handleOriginal) {
                    handleOriginal();
                }
            },
            style: {
                background: _.get(rowInfo, 'index') === this.state.selectedItemIndex ? '#34aeeb' : 'white',
                cursor: 'pointer'
            }
        };
    }

    render() {
        const rows = _.get(this, 'props.rows', []);
        const columns = _.get(this, 'props.columns', []);
        const sorted = _.get(this, 'props.sorted', undefined);
        return (
            <ReactTable
                data={rows}
                columns={columns}
                sorted={sorted}
                defaultPageSize={20}
                getTdProps={this.onRowClick.bind(this)}
                className='-striped -highlight'
            />
        );
    }
}
