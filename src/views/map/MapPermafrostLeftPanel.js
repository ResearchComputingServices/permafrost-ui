import React, { Component } from 'react';
import MapPermafrostMarkers from './marker/MapPermafrostMarkers';
import Constants from '../../services/Constants';
import { faSync, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import FileSaver from 'file-saver';
import mapMarkerService from './map//MapMarkerService';
import MapPermafrostMarkersManager from './MapPermafrostMarkersManager';
import permafrostDataService from '../../services/PermafrostDataService';
import * as _ from 'lodash';

export default class MapPermafrostLeftPanel extends Component {
    constructor(props) {
        super(props);
        this.handleNamePatternChange = this.handleNamePatternChange.bind(this);
        this.reloadMarkersBasedOnNamePattern = this.reloadMarkersBasedOnNamePattern.bind(this);
        this.onDownload = this.onDownload.bind(this);
        library.add(faSync);
        library.add(faDownload);
    }

    handleNamePatternChange(e) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            namePattern: e.target.value
        });
    }

    download(locations) {
        return permafrostDataService
            .fileDownloadObservationsTimeTemperature(locations)
            .then(response => {
                if (response && response.status === 200) {
                    console.log(response.data);
                    const blob = new Blob([response.data], {
                        type: 'application/zip'
                    });
                    FileSaver.saveAs(blob, 'observations.zip');
                }
             });
    }

    onDownload() {
        const me = this;
        me.props.updateMapsSettings({
            ...me.props.mapsSettings,
            loading: true
        });
        const observations = _.get(this, 'props.mapsSettings.currentlySelectedMarkers', []);
        return this.download(observations.map(observation => observation.name))
            .then(() => {
                me.props.updateMapsSettings({
                    ...me.props.mapsSettings,
                    loading: false
                });
            });
    }

    reloadMarkersBasedOnNamePattern(e) {
        const me = this;
        mapMarkerService.loadMarkers(me).then(data => {
            me.props.updateMapsSettings({
                ...me.props.mapsSettings,
                loading: false,
                markersLoaded: false,
                currentlySelectedMarkerLat: '',
                currentlySelectedMarkerLng: '',
                currentlySelectedMarkerName: '',
                currentlySelectedMarkerElevation: '',
                currentlySelectedMarkerComment: '',
                currentlySelectedMarkerAccuracy: '',
                currentlySelectedMarkerRecordObservations: '',
                currentlySelectedMarkers: []
            });
        });
    }

    markersHaveBeenSelected() {
        const currentlySelectedMarkers = this.props.mapsSettings.currentlySelectedMarkers;
        return (currentlySelectedMarkers !== undefined && currentlySelectedMarkers.length > 0);
    }

    valueOrEmpty(value) {
        return value != null ? value : '';
    }

    renderMarkers() {
        return (
            <div>
                <div className='map-markers-table'>
                    <div className='marker-group'>
                        <h4 className='headline-selector'>Markers</h4>
                        <MapPermafrostMarkersManager/>
                        <div>
                            <span className='marker-left-margin'>Name Pattern:</span>
                            <input className='marker-name'
                                value = {this.valueOrEmpty(this.props.mapsSettings.namePattern)}
                                data-toggle='tooltip' data-placement='bottom'
                                title='Use * as a wildcard character when providing the pattern. Example: NGO*'
                                onChange={this.handleNamePatternChange}/>
                            <button className='users-left-margin' onClick={this.reloadMarkersBasedOnNamePattern}
                                data-toggle='tooltip' data-placement='bottom'
                                title='Reload observations based on the name pattern. Use * as a wildcard character when providing the pattern.'>
                                <FontAwesomeIcon icon='sync'/>
                            </button>
                            <button className='marker-left-margin' onClick={this.onDownload} disabled = {!this.markersHaveBeenSelected()}
                                data-toggle='tooltip' data-placement='bottom'
                                title='Download observations as a comma separated file'>
                                <FontAwesomeIcon icon='download'/>
                            </button>
                        </div>
                        <div className='marker-top-margin'>
                            <MapPermafrostMarkers/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderOverlyMaps() {
        return (
            <div className='map-markers-table'>
                <div className='marker-group'>
                    Overlay Maps
                </div>
            </div>
        );
    }

    render() {
        switch (this.props.mapsSettings.activeEditor) {
            case Constants.ACTIVE_EDITOR_MARKER:
                return this.renderMarkers();
            case Constants.ACTIVE_EDITOR_OVERLY_MAPS:
                return this.renderOverlyMaps();
            default:
                return this.renderMarkers();
        }
    }
}
