/**
 * Overlay Maps as a table.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';

class OverlyMapsTableClass extends Component {
    componentDidMount() {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            selectedOverlyMap: -1
        });
    }

    render() {
        const columns = [{
            Header: 'Map Name',
            accessor: 'title' // String-based value accessors!
        }, {
            Header: 'Image File',
            accessor: 'image' // String-based value accessors!
        }, {
            Header: 'South West Lat',
            accessor: 'south_west_lat',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'South West Lng',
            accessor: 'south_west_lng',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'North East Lat',
            accessor: 'north_east_lat',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'North East Lng',
            accessor: 'north_east_lng',
            Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: 'Active',
            accessor: 'active',
            Cell: row => (<div>{row.value === true ? 'Yes' : 'No'}</div>)
        }];

        const me = this;
        return <ReactTable
            data={this.props.mapsSettings.overlyMaps}
            columns={columns}
            defaultPageSize={20}
            sorted={[{ // the sorting model for the table
                id: 'title',
                desc: false
            }]}
            getTdProps={(state, rowInfo, column, instance) => {
                return {
                    onClick: (e, handleOriginal) => {
                        if (rowInfo && rowInfo.row) {
                            me.props.updateMapsSettings({
                                ...me.props.mapsSettings,
                                overlyMapImageName: rowInfo.row.image,
                                overlyMapName: rowInfo.row.title,
                                overlyMapActive: rowInfo.row.active,
                                overlyMapSouthWestLat: rowInfo.row.south_west_lat,
                                overlyMapSouthWestLng: rowInfo.row.south_west_lng,
                                overlyMapNorthEastLat: rowInfo.row.north_east_lat,
                                overlyMapNorthEastLng: rowInfo.row.north_east_lng,
                                selectedOverlyMap: rowInfo.index
                            });
                        }

                        // IMPORTANT! React-Table uses onClick internally to trigger
                        // events like expanding SubComponents and pivots.
                        // By default a custom 'onClick' handler will override this functionality.
                        // If you want to fire the original onClick handler, call the
                        // 'handleOriginal' function.
                        if (handleOriginal) {
                            handleOriginal();
                        }
                    },
                    style: {
                        background: rowInfo && rowInfo.index === this.props.mapsSettings.selectedOverlyMap ? '#34aeeb' : 'white'
                    }
                };
            }}
            className='-striped -highlight'/>;
    }
}

const OverlyMapsTable = connect(mapStateToProps, mapDispatchToProps)(OverlyMapsTableClass);
export default OverlyMapsTable;
