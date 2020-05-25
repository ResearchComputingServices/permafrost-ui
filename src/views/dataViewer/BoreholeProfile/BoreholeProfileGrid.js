import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import Grid from '../../common/Grid'

class BoreholeProfileGrid extends Component {
    render() {
        return (
            <Grid
                rows={this.props.mapsSettings.depthOnlyObservations}
                columns={[
                    {
                        Header: 'From',
                        accessor: 'from',
                        Cell: props => <span className='number'>{props.value}</span>,
                        width: 100
                    },
                    {
                        Header: 'To',
                        accessor: 'to',
                        Cell: props => <span className='number'>{props.value}</span>,
                        width: 100
                    },
                    {
                        Header: 'Label',
                        accessor: 'label',
                        width: 200
                    },
                    {
                        Header: 'Numeric',
                        accessor: 'numeric_value',
                        Cell: props => <span className='number'>{props.value}</span>,
                        width: 100
                    },
                    {
                        Header: 'Text',
                        accessor: 'text_value',
                        width: 100
                    }
                ]}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoreholeProfileGrid);

