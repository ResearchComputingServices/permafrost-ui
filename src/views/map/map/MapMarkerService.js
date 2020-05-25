/**
 * Map Marker Service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import React, {Component} from 'react'
import { Marker, Popup } from 'react-leaflet'
import permafrostDataService from '../../../services/PermafrostDataService'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FileSaver from 'file-saver';

class MapMarkerServiceClass extends Component {
  constructor(props) {
    super(props)
    library.add(faEye);
    library.add(faDownload);
  }

  loadMarkers(mapContainer) {
    let namePattern = mapContainer.props.mapsSettings.namePattern ? mapContainer.props.mapsSettings.namePattern : 'NGO*'
    mapContainer.props.updateMapsSettings({
       ...mapContainer.props.mapsSettings,
        loading: true,
        namePattern: namePattern
    })
    return permafrostDataService.getLocationsOfObservations(namePattern).then(data => {
        mapContainer.props.updateMapsSettings({
           ...mapContainer.props.mapsSettings,
            markers: data,
            markersLoaded: true,
        })
        if(data && data.length > 0) {
            mapContainer.props.updateMapsSettings({
               ...mapContainer.props.mapsSettings,
                currentObservation: data[0].text,
                loading: false
            })
        }
    })
  }

  onViewObservation(mapContainer, marker) {
    mapContainer.props.updateMapsSettings({
        ...mapContainer.props.mapsSettings,
        currentObservation: marker.text,
        observationsGroundTemperatureLoaded: false,
        loading: true
    })
    mapContainer.props.history.push('/observations')
  }

  onDownloadObservation(mapContainer, marker) {
    let location = marker.text
    mapContainer.props.updateMapsSettings({
        ...mapContainer.props.mapsSettings,
        loading: true
    })
    permafrostDataService.fileDownloadObservationTimeTemperature(location).then(response => {
        if(response && response.status === 200) {
            console.log(response.data)
            this.setState({text:response.data})
            const blob = new Blob([response.data], {
              type: 'application/txt',
            });
            FileSaver.saveAs(blob, location + '.txt');
        }
        mapContainer.props.updateMapsSettings({
            ...mapContainer.props.mapsSettings,
            loading: false
        })
    })
  }

  displayMarkers = (mapContainer) => {
    if(!mapContainer.props.mapsSettings.markers) {
        return null
    }
    return mapContainer.props.mapsSettings.markers.map((marker, index) => {
      return <Marker key={index} id={index} position={[
       marker.lat,
       marker.lng
     ]}
     onMousemove = { mapContainer.onMousemove }>
        <Popup>
            <div>{marker.text}</div>
            <div>Lat:{marker.lat}</div>
            <div>Lng:{marker.lng}</div>
            <button className='marker-left-margin' onClick={() => this.onViewObservation(mapContainer, marker)}
                    data-toggle="tooltip" data-placement="bottom"
                    title="View observation as a time series">
                <FontAwesomeIcon icon="eye"/>
            </button>
            <button className='marker-left-margin' onClick={() => this.onDownloadObservation(mapContainer, marker)}
                    data-toggle="tooltip" data-placement="bottom"
                    title="Download observation as a comma separated file">
                <FontAwesomeIcon icon="download"/>
            </button>
        </Popup>
     </Marker>
    })
  }

}

// Instantiate one class item and only one
const mapMarkerService = new MapMarkerServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapMarkerService)

// Export the instance as a service. This acts like a singleton.
export default mapMarkerService

