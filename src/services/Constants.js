/**
 * Constants
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import ClientConfig from '../client-configurations'

let clientConfig = new ClientConfig()

// The prefix for the micro-service that facilitates the authentication
const NODE_SERVER_PREFIX_URL = clientConfig.getAuthenticationURL()

// The prefix for the micro-service global air
const PERMAFROST_API_PREFIX_URL = clientConfig.getPermafrostApi()

// The prefix for the micro-service permafrost observations
const PERMAFROST_OBSERVATIONS_PREFIX_URL = clientConfig.getPermafrostObservationsApi()

// The prefix for the micro-service permafrost observations from Compute Serve
const PERMAFROST_COMPUTE_SERVE_OBSERVATIONS_PREFIX_URL = clientConfig.getPermafrostWFSApi()

// PUBLIC
const constants = {
    // The prefix for the micro-service that facilitates the authentication
    NODE_SERVER_PREFIX_URL: NODE_SERVER_PREFIX_URL,

    // The prefix for the micro-service global air
    PERMAFROST_API_PREFIX_URL: PERMAFROST_API_PREFIX_URL,

    // This is Banner shared secret being used for any communication with the web service.
    BANNER_SHARED_SECRET_PROD: '5C2BORNOT2B24880164673C3',

    // This is the banner json url prod prefix that is used for calling the web service.
    BANNER_JSON_URL_PROD: 'https://central.carleton.ca/prod/pzpkg_intranet.banner_data_json',

    // This is the URL for getting the settings
    SETTINGS_URL: PERMAFROST_API_PREFIX_URL + '/settings',

    // This is the URL for getting the markers
    MARKERS_URL: PERMAFROST_API_PREFIX_URL + '/markers',

    // This is the URL for getting the squares
    SQUARES_URL: PERMAFROST_API_PREFIX_URL + '/squares',

    // This is the URL for getting the squares count
    SQUARES_COUNT_URL: PERMAFROST_API_PREFIX_URL + '/squares/count',

    // This is the URL for getting the squares state
    SQUARES_STATE_URL: PERMAFROST_API_PREFIX_URL + '/squares/state',

    // This is the URL for getting the colors
    COLORS_URL: PERMAFROST_API_PREFIX_URL + '/colors',

    // This is the URL for getting the overlay maps
    OVERLY_MAPS_URL: PERMAFROST_API_PREFIX_URL + '/overly_maps',

    // Upload file
    FILE_UPLOAD_URS: PERMAFROST_API_PREFIX_URL + '/file_upload',

    // Download file
    FILE_DOWNLOAD_URS: PERMAFROST_API_PREFIX_URL + '/get_file',

    // This is the URL for getting permafrost locations of observations
    PERMAFROST_LOCATIONS_OF_OBSERVATIONS_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/locations_of_observations_as_markers',

    // This is the URL for getting permafrost observations
    PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/ground_temperatures',

    // This is the URL for getting permafrost observations items count
    PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_ITEMS_COUNT_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/ground_temperatures/count',

    // This is the URL for getting permafrost observations items height
    PERMAFROST_OBSERVATIONS_GROUND_TEMPERATURES_ITEMS_HEIGHT_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/ground_temperatures/height',

    // Download an observation based on time and temperature in a text file
    PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATION_TT_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/download_observation_time_temperature',

    PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATIONS_TT_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/download_observations_time_temperature',

    // Download an observation based on temperature and height in a text file
    PERMAFROST_OBSERVATIONS_DOWNLOAD_OBSERVATION_TH_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/download_observation_temperature_height',

    // Get temperatures and heights for a certain observation
    PERMAFROST_OBSERVATIONS_GROUND_THERMAL_REGIME_URL: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/ground_thermal_regime',

    // Get depth only observations
    PERMAFROST_DEPTH_ONLY_OBSERVATIONS: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/observations/range',

    // Get depth only observations categories
    PERMAFROST_DEPTH_ONLY_OBSERVATIONS_CATEGORIES: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/observations/categories',

    // This is the URL for getting permafrost locations of observations
    PERMAFROST_COMPUTE_SERVE_LOCATIONS_OF_OBSERVATIONS_URL: PERMAFROST_COMPUTE_SERVE_OBSERVATIONS_PREFIX_URL + '/observations',

    // Top Level Links. Do not add roles if you want to be displayed regardless of the role.
    TOP_LEVEL_LINKS: [{
        path: '/',
        name: 'Maps'
    }, {
        path: '/observations',
        name: 'Observations'
    }, {
        path: '/overly-maps',
        name: 'Overlay Maps'
    }, {
        path: '/upload-and-process',
        name: 'Upload & Process',
        roles: ['Administrator', 'Contributor'],
        loggedIn: true
    }],

    // Map types
    MAP_TYPE_ROADMAP: 'ROADMAP',
    MAP_TYPE_SATELLITE: 'SATELLITE',
    MAP_TYPE_HYBRID: 'HYBRID',

    // Google map API Key
    GOOGLE_MAP_API_KEY: "AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo",

    // Google map version
    GOOGLE_MAP_VERSION: "3.30",

    // Active editor values
    ACTIVE_EDITOR_MARKER: "Markers",
    ACTIVE_EDITOR_OVERLY_MAPS: "Overlay Maps",

    MAP_LAYERS: [{
        title: "Regular", url: "//{s}.tile.osm.org/{z}/{x}/{y}.png", default: true
    }, {
        title: "Black and White", url: "tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
    }, {
        title: "Landscape", url: "//{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png"
    }, {
        title: "Cycle", url: "//{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png"
    }, {
        title: "Transport", url: "//{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png"
    }, {
        title: "Outdoors", url: "//{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
    }],

    LOCATION_SERVICES: [{
        name: 'Carleton Internal',
        url: PERMAFROST_OBSERVATIONS_PREFIX_URL + '/locations_of_observations_as_markers',
        permissions: {
            create: true,
            update: true,
            read: true,
            delete: true,
        }
    }, {
        name: 'Compute Canada WFS',
        url: PERMAFROST_COMPUTE_SERVE_OBSERVATIONS_PREFIX_URL + '/observations',
        permissions: {
            create: false,
            update: false,
            read: true,
            delete: false,
        }
    }]

}

export default constants
