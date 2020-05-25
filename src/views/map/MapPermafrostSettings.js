import React, {Component} from 'react';
import { connect } from "react-redux";
import {ToastsContainer, ToastsStore} from 'react-toasts'
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/MapSettingsReduxMappings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSave, faSearch } from '@fortawesome/free-solid-svg-icons'
import mapSettingsService from './map/MapSettingsService'
import mapDataService from '../../services/MapDataService'

class MapPermafrostSettingsClass extends Component {
    constructor(props) {
        super(props)

        this.handleLatitudeChange = this.handleLatitudeChange.bind(this)
        this.handleLongitudeChange = this.handleLongitudeChange.bind(this)
        this.handleZoomChange = this.handleZoomChange.bind(this)
        this.save = this.save.bind(this)
        this.searchAddress = this.searchAddress.bind(this)
        this.handleOpacityChange = this.handleOpacityChange.bind(this)

        library.add(faSave);
        library.add(faSearch);
    }

    save(e) {
        let promiseSaveCoordinates = mapSettingsService.saveCoordinates(this)
        let promiseSaveOpacity = mapDataService.updateSettings([{
            category: 'opacity',
            value: String(this.props.mapsSettings.opacity),
            type: 'float'
        }])

        let chainOfPromises = [promiseSaveCoordinates, promiseSaveOpacity]
        for(let overlyMap of this.props.mapsSettings.overlyMaps) {
            let promise = mapDataService.updateActiveOverlyMaps(overlyMap)
            chainOfPromises.push(promise)
        }

        Promise.all(chainOfPromises).then(([resSaveCoordinates, resSaveOpacity]) => {
            ToastsStore.success("Saved")
        })
    }

    searchAddress(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            search: !this.props.mapsSettings.search
        })
    }

    handleLatitudeChange(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            lat: e.target.value
        })
    }

    handleLongitudeChange(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            lng: e.target.value
        })
    }

    handleZoomChange(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            zoom: e.target.value
        })
    }

    handleOpacityChange(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            opacity: e.target.value
        })
    }

    valueOrEmpty(value) {
        return value != null ? value : '';
    }

    render() {
        return (
            <div className='center-group'>
                <div>
                    {this.props.mapsSettings.search}
                    <span className='center-left-margin'>Lat:</span>
                    <input className='center-input' type="number" value={this.valueOrEmpty(this.props.mapsSettings.lat)} onChange={this.handleLatitudeChange}/>
                    <span className='center-left-margin'>Lng:</span>
                    <input className='center-input' type="number" value={this.valueOrEmpty(this.props.mapsSettings.lng)} onChange={this.handleLongitudeChange}/>
                    <span className='center-left-margin'>Zoom:</span>
                    <input className='center-zoom' type="number" value={this.valueOrEmpty(this.props.mapsSettings.zoom)} onChange={this.handleZoomChange} disabled={true}/>
                    <span className='marker-left-margin'>Opacity:</span>
                    <input className='marker-input' type="number" value={this.valueOrEmpty(this.props.mapsSettings.opacity)} onChange={this.handleOpacityChange} min="0" max="1" step="0.01"/>
                    <button className='center-update-button' onClick={this.save}
                            data-toggle="tooltip" data-placement="bottom"
                            title="Save the coordinates to the database">
                        <FontAwesomeIcon icon="save"/>
                    </button>
                    <button className='search-off' onClick={this.searchAddress}
                            data-toggle="tooltip" data-placement="bottom"
                            title="Enable/disable search by address or postal code.">
                        <FontAwesomeIcon icon="search"/>
                    </button>
                </div>
                <ToastsContainer store={ToastsStore}/>
            </div>
        );
    }
}

const MapPermafrostSettings = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostSettingsClass);
export default MapPermafrostSettings;

