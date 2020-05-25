/**
 * Redux Mappings
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import { updateMapsSettings } from '../../redux/actions/mapsActions'

export const mapStateToProps = state => {
    return {
        mapsSettings: state.maps.mapsSettings
    };
};

export function mapDispatchToProps(dispatch) {
  return {
    updateMapsSettings: payload => dispatch(updateMapsSettings(payload))
  };
}
