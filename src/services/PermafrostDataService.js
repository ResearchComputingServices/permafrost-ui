/**
 * Permafrost Data from the microservice
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import axios from 'axios';
import Constants from './Constants'

class PermafrostDataServiceClass {
    getLocationsOfObservationsPerProvider(url, namePattern) {
        if (namePattern && namePattern !== '') {
            url = url + '?name_pattern=' + namePattern
        }
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getLocationsOfObservations(namePattern) {
        let location_services = Constants.LOCATION_SERVICES
        let promises = []
        for (let location_service of location_services) {
            let promise = this.getLocationsOfObservationsPerProvider(location_service.url, namePattern)
            promises.push(promise)
        }
        return Promise.all(promises).then(dataArray => {
            let result = []
            for (let data of dataArray) {
                if (data !== undefined) {
                    result = result.concat(data)
                }
            }
            return result
        })
    }

    addLocationOfObservations(data) {
        return axios.post(Constants.PERMAFROST_LOCATIONS_OF_OBSERVATIONS_URL, data)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    updateLocationOfObservations(data) {
        return axios.put(Constants.PERMAFROST_LOCATIONS_OF_OBSERVATIONS_URL, data)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    deleteLocationOfObservations(data) {
        return axios.delete(Constants.PERMAFROST_LOCATIONS_OF_OBSERVATIONS_URL, { data: data })
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getPermafrostGroundTemperatures(location, limit, offset) {
        let url = Constants.PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_URL
        url = url + "?location=" + location + "&limit=" + limit + "&offset=" + offset
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getAllPermafrostGroundTemperatures(location) {
        let url = Constants.PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_URL
        url = url + "?location=" + location
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getPermafrostGroundTemperaturesItemsCount(location) {
        let url = Constants.PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_ITEMS_COUNT_URL
        url = url + "?location=" + location
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getPermafrostGroundTemperaturesItemsHeight(location) {
        let url = Constants.PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_ITEMS_HEIGHT_URL
        url = url + "?location=" + location
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    fileDownloadObservationTimeTemperature(location) {
        return axios.get(Constants.PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATION_TT_URL + '?location=' + location, { responseType: "blob" }).then(res => {
            return res
        }).catch(function (error) {
            // handle error
            console.log(error)
        })
    }

    fileDownloadObservationsTimeTemperature(locations) {
        return axios.post(Constants.PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATIONS_TT_URL, locations, { responseType: "blob" })
            .then(res => {
                return res
            }).catch(function (error) {
                // handle error
                console.log(error)
            });
    }

    fileDownloadObservationTemperatureHeight(location, startDate, endDate) {
        return axios.get(Constants.PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATION_TH_URL + '?location=' + location + '&start_date=' + startDate + '&end_date=' + endDate, { responseType: "blob" }).then(res => {
            return res
        }).catch(function (error) {
            // handle error
            console.log(error)
        })
    }

    getGroundThermalRegime(location, startDate, endDate) {
        let url = Constants.PERMAFROST_OBSERVATIONS_GROUND_THERMAL_REGIME_URL
        url = url + "?location=" + location + "&start_date=" + startDate + "&end_date=" + endDate
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getDepthOnlyObservations(location) {
        let url = Constants.PERMAFROST_DEPTH_ONLY_OBSERVATIONS
        url = url + "?location=" + location
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getDepthOnlyObservationsByCategory(location, category) {
        let url = Constants.PERMAFROST_DEPTH_ONLY_OBSERVATIONS
        url = url + "?location=" + location
        url = url + "&category=" + category
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }

    getDepthOnlyObservationsCategories(location) {
        let url = Constants.PERMAFROST_DEPTH_ONLY_OBSERVATIONS_CATEGORIES
        url = url + "?location=" + location
        return axios.get(url)
            .then(res => {
                return res.data
            }).catch(function (error) {
                // handle error
                console.log(error)
            })
    }
}

// Instantiate one class item and only one
const permafrostDataService = new PermafrostDataServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(permafrostDataService)

// Export the instance as a service. This acts like a singleton.
export default permafrostDataService

