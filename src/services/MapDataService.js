/**
 * Global Air Map Data from the microservice
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import axios from 'axios';
import Constants from './Constants';

class MapDataServiceClass {
    getSettings() {
        return axios.get(Constants.SETTINGS_URL)
            .then(res => res.data)
            .catch(console.log);
    }

    updateSettings(data) {
        return axios.put(Constants.SETTINGS_URL, data)
            .then(res => res.data)
            .catch(console.log);
    }

    getMarkers() {
        return axios.get(Constants.MARKERS_URL)
            .then(res => res.data)
            .catch(console.log);
    }

    addMarker(data) {
        return axios.post(Constants.MARKERS_URL, data)
            .then(res => res.data)
            .catch(console.log);
    }

    updateMarker(data) {
        return axios.put(Constants.MARKERS_URL, data)
            .then(res => res.data)
            .catch(function (error) {
                // handle error
                console.log(error)
            });
    }

    deleteMarker(data) {
        return axios.delete(Constants.MARKERS_URL, { data: data })
            .then(res => res.data)
            .catch(console.log);
    }

    getOverlyMaps() {
        return axios.get(Constants.OVERLY_MAPS_URL)
            .then(res => res.data)
            .catch(console.log);
    }

    getOverlyMapImage(name) {
        return axios.get(`${Constants.PERMAFROST_API_PREFIX_URL}/get_image?name=${name}`, { responseType: 'arraybuffer' })
            .then(res => ({ [name]: `data:image/png;base64, ${Buffer.from(res.data, 'binary').toString('base64')}` }))
            .catch(console.log);
    }

    updateOverlyMaps(data) {
        return axios.put(Constants.OVERLY_MAPS_URL, data)
            .then(res => res.data)
            .catch(console.log);
    }

    addOverlyMaps(data) {
        return axios.post(Constants.OVERLY_MAPS_URL, data)
            .then(res => res.data)
            .catch(console.log);
    }

    deleteOverlyMaps(data) {
        return axios.delete(Constants.OVERLY_MAPS_URL, { data: data })
            .then(res => res.data)
            .catch(console.log);
    }

    updateActiveOverlyMaps(data) {
        return axios.put(Constants.OVERLY_MAPS_URL + '/active', data)
            .then(res => res.data)
            .catch(console.log);
    }
}

// Instantiate one class item and only one
const mapDataService = new MapDataServiceClass();

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapDataService);

// Export the instance as a service. This acts like a singleton.
export default mapDataService;


