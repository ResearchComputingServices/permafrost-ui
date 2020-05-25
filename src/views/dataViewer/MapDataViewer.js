import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import permafrostDataService from '../../services/PermafrostDataService';
import 'chart.js';
import { faSync, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import mapMarkerService from '../map/map/MapMarkerService';
import 'react-datepicker/dist/react-datepicker.css';
import FileSaver from 'file-saver';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import mapTimeTemperatureService from './TimeTemperature/MapTimeTemperatureService';
import mapTemperatureHeightService from './TemperatureHeight/MapTemperatureHeightService';
import boreholeProfileService from './BoreholeProfile/BoreholeProfileService';
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/MapSettingsReduxMappings';

const moment = require('moment');

class MapDataViewerClass extends Component {

    constructor(props) {
        super(props);
        library.add(faSync);
        library.add(faDownload);
        this.handleObservationChange = this.handleObservationChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.state = {
            file: null,
            text: null
        };
        for (const service of this.services()) {
            service.init(this);
        }
    }

    services() {
        return [mapTimeTemperatureService, mapTemperatureHeightService];
    }

    componentDidMount() {
        this.load();
    }

    handleObservationChange(event) {
        this.load(event.target.value);
    }

    onRefresh() {
        this.load();
    }

    onDownload() {
        const currentTab = this.props.mapsSettings.activeObservationTabKey;
        switch (currentTab) {
            case 'time-series':
                this.onDownloadTimeTemperature();
                break;
            case 'trumpet-curves':
                this.onDownloadTemperatureHeight();
                break;
            case 'borehole-profile':
                break;
            default:
                this.onDownloadTimeTemperature();
                break;
        }
    }

    onDownloadTimeTemperature() {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            loading: true
        });
        const location = this.props.mapsSettings.currentObservation;
        permafrostDataService.fileDownloadObservationTimeTemperature(location).then(response => {
            if (response && response.status === 200) {
                console.log(response.data);
                this.setState({ text: response.data });
                const blob = new Blob([response.data], {
                    type: 'application/txt'
                });
                FileSaver.saveAs(blob, `${location}.txt`);
            }
            this.props.updateMapsSettings({
                ...this.props.mapsSettings,
                loading: false
            });
        });
    }

    onDownloadTemperatureHeight() {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            loading: true
        });

        const location = this.props.mapsSettings.currentObservation;
        const startDateTemperatureHeight = moment(this.props.mapsSettings.startDateTemperatureHeight).format('YYYY-MM-DD');
        const endDateTemperatureHeight = moment(this.props.mapsSettings.endDateTemperatureHeight).format('YYYY-MM-DD');

        permafrostDataService.fileDownloadObservationTemperatureHeight(location, startDateTemperatureHeight, endDateTemperatureHeight).then(response => {
            if (response && response.status === 200) {
                console.log(response.data);
                this.setState({ text: response.data });
                const blob = new Blob([response.data], {
                    type: 'application/txt'
                });
                FileSaver.saveAs(blob, `${location}.txt`);
            }
            this.props.updateMapsSettings({
                ...this.props.mapsSettings,
                loading: false
            });
        });
    }

    getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    loadAll(location) {
        mapTimeTemperatureService.load(this, location).then(() => {
            mapTemperatureHeightService.load(this, location).then(() => {
                boreholeProfileService.load(this, location);
            });
        });
    }

    load(location) {
        if (this.props.mapsSettings.markersLoaded) {
            this.loadAll(location);
        } else {
            mapMarkerService.loadMarkers(this).then(data => {
                this.props.updateMapsSettings({
                    ...this.props.mapsSettings,
                    loading: false
                });
                this.loadAll(location);
            });
        }
    }

    getHeadline() {
        const mapsSettings = this.props.mapsSettings;
        let markers = mapsSettings.markers;
        let items = null;
        if (markers) {
            markers = mapsSettings.markers.sort(function(a, b) {
                const orderBool = a.name > b.name;
                return orderBool ? 1 : -1;
            });
            items = markers.map((item, index) => {
                return <option key={index} value={item.text}>{item.text}</option>;
            });
        }
        return (<div>
            <label className='mdb-main-label'>Observation:</label>
            <select className='mdb-select md-form' value={mapsSettings.currentObservation} onChange={this.handleObservationChange}>>
                {items}
            </select>
            <button className='marker-left-margin' onClick={this.onRefresh}
                data-toggle='tooltip' data-placement='bottom'
                title='Reload observation with time series'>
                <FontAwesomeIcon icon='sync'/>
            </button>
            <button className='marker-left-margin' onClick={this.onDownload}
                data-toggle='tooltip' data-placement='bottom'
                title='Download observation as a comma separated file'>
                <FontAwesomeIcon icon='download'/>
            </button>
        </div>);
    }

    onSelect(eventKey) {
        this.props.updateMapsSettings({
            ...this.props.mapsSettings,
            activeObservationTabKey: eventKey
        });
    }

    render() {
        return (
            <div className='choose-observation'>
                {this.getHeadline()}
                <Tabs mountOnEnter={true} defaultActiveKey='time-series' onSelect={k => this.onSelect(k)}>
                    <Tab disabled={this.props.mapsSettings.loading} eventKey='time-series' title='Time series'>
                        {mapTimeTemperatureService.render(this)}
                    </Tab>
                    <Tab disabled={this.props.mapsSettings.loading} eventKey='trumpet-curves' title='Trumpet curves'>
                        {mapTemperatureHeightService.render(this)}
                    </Tab>
                    <Tab disabled={this.props.mapsSettings.loading} eventKey='borehole-profile' title='Borehole profile'>
                        {!this.props.mapsSettings.loading && boreholeProfileService.render(this)}
                    </Tab>
                </Tabs>
                <ToastsContainer store={ToastsStore}/>
            </div>
        );
    }
}

const MapDataViewer = connect(mapStateToProps, mapDispatchToProps)(MapDataViewerClass);
export default MapDataViewer;
