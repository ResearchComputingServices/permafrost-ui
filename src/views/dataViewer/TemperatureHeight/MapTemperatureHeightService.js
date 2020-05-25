import React from 'react'
import permafrostDataService from '../../../services/PermafrostDataService'
import MapTemperatureHeightDataViewerGrid from './MapTemperatureHeightDataViewerGrid'
import MapTemperatureHeightLineChart from './MapTemperatureHeightLineChart'
import DatePicker from "react-datepicker";
import * as _ from 'lodash';
import Placeholder from '../../common/Placeholder';

var moment = require('moment')

class MapTemperatureHeightServiceClass {

    init(container) {
        container.props.updateMapsSettings({
           ...container.props.mapsSettings,
            observationsGroundThermalRegime: []
        })
    }

   getChartWrapper(container) {
        let temperatureHeightChart = this.getChart(container)
        return (<div>
                    {temperatureHeightChart}
                </div>)
   }

    load(container, currentObservation) {
        let location = currentObservation ? currentObservation : container.props.mapsSettings.currentObservation
        let date = new Date()
        let previousYearDate = new Date(date)
        previousYearDate.setFullYear(date.getFullYear() - 1)

        let startDateTemperatureHeight = container.props.mapsSettings.startDateTemperatureHeight
        let endDateTemperatureHeight = container.props.mapsSettings.endDateTemperatureHeight
        container.props.updateMapsSettings({
           ...container.props.mapsSettings,
            loading: true,
            observationsGroundThermalRegime: [],
            startDateTemperatureHeight: (startDateTemperatureHeight) ? startDateTemperatureHeight : previousYearDate,
            endDateTemperatureHeight: (endDateTemperatureHeight) ? endDateTemperatureHeight : date
        })

        let startDate = moment(container.props.mapsSettings.startDateTemperatureHeight).format("YYYY-MM-DD")
        let endDate = moment(container.props.mapsSettings.endDateTemperatureHeight).format("YYYY-MM-DD")
        return permafrostDataService.getGroundThermalRegime(location, startDate, endDate).then(data => {
            if(data !== undefined && data.length > 0) {
                container.props.updateMapsSettings({
                   ...container.props.mapsSettings,
                    observationsGroundThermalRegime: data,
                    loading: false
                })
            }
        })
    }

    render(container) {
        let observationsGroundThermalRegime = container.props.mapsSettings.observationsGroundThermalRegime
        let observations = observationsGroundThermalRegime ? (<MapTemperatureHeightDataViewerGrid/>) : null
        let chartWrapper = this.getChartWrapper(container)
        const showPlaceholder = _.isEmpty(observationsGroundThermalRegime) && !container.props.mapsSettings.loading;
        
        return (
                <div className='marker-top-margin'>
                    <div className="row">
                        <div className="col col-sm-4">
                            {observations}
                        </div>
                        <div className={'col col-sm-8'}>
                            {chartWrapper}
                            {showPlaceholder && <Placeholder message={'The selected site has no data or data are unavailable for the selected time range'} />}
                        </div>
                    </div>
                </div>
        );
    }

    iterable(items) {
        return (items === undefined) ? [] : items
    }

    getData(observationsGroundThermalRegime) {
        let dataItems = [
            { name:  "Min", data: {} },
            { name:  "Average", data: {} },
            { name:  "Max", data: {} }
        ]

        for(let item of this.iterable(observationsGroundThermalRegime)) {
            dataItems[0].data[parseFloat(item.min.toString()).toFixed(2)] = item.height
            dataItems[1].data[parseFloat(item.average_value.toString()).toFixed(2)] = item.height
            dataItems[2].data[parseFloat(item.max.toString()).toFixed(2)] = item.height
        }

        return observationsGroundThermalRegime.length > 0 ? dataItems : []
    }

    handleStartDateChangeTemperatureHeight(container, date) {
        let nextYearDate = new Date(date)
        nextYearDate.setFullYear(date.getFullYear() + 1)
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            startDateTemperatureHeight: date,
            endDateTemperatureHeight: nextYearDate
        })
    }

    handleEndDateChangeTemperatureHeight(container, date) {
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            endDateTemperatureHeight: date
        })
    }

    getTTChart(container, data, height) {
        let mapsSettings = container.props.mapsSettings
        let observationsGroundThermalRegime = mapsSettings.observationsGroundThermalRegime
        let temperatureHeightLineChart =  observationsGroundThermalRegime.length > 0 ? <div className='top-margin'>
                        <MapTemperatureHeightLineChart data = {data} height = {height}/>
                    </div> : null
        return temperatureHeightLineChart
    }

    getChart(container) {
        let mapsSettings = container.props.mapsSettings
        let observationsGroundThermalRegime = mapsSettings.observationsGroundThermalRegime
        let temperatureHeightChart = null
        if (observationsGroundThermalRegime) {
            let dimensions = container.getWindowDimensions()
            let height = dimensions.height * 0.65 + "px"

            if(!mapsSettings.loading) {
                let data = this.getData(observationsGroundThermalRegime)
                temperatureHeightChart = (<div>
                    <span>From:</span>
                    <DatePicker selected={mapsSettings.startDateTemperatureHeight} onChange={(date) => this.handleStartDateChangeTemperatureHeight(container, date)}/>
                    <span className='left-margin'>To:</span>
                    <DatePicker selected={mapsSettings.endDateTemperatureHeight} onChange={(date) => this.handleEndDateChangeTemperatureHeight(container, date)}/>
                    {this.getTTChart(container, data, height)}
                    </div>)
            }
        }
        return temperatureHeightChart
    }
}

// Instantiate one class item and only one
const mapTemperatureHeightService = new MapTemperatureHeightServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapTemperatureHeightService)

// Export the instance as a service. This acts like a singleton.
export default mapTemperatureHeightService


