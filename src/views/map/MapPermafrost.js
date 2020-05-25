/**
 * Global Air Map
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react'
import { connect } from "react-redux";
import MapContainer from './map/MapContainer'
import MapPermafrostLeftPanel from './MapPermafrostLeftPanel'
import MapPermafrostSelectionButtons from './MapPermafrostSelectionButtons'
import {ToastsContainer, ToastsStore} from 'react-toasts'
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/MapSettingsReduxMappings'

class MapPermafrostClass extends Component {

    componentDidMount() {
        this.props.updateTopNavigation({
            ...this.props.topNavigation,
            link: this.props.link
        })
        this.props.updateMapsSettings({
           ...this.props.mapsSettings,
           loading: (!this.props.mapsSettings.markersLoaded) ? true : false,
            namePattern: this.props.mapsSettings.namePattern ? this.props.mapsSettings.namePattern : 'NGO*'
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col col-sm-4">
                    <MapPermafrostLeftPanel disabled={this.props.mapsSettings.search} {...this.props}/>
                </div>
                <div className="col col-sm-8">
                    <MapPermafrostSelectionButtons/>
                    <MapContainer/>
                </div>
                <ToastsContainer store={ToastsStore}/>
            </div>
        );
    }
}

const MapPermafrost = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostClass)
export default MapPermafrost



