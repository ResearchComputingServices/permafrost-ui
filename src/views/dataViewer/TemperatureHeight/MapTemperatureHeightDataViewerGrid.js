import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import Grid from '../../common/Grid'

class MapTemperatureHeightDataViewerGrid extends Component {
    render() {
        return (
            <Grid
                rows={this.props.mapsSettings.observationsGroundThermalRegime}
                columns={[
                    {
                        Header: 'Location Name',
                        accessor: 'loc_name', // String-based value accessors!
                        width: 200
                    },
                    {
                        Header: 'Height',
                        accessor: 'height',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 100
                    },
                    {
                        Header: 'Min',
                        accessor: 'min',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 100
                    },
                    {
                        Header: 'Max',
                        accessor: 'max',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 100
                    },
                    {
                        Header: 'Average',
                        accessor: 'average_value',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 150
                    },
                    {
                        Header: 'Count',
                        accessor: 'cnt',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 75
                    }
                ]}
                sorted={[{
                    id: 'loc_name',
                    desc: false
                }]}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapTemperatureHeightDataViewerGrid);

