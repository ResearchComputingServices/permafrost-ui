/**
 * Map Square Service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import React from 'react';
import mapDataService from '../../../services/MapDataService'
import { Rectangle }  from 'react-leaflet'

class MapSquareServiceClass {
  constructor() {
    this.pageSize = 1000
  }

  loadData(container) {
    let me = this
    mapDataService.getSquares(container.props.mapsSettings.squarePage, this.pageSize,
                              container.props.mapsSettings.lngNorthEast, container.props.mapsSettings.latNorthEast,
                              container.props.mapsSettings.lngSouthWest, container.props.mapsSettings.latSouthWest).then(data => {
        container.props.updateMapsSettings({
           ...container.props.mapsSettings,
            squares: container.props.mapsSettings.squares.concat(data),
            squarePage: container.props.mapsSettings.squarePage + 1
        })
        if(container.props.mapsSettings.squarePage < container.props.mapsSettings.squareTotalPages &&
           container.props.mapsSettings.squarePage < 145) {
            me.loadData(container)
        } else {
            container.props.updateMapsSettings({
                ...container.props.mapsSettings,
                loadingSquares: false
            })
        }
    })
  }

  loadSquares(container) {
    mapDataService.getSquaresCount(container.props.mapsSettings.lngNorthEast, container.props.mapsSettings.latNorthEast,
                                   container.props.mapsSettings.lngSouthWest, container.props.mapsSettings.latSouthWest).then(data => {
        container.props.updateMapsSettings({
           ...container.props.mapsSettings,
            squaresCount: data.count,
            squares: [],
            squarePage: 0,
            squareTotalPages: Math.ceil(data.count/this.pageSize)
        })
        this.loadData(container)
    })
  }

  onCoordinateChanged(mapDataService, event) {
    mapDataService.props.updateMapsSettings({
        ...mapDataService.props.mapsSettings,
        lat: event.target.getCenter().lat,
        lng: event.target.getCenter().lng,
        zoom: event.target.getZoom(),
        lngNorthEast: event.target.getBounds().getNorthEast().lng,
        latNorthEast: event.target.getBounds().getNorthEast().lat,
        lngSouthEast: event.target.getBounds().getNorthEast().lng,
        latSouthEast: event.target.getBounds().getSouthWest().lat,
        lngSouthWest: event.target.getBounds().getSouthWest().lng,
        latSouthWest: event.target.getBounds().getSouthWest().lat,
        lngNorthWest: event.target.getBounds().getSouthWest().lng,
        latNorthWest: event.target.getBounds().getNorthEast().lat
    })
  }

  getColor(square, container) {
    let color = "#FFFFFF" // White by default
    let colors = container.props.mapsSettings.colors
    for(let index = 0; index < colors.length; index++) {
        if(square.state >=colors[index].min_state && square.state < colors[index].max_state) {
            color =  colors[index].color
            break
        }
    }
    return color
  }

  handleOnClick(container, event) {
    let lng = event.target.getCenter().lng
    let lat = event.target.getCenter().lat
    container.props.updateMapsSettings({
        ...container.props.mapsSettings,
        squareLng: lng,
        squareLat: lat,
        squareState: ''
    })
    mapDataService.getSquaresState(lng, lat).then(data => {
        if(data && data.length > 0) {
            container.props.updateMapsSettings({
               ...container.props.mapsSettings,
                squareState: data[0].state
            })
        }
    })
  }

  displaySquares = (container) => {
    let me = this
    if(!container.props.mapsSettings.squares) {
        return null
    }
    return container.props.mapsSettings.squares.map(function(square, index) {
      const bounds = [
                        [square.top_right_lat, square.top_right_lng],
                        [square.bottom_left_lat, square.bottom_left_lng]
                    ]
      return <Rectangle bounds={bounds} color={me.getColor(square, container)}
                        weight={0}
                        fillOpacity={container.props.mapsSettings.opacity}
                        onClick={ (e) => me.handleOnClick(container, e) }
            />
    })
  }
}

// Instantiate one class item and only one
const mapSquareService = new MapSquareServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapSquareService)

// Export the instance as a service. This acts like a singleton.
export default mapSquareService


