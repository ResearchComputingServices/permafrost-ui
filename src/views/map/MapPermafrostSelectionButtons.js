/**
 * Global Air Map
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react'
import { connect } from "react-redux"
import MapPermafrostSettings from './MapPermafrostSettings'
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/MapSettingsReduxMappings'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDrawPolygon, faCircle, faSquare, faMapMarker } from '@fortawesome/free-solid-svg-icons'
import Constants from '../../services/Constants'

class MapPermafrostSelectionButtonsClass extends Component {
    constructor(props) {
        super(props)
        this.onMarker = this.onMarker.bind(this)
        this.onSquare = this.onSquare.bind(this)
        this.getButtonStyle = this.getButtonStyle.bind(this)
        library.add(faDrawPolygon, faCircle, faSquare, faMapMarker);
    }

    componentDidMount() {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            activeEditor: Constants.ACTIVE_EDITOR_MARKER
        })
    }

    onMarker(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            activeEditor: Constants.ACTIVE_EDITOR_MARKER
        })
    }

    onSquare(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            activeEditor: Constants.ACTIVE_EDITOR_SQUARE
        })
    }

    getButtonStyle(editor) {
        if(editor === this.props.mapsSettings.activeEditor) {
            return 'active-button'
        }
        return 'inactive-button'
    }

    render() {
        return (
            <div className='row center-group'>
                <MapPermafrostSettings/>
            </div>
        );
    }
}

const MapPermafrostSelectionButtons = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostSelectionButtonsClass);
export default MapPermafrostSelectionButtons;

