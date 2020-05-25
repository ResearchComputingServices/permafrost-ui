/**
 * Overly Map Colors
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import { library } from '@fortawesome/fontawesome-svg-core';
import OverlyMapsTable from './OverlyMapsTable';
import mapImageOverlyService from '../map/MapImageOverlyService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faMinus } from '@fortawesome/free-solid-svg-icons';
import mapDataService from '../../../services/MapDataService';

class OverlyMapsClass extends Component {
    constructor(props) {
        super(props);
        library.add(faPlus, faSave, faMinus);
        this.handleOverlyMapNameChange = this.handleOverlyMapNameChange.bind(this);
        this.handleOverlyMapImageName = this.handleOverlyMapImageName.bind(this);
        this.handleOverlyMapActiveChange = this.handleOverlyMapActiveChange.bind(this);
        this.handleOverlyMapSouthWestLatChange = this.handleOverlyMapSouthWestLatChange.bind(this);
        this.handleOverlyMapSouthWestLngChange = this.handleOverlyMapSouthWestLngChange.bind(this);
        this.handleOverlyMapNorthEastLatChange = this.handleOverlyMapNorthEastLatChange.bind(this);
        this.handleOverlyMapNorthEastLngChange = this.handleOverlyMapNorthEastLngChange.bind(this);
        this.addOverlyMap = this.addOverlyMap.bind(this);
        this.updateOverlyMap = this.updateOverlyMap.bind(this);
        this.deleteOverlyMap = this.deleteOverlyMap.bind(this);
    }

    componentDidMount() {
        this.props.updateTopNavigation({
            ...this.props.topNavigation,
            link: this.props.link
        });
        mapImageOverlyService.loadOverlyMaps(this);
    }

    handleOverlyMapNameChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapName: event.target.value
        });
    }

    handleOverlyMapImageName(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapImageName: event.target.value
        });
    }

    handleOverlyMapActiveChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapActive: !this.props.mapsSettings.overlyMapActive
        });
    }

    handleOverlyMapSouthWestLatChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapSouthWestLat: event.target.value
        });
    }

    handleOverlyMapSouthWestLngChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapSouthWestLng: event.target.value
        });
    }

    handleOverlyMapNorthEastLatChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapNorthEastLat: event.target.value
        });
    }

    handleOverlyMapNorthEastLngChange(event) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMapNorthEastLng: event.target.value
        });
    }

    find(overlyMap) {
        const result = this.props.mapsSettings.overlyMaps.find(({ title }) => title === overlyMap.title);
        return (result);
    }

    preProcessOverlyMap(event) {
        const overlyMap = {
            title: this.props.mapsSettings.overlyMapName,
            south_west_lat: this.props.mapsSettings.overlyMapSouthWestLat,
            south_west_lng: this.props.mapsSettings.overlyMapSouthWestLng,
            north_east_lat: this.props.mapsSettings.overlyMapNorthEastLat,
            north_east_lng: this.props.mapsSettings.overlyMapNorthEastLng,
            image: this.props.mapsSettings.overlyMapImageName,
            active: this.props.mapsSettings.overlyMapActive
        };
        if (!this.find(overlyMap)) {
            ToastsStore.warning(`${this.props.mapsSettings.overlyMapName} does not exist!`);
            return null;
        }
        if (!this.props.mapsSettings.overlyMapName || this.props.mapsSettings.overlyMapName.trim() === '') {
            ToastsStore.warning('Name is empty!');
            return null;
        }
        return overlyMap;
    }

    addOverlyMap(event) {
        const overlyMap = {
            title: this.props.mapsSettings.overlyMapName,
            south_west_lat: this.props.mapsSettings.overlyMapSouthWestLat,
            south_west_lng: this.props.mapsSettings.overlyMapSouthWestLng,
            north_east_lat: this.props.mapsSettings.overlyMapNorthEastLat,
            north_east_lng: this.props.mapsSettings.overlyMapNorthEastLng,
            image: this.props.mapsSettings.overlyMapImageName,
            active: this.props.mapsSettings.overlyMapActive
        };
        if (this.find(overlyMap)) {
            ToastsStore.warning(`${this.props.mapsSettings.overlyMapName} already exist!`);
            return;
        }
        if (!this.props.mapsSettings.overlyMapName || this.props.mapsSettings.overlyMapName.trim() === '') {
            ToastsStore.warning('Name is empty!');
            return;
        }
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMaps: [...this.props.mapsSettings.overlyMaps, overlyMap],
            selectedOverlyMap: -1
        });
        mapDataService.addOverlyMaps(overlyMap).then(data => {
            ToastsStore.success('Saved');
        });
    }

    updateOverlyMap(event) {
        const overlyMap = this.preProcessOverlyMap();
        if (overlyMap === null) {
            return;
        }
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMaps: this.props.mapsSettings.overlyMaps.filter(item => item.title !== overlyMap.title).concat([overlyMap]),
            selectedOverlyMap: -1
        });
        mapDataService.updateOverlyMaps(overlyMap).then(data => {
            ToastsStore.success('Saved');
        });
    }

    deleteOverlyMap(event) {
        const overlyMap = this.preProcessOverlyMap();
        if (overlyMap === null) {
            return;
        }
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            overlyMaps: this.props.mapsSettings.overlyMaps.filter(item => item.title !== overlyMap.title),
            selectedOverlyMap: -1
        });
        mapDataService.deleteOverlyMaps(overlyMap).then(data => {
            ToastsStore.success('Saved');
        });
    }

    valueOrEmpty(value) {
        return value != null ? value : '';
    }

    render() {
        return (
            <div className='center-group'>
                <h4 className='headline-selector'>Overlay Maps</h4>
                <div>
                    <span className='overly-maps-left-margin'>Map Name:</span>
                    <input className='overly-maps-image-file' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapName)} onChange={this.handleOverlyMapNameChange} disabled={this.props.mapsSettings.search}/>
                    <span className='overly-maps-left-margin'>Image File:</span>
                    <input className='overly-maps-image-file' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapImageName)} onChange={this.handleOverlyMapImageName}/>
                    <input type='checkbox' className='overly-maps-active' checked = {this.valueOrEmpty(this.props.mapsSettings.overlyMapActive)} onChange={this.handleOverlyMapActiveChange}/>Active
                </div>
                <div className='overly-maps-top-margin'>
                    <span className='overly-maps-left-margin'>South West Lat:</span>
                    <input className='overly-maps-name' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapSouthWestLat)} onChange={this.handleOverlyMapSouthWestLatChange} disabled={this.props.mapsSettings.search}/>
                    <span className='overly-maps-left-margin'>South West Lng:</span>
                    <input className='overly-maps-name' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapSouthWestLng)} onChange={this.handleOverlyMapSouthWestLngChange} disabled={this.props.mapsSettings.search}/>
                    <span className='overly-maps-left-margin'>North East Lat:</span>
                    <input className='overly-maps-name' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapNorthEastLat)} onChange={this.handleOverlyMapNorthEastLatChange} disabled={this.props.mapsSettings.search}/>
                    <span className='overly-maps-left-margin'>North East Lng:</span>
                    <input className='overly-maps-name' value = {this.valueOrEmpty(this.props.mapsSettings.overlyMapNorthEastLng)} onChange={this.handleOverlyMapNorthEastLngChange} disabled={this.props.mapsSettings.search}/>
                </div>
                <div className='overly-maps-top-margin'>
                    <button className='overly-maps-left-margin' onClick={this.addOverlyMap}
                        data-toggle='tooltip' data-placement='bottom'
                        title='Add a new overly map and update the database.'>
                        <FontAwesomeIcon icon='plus'/>
                    </button>
                    <button className='overly-maps-left-margin' onClick={this.updateOverlyMap}
                        disabled={this.props.mapsSettings.selectedOverlyMap === undefined || this.props.mapsSettings.selectedOverlyMap === -1}
                        data-toggle='tooltip' data-placement='bottom'
                        title='Update all fields except Map Name, and then update the database.'>
                        <FontAwesomeIcon icon='save'/>
                    </button>
                    <button className='overly-maps-left-margin' onClick={this.deleteOverlyMap}
                        disabled={this.props.mapsSettings.selectedOverlyMap === undefined || this.props.mapsSettings.selectedOverlyMap === -1}
                        data-toggle='tooltip' data-placement='bottom'
                        title='Delete the current selected overly map and update the database.'>
                        <FontAwesomeIcon icon='minus'/>
                    </button>
                </div>
                <div className='overly-maps-top-margin'>
                    <OverlyMapsTable/>
                </div>
                <ToastsContainer store={ToastsStore}/>
            </div>
        );
    }
}

const OverlyMaps = connect(mapStateToProps, mapDispatchToProps)(OverlyMapsClass);
export default OverlyMaps;
