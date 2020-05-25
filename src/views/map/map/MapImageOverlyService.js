/**
 * Map Image Overly Service
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import React from 'react';
import { TileLayer, LayersControl, ImageOverlay } from 'react-leaflet';
import Constants from '../../../services/Constants';
import mapDataService from '../../../services/MapDataService';

class MapImageOverlyServiceClass {
    loadOverlyMaps(mapContainer) {
        return mapDataService.getOverlyMaps()
            .then(data => {
                mapContainer.props.updateMapsSettings({
                ...mapContainer.props.mapsSettings,
                    overlyMaps: data,
                    overlyMapsLoaded: true
                });
            })
            .catch(console.log);
    }

    loadOverlyMapImages(mapContainer) {
        const overlyMaps = mapContainer
            && mapContainer.props
            && mapContainer.props.mapsSettings
            && mapContainer.props.mapsSettings.overlyMaps;
        if (!overlyMaps) return;
        const getImagePromises = overlyMaps.map((map) => mapDataService.getOverlyMapImage(map.image));
        return Promise.all(getImagePromises).then(images => {
            const data = images.reduce((accumulator, image) => {
                const imageEntry = Object.entries(image)[0];
                if (!imageEntry) return accumulator;
                const imageName = imageEntry[0];
                const imageData = imageEntry[1];
                accumulator[imageName] = imageData;
                return accumulator;
            }, {});
            mapContainer.props.updateMapsSettings({
               ...mapContainer.props.mapsSettings,
                overlyMapImages: data,
                overlyMapImagesLoaded: true
            });
        })
        .catch(console.log);
    }

    displayBaseLayer() {
        const baseLayers = Constants.MAP_LAYERS.map((item, index) => {
            return (
                <LayersControl.BaseLayer key = {index} name={item.title} checked={item.default}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url={item.url}
                    />
                </LayersControl.BaseLayer>
            );
         })
         return baseLayers;
     }

    updateOverlyMap(mapContainer, item) {
        let overlyMaps = mapContainer.props.mapsSettings.overlyMaps
        if(overlyMaps) {
            for(let overlyMap of overlyMaps) {
                if(overlyMap.title === item.title) {
                    overlyMap.active = item.active
                    break
                }
            }
            mapContainer.props.updateMapsSettings({
               ...mapContainer.props.mapsSettings,
                overlyMaps: overlyMaps
            });
        }
    }

    onAddImageOverlay(mapContainer, item) {
        const cloneItem = Object.assign({}, item);
        cloneItem.active = true;
        this.updateOverlyMap(mapContainer, cloneItem);
    }

    onRemoveImageOverlay(mapContainer, item) {
        const cloneItem = Object.assign({}, item);
        cloneItem.active = false;
        this.updateOverlyMap(mapContainer, cloneItem);
    }

    displayImageOverly = (mapContainer) => {
        const overlyData = mapContainer.props.mapsSettings.overlyMaps;
        const overlyMapImages = mapContainer.props.mapsSettings.overlyMapImages;
        const fragment = overlyData ? overlyData.map((item, index) => {
            let bounds = [[item.south_west_lat, item.south_west_lng], [item.north_east_lat, item.north_east_lng]]
            return (
                <LayersControl.Overlay key={index} name={item.title} checked={item.active}>
                    <ImageOverlay
                        bounds={bounds} url={(overlyMapImages && overlyMapImages[item.image]) || ''} zIndex={499} style={{ zIndex: 499 }}
                        opacity={mapContainer.props.mapsSettings.opacity}
                        onAdd = {() => this.onAddImageOverlay(mapContainer, item)}
                        onRemove = {() => this.onRemoveImageOverlay(mapContainer, item)}
                    />
                </LayersControl.Overlay>
            )
        }) : null;
        return fragment;
    }
}

// Instantiate one class item and only one
const mapImageOverlyService = new MapImageOverlyServiceClass();

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(mapImageOverlyService);

// Export the instance as a service. This acts like a singleton.
export default mapImageOverlyService;
