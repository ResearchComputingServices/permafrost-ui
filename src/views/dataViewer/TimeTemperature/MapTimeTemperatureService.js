import React from 'react';
import permafrostDataService from '../../../services/PermafrostDataService';
import MapTimeTemperatureDataViewerGrid from './MapTimeTemperatureDataViewerGrid';
import MapTimeTemperatureLineChart from './MapTimeTemperatureLineChart';
import * as _ from 'lodash';
import Placeholder from '../../common/Placeholder';

const moment = require('moment');

class MapTimeTemperatureServiceClass {
    init(container) {
        if (container.props.mapsSettings.loading === true) {
            container.props.updateMapsSettings({
                ...container.props.mapsSettings,
                observationsGroundTemperature: []
            });
        }
    }

    iterable(items) {
        return (items === undefined) ? [] : items;
    }

    getDataItem(dataItems, height) {
        let item = null;
        for (const dataItem of this.iterable(dataItems)) {
            if (height === dataItem.name) {
                item = dataItem;
                break;
            }
        }
        return item;
    }

    getData(heights, observationsGroundTemperature) {
        const dataItems = [];
        for (const height of this.iterable(heights)) {
            const item = { name: height.height.toString(), data: {} };
            dataItems.push(item);
        }
        for (const observation of this.iterable(observationsGroundTemperature)) {
            const item = this.getDataItem(dataItems, observation.height.toString());
            if (item) {
                const date = moment(observation.time).format('YYYY-MM-DD');
                const temperature = _.round(observation.agg_avg, 2).toFixed(2);
                item.data[date] = temperature;
            }
        }
        return dataItems;
    }

    getChart(container) {
        const mapsSettings = container.props.mapsSettings;
        const observationsGroundTemperature = mapsSettings.observationsGroundTemperature;
        let timeTemperatureChart = null;
        if (observationsGroundTemperature) {
            const dimensions = container.getWindowDimensions();
            const height = `${dimensions.height * 0.65}px`;

            if (!mapsSettings.loading) {
                const heights = mapsSettings.observationsGroundTemperatureItemsHeight;
                const data = this.getData(heights, observationsGroundTemperature);
                timeTemperatureChart = <MapTimeTemperatureLineChart data = {data}
                    height = {height}
                    xmin = {this.getXMin(container, data)}
                    xmax = {this.getXMax(container, data)}
                    xtitle = 'Time'
                    ytitle = 'Temperature'
                />;
            }
        }
        return timeTemperatureChart;
    }

    getXMin(container, data) {
        const min = container.props.mapsSettings.startDateTimeTemperature;
        if (!min && data && data.length > 0) {
            const dateArray = Object.keys(data[0].data);
            const date = new Date(dateArray[0]);
            var stringDate = date.toLocaleDateString();
            container.props.updateMapsSettings({
                ...container.props.mapsSettings,
                startDateTimeTemperature: date
            });
        }
        return min || stringDate;
    }

    getXMax(container, data) {
        const max = container.props.mapsSettings.endDateTimeTemperature;
        if (!max && data && data.length > 0) {
            const dateArray = Object.keys(data[0].data);
            const date = new Date(dateArray[dateArray.length - 1]);
            var stringDate = date.toLocaleDateString();
            container.props.updateMapsSettings({
                ...container.props.mapsSettings,
                endDateTimeTemperature: date
            });
        }
        return max || stringDate;
    }

    load(container, currentObservation) {
        const me = container;
        const location = currentObservation || container.props.mapsSettings.currentObservation;
        container.props.updateTopNavigation({
            ...container.props.topNavigation,
            link: container.props.link
        });
        me.props.updateMapsSettings({
            ...me.props.mapsSettings,
            observationsGroundTemperature: [],
            observationsGroundTemperatureItemsCount: '',
            loading: true,
            currentObservation: location,
            startDateTimeTemperature: undefined,
            endDateTimeTemperature: undefined
        });

        permafrostDataService.getPermafrostGroundTemperaturesItemsHeight(location).then(data => {
            me.props.updateMapsSettings({
                ...me.props.mapsSettings,
                observationsGroundTemperatureItemsHeight: data
            });
        });

        return permafrostDataService.getAllPermafrostGroundTemperatures(location).then(data => {
            if (data !== undefined && data.length > 0) {
                me.props.updateMapsSettings({
                    ...me.props.mapsSettings,
                    observationsGroundTemperature: data,
                    loading: false,
                    currentObservation: location
                });
            }
        });
    }

    handleStartDateChangeTimeTemperature(container, date) {
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            startDateTimeTemperature: date
        });
    }

    handleEndDateChangeTimeTemperature(container, date) {
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            endDateTimeTemperature: date
        });
    }

    getTTChart(container, data, height) {
        const mapsSettings = container.props.mapsSettings;
        const observationsGroundThermalRegime = mapsSettings.observationsGroundThermalRegime;
        const timeTemperatureLineChart = observationsGroundThermalRegime.length > 0 ? <div className='top-margin'>
            <MapTimeTemperatureLineChart data = {data} height = {height}/>
        </div> : null;
        return timeTemperatureLineChart;
    }

    getChartWrapper(container) {
        const timeTemperatureChart = this.getChart(container);
        return (<div>
            {timeTemperatureChart}
        </div>);
    }

    render(container) {
        const observationsGroundTemperature = container.props.mapsSettings.observationsGroundTemperature;
        const observations = observationsGroundTemperature ? (<MapTimeTemperatureDataViewerGrid/>) : null;
        const chartWrapper = this.getChartWrapper(container);
        const showPlaceholder = _.isEmpty(observationsGroundTemperature) && !container.props.mapsSettings.loading;
        return (
            <div className='marker-top-margin'>
                <div className='row'>
                    <div className='col col-sm-4'>
                        {observations}
                    </div>
                    <div className='col col-sm-8'>
                        {!showPlaceholder && chartWrapper}
                        {showPlaceholder && <Placeholder message={'The selected site has no data of this type'}/>}
                    </div>
                </div>
            </div>
        );
    }
}

// Instantiate one class item and only one
const mapTimeTemperatureService = new MapTimeTemperatureServiceClass();

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapTimeTemperatureService);

// Export the instance as a service. This acts like a singleton.
export default mapTimeTemperatureService;
