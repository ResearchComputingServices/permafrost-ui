import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import Grid from '../../common/Grid'

class MapTimeTemperatureDataViewerGrid extends Component {
    render() {
        return (
            <Grid
                rows={this.props.mapsSettings.observationsGroundTemperature}
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
                        Header: 'Aggregate',
                        accessor: 'agg_avg',
                        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
                        width: 100
                    },
                    {
                        Header: 'Time',
                        accessor: 'time', // String-based value accessors!
                        width: 250
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

export default connect(mapStateToProps, mapDispatchToProps)(MapTimeTemperatureDataViewerGrid);

