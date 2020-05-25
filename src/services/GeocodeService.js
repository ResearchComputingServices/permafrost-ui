/**
 * Geocode service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import Geocode from "react-geocode"
import Constants from './Constants'

class GeocodeServiceClass {
    constructor() {
        // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
        Geocode.setApiKey(Constants.GOOGLE_MAP_API_KEY);

        // Enable or disable logs. Its optional.
        Geocode.enableDebug();
    }

    getAddress(lat, lng) {
        // Get address from latitude & longitude.
        return Geocode.fromLatLng(lat, lng).then(
          response => {
            const address = response.results[0].formatted_address;
            console.log(address);
            return address
          },
          error => {
            console.error(error);
            throw error
          }
        )
    }

    getCoordinates(address) {
        // Get latitude & longitude from address.
        return Geocode.fromAddress(address).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;
            console.log(lat, lng);
            return { lat, lng }
          },
          error => {
            console.error(error);
            throw error
          }
        )
    }
}

// Instantiate one class item and only one
const geocodeService = new GeocodeServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(geocodeService)

// Export the instance as a service. This acts like a singleton.
export default geocodeService

