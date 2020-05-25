/**
 * Map Marker Service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import mapDataService from '../../../services/MapDataService'

class MapSettingsServiceClass {

  getCategory(category, data)  {
    let value = null
    for(let index = 0; index < data.length; index++) {
        if(category === data[index].category) {
            switch(data[index].type) {
                case 'float':
                    value = parseFloat(data[index].value)
                    break;
                case 'integer':
                    value = parseInt(data[index].value)
                    break;
                default:
                    value = data[index].value
                    break;
            }
            break
        }
    }
    return value
  }

  loadSettings(mapContainer) {
    let me = this
    mapDataService.getSettings().then(data => {
        if(data && data.length > 0) {
            mapContainer.props.updateMapsSettings({
               ...mapContainer.props.mapsSettings,
               settings: data,
               lat: me.getCategory('lat', data),
               lng: me.getCategory('lng', data),
               zoom: me.getCategory('zoom', data),
               opacity: me.getCategory('opacity', data),
               settingsLoaded: true
            })
        }
    })
  }

    saveCoordinates(mapContainer) {
        mapContainer.props.updateMapsSettings({
           ...mapContainer.props.mapsSettings,
           loading: true
        })
        let latPromise = mapDataService.updateSettings([{
            category: 'lat',
            value: String(mapContainer.props.mapsSettings.lat),
            type: 'float'
        }])
        let lngPromise = mapDataService.updateSettings([{
            category: 'lng',
            value: String(mapContainer.props.mapsSettings.lng),
            type: 'float'
        }])
        let zoomPromise = mapDataService.updateSettings([{
            category: 'zoom',
            value: String(mapContainer.props.mapsSettings.zoom),
            type: 'integer'
        }])

        return Promise.all([latPromise, lngPromise, zoomPromise]).then(() => {
                mapContainer.props.updateMapsSettings({
                   ...mapContainer.props.mapsSettings,
                   loading: false
                })
        })
    }
}

// Instantiate one class item and only one
const mapSettingsService = new MapSettingsServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapSettingsService)

// Export the instance as a service. This acts like a singleton.
export default mapSettingsService


