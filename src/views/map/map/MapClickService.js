/**
 * Map Click Service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

class MapClickServiceClass {
  onClick = (mapContainer, event) => {
    let coordinateToUpdate = {
        ...mapContainer.props.mapsSettings,
        markerLat: event.latlng.lat,
        markerLng: event.latlng.lng,
        squareLat: event.latlng.lat,
        squareLng: event.latlng.lng,
        squareState: ''
    }

    mapContainer.props.updateMapsSettings(coordinateToUpdate)
  }
}

// Instantiate one class item and only one
const mapClickService = new MapClickServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapClickService)

// Export the instance as a service. This acts like a singleton.
export default mapClickService


