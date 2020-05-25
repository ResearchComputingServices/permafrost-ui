/**
 * Map Container
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, { Component } from 'react';
import { connect } from "react-redux";
import { Map, MapControl, withLeaflet, ZoomControl, LayersControl } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import mapClickService from './MapClickService';
import mapMarkerService from './MapMarkerService';
import mapSettingsService from './MapSettingsService';
import mapSquareService from './MapSquareService';
import mapImageOverlyService from './MapImageOverlyService';
import { withRouter } from 'react-router-dom';

class SearchMap extends MapControl {
    createLeafletElement() {
        return GeoSearchControl({
            provider: new OpenStreetMapProvider(),
            style: 'bar',
            showMarker: true,
            showPopup: false,
            autoClose: true,
            autoComplete: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'search',
            position: 'topleft'
        });
    }
}

class MapContainerClass extends Component {
    constructor(props) {
        super(props);
        this.onDragend = this.onDragend.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onZoomChanged = this.onZoomChanged.bind(this);
        this.onDblClick = this.onDblClick.bind(this);
        this.whenReady = this.whenReady.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onMoveEnd = this.onMoveEnd.bind(this);
    }

    async componentDidMount() {
        const mapsSettings = this.props && this.props.mapsSettings;
        await mapImageOverlyService.loadOverlyMaps(this);
        !mapsSettings.overlyMapImagesLoaded && await mapImageOverlyService.loadOverlyMapImages(this);
        !mapsSettings.settingsLoaded && await mapSettingsService.loadSettings(this);        
        !mapsSettings.markersLoaded && await mapMarkerService.loadMarkers(this);
    }

    onMoveEnd(event) {
        mapSquareService.onCoordinateChanged(this, event);
    }

    onDragend(event) {
        mapSquareService.onCoordinateChanged(this, event);
    }

    onZoomChanged(event) {
        mapSquareService.onCoordinateChanged(this, event);
    }

    onDblClick(event) {
        mapSquareService.onCoordinateChanged(this, event);
    }

    whenReady(event) {
        mapSquareService.onCoordinateChanged(this, event);
    }

    onMarkerClick = (props, marker, e) => {
        mapMarkerService.onMarkerClick(this, props, marker, e);
    }

    onClick = (event) => {
        mapClickService.onClick(this, event);
    }

    onSearch = (event) => {
        console.log('onSearch');
    }

    settingsExist() {
        return (this.props.mapsSettings.settings);
    }

    render() {
        if (!this.settingsExist()) {
            return null;
        }

        const SearchBar = withLeaflet(SearchMap)
        const fragment = this.props.mapsSettings.search ? <SearchBar {...this.props} /> : null
        return (
            <Map
                style={{ height: "1080px", width: "100%" }}
                center={[this.props.mapsSettings.lat, this.props.mapsSettings.lng]}
                zoomControl={false}
                zoom={this.props.mapsSettings.zoom}
                maxZoom={18}
                attributionControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                onDragend={this.onDragend}
                onZoom={this.onZoomChanged}
                onDblClick={!this.props.mapsSettings.search ? this.onDblClick : null}
                onClick={!this.props.mapsSettings.search ? this.onClick : null}
                whenReady={this.whenReady}
                onMoveEnd={this.onMoveEnd}
            >
                <ZoomControl position="topright" />
                <LayersControl position="topright">
                    {mapImageOverlyService.displayBaseLayer()}
                    {mapImageOverlyService.displayImageOverly(this)}
                </LayersControl>
                {fragment}
                {mapMarkerService.displayMarkers(this)}
                {mapSquareService.displaySquares(this)}
            </Map>
        );
    }
}

const MapContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MapContainerClass));
export default MapContainer;
