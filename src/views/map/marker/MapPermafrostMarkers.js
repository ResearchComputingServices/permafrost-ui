/**
 * Markers as a table. See https://www.npmjs.com/package/react-table#example
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react';
import { connect } from "react-redux";
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings'

class MapPermafrostMarkersClass extends Component {
    componentDidMount() {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            currentlySelectedMarkers: []
        })
    }

    currentlySelected(rowInfo) {
        let selected = undefined
        let currentlySelectedMarkers = this.props.mapsSettings.currentlySelectedMarkers
        if(currentlySelectedMarkers) {
            selected = currentlySelectedMarkers.find( val => val.index === rowInfo.index) !== undefined
        }
        return selected
    }

    locationItem(rowInfo) {
        return {
            index: rowInfo.index,
            name: rowInfo.row.text,
            lat: rowInfo.row.lat,
            lng: rowInfo.row.lng,
            elevation: rowInfo.row.elevation_in_metres,
            comment: rowInfo.row.comment,
            accuracy: rowInfo.row.accuracy_in_metres,
            recordObservations: rowInfo.row.record_observations,
            provider: rowInfo.row.provider
        }
    }

    toggleSelectedMarkers(rowInfo) {
        let toggledArray = [this.locationItem(rowInfo)]
        let currentlySelectedMarkers = this.props.mapsSettings.currentlySelectedMarkers
        if(currentlySelectedMarkers) {
            if (currentlySelectedMarkers.find( val => val.index === rowInfo.index) !== undefined) {
                toggledArray = currentlySelectedMarkers.filter(val => val.index !== rowInfo.index)
            } else {
                toggledArray = [...currentlySelectedMarkers, this.locationItem(rowInfo)]
            }
        }
        return toggledArray
    }

    backgroundColor(rowInfo) {
        let markers = this.props.mapsSettings.currentlySelectedMarkers
        let color = 'white'
        if (rowInfo && this.props.mapsSettings && markers) {
            if (markers.find( val => val.index === rowInfo.index) !== undefined) {
                color = '#34aeeb'
            }
        }
        return color
    }

    valueOrEmpty(selected, value) {
        return selected ? value : ''
    }

    render() {
      const columns = [{
        Header: 'Name',
        accessor: 'text', // String-based value accessors!
        width: 160
      }, {
        Header: 'Lat',
        accessor: 'lat',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        width: 75
      }, {
        Header: 'Lng',
        accessor: 'lng',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        width: 75
      }, {
        Header: 'Elevation',
        accessor: 'elevation_in_metres',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        width: 75
      }, {
        Header: 'Comment',
        accessor: 'comment',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }, {
        Header: 'Provider',
        accessor: 'provider', // String-based value accessors!
        width: 100
      }, {
        Header: 'Record Observations',
        accessor: 'record_observations',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        width: 0
      }, {
        Header: 'Accuracy in Metres',
        accessor: 'accuracy_in_metres',
        Cell: props => <span className='number'>{props.value}</span>, // Custom cell components!
        width: 0
      }]

      let me = this
      return <ReactTable
        data={this.props.mapsSettings.markers}
        columns={columns}
        defaultPageSize={20}
        sorted={[{ // the sorting model for the table
          id: 'text',
          desc: false
        }]}
        getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                if(rowInfo && rowInfo.row) {
                    me.props.updateMapsSettings({
                        ...me.props.mapsSettings,
                        lat: rowInfo.row.lat,
                        lng: rowInfo.row.lng,
                        squareLat: rowInfo.row.lat,
                        squareLng: rowInfo.row.lng,
                        currentlySelectedMarkers: me.toggleSelectedMarkers(rowInfo),
                        boundsInitialized: false
                    })
                }

                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                if (handleOriginal) {
                  handleOriginal()
                }
              },
              style: {
                background: this.backgroundColor(rowInfo),
                cursor: 'pointer',
              }
            }
          }}
      className="-striped -highlight"/>
    }
}

const MapPermafrostMarkers = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostMarkersClass);
export default MapPermafrostMarkers;

