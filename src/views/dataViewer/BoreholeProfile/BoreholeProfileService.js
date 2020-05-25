import React from 'react';
import permafrostDataService from '../../../services/PermafrostDataService';
import BoreholeProfileGrid from './BoreholeProfileGrid';
import DepthOnlyObservations from './DepthOnlyObservations';
import * as _ from 'lodash';
import Placeholder from '../../common/Placeholder';

class BoreholeProfileServiceClass {
    init(container) {
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            depthOnlyObservations: []
        });
    }

    async load(container, currentObservation) {
        currentObservation = currentObservation || _.get(container, 'props.mapsSettings.currentObservation');
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            depthOnlyObservations: [],
            loading: true,
            currentObservation
        });
        const [depthOnlyObservations, depthOnlyObservationsCategories] = await Promise.all([
            permafrostDataService.getDepthOnlyObservations(currentObservation),
            permafrostDataService.getDepthOnlyObservationsCategories(currentObservation)
        ]);
        const observationsByCategoryPromise = _.map(depthOnlyObservationsCategories, (category =>
            permafrostDataService.getDepthOnlyObservationsByCategory(currentObservation, _.get(category, 'label'))
        ));
        let depthOnlyObservationsByCategory;
        if (!_.isNil(observationsByCategoryPromise)) {
            const depthOnlyObservationsByCategoryResult = await Promise.all(observationsByCategoryPromise);
            depthOnlyObservationsByCategory = depthOnlyObservationsByCategoryResult.reduce((accumulator, item, index) => {
                accumulator[depthOnlyObservationsCategories[index].label] = item;
                return accumulator;
            }, {});
        }
        container.props.updateMapsSettings({
            ...container.props.mapsSettings,
            depthOnlyObservationsByCategory: depthOnlyObservationsByCategory || {},
            depthOnlyObservationsCategories: depthOnlyObservationsCategories || [],
            depthOnlyObservations: depthOnlyObservations || [],
            loading: false,
        });
    }

    render(container) {
        const depthOnlyObservations = container.props.mapsSettings.depthOnlyObservations;
        const observations = depthOnlyObservations ? (<BoreholeProfileGrid />) : null;
        const showPlaceholder = _.isEmpty(depthOnlyObservations) && !container.props.mapsSettings.loading;

        return (
            <div className='marker-top-margin'>
                <div className='row'>
                    <div className='col col-sm-4'>
                        {observations}
                    </div>
                    <div className='col col-sm-8'>
                        {!showPlaceholder && <DepthOnlyObservations/>}
                        {showPlaceholder && <Placeholder message={'The selected site has no data of this type'}/>}
                    </div>
                </div>
            </div>
        );
    }
}

// Instantiate one class item and only one
const BoreholeProfileService = new BoreholeProfileServiceClass();

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(BoreholeProfileService);

// Export the instance as a service. This acts like a singleton.
export default BoreholeProfileService;
