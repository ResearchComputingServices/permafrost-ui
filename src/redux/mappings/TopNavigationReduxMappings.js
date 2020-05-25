/**
 * Redux Mappings
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import { updateTopNavigation } from '../actions/topNavigationActions'

export const mapStateToProps = state => {
  return {
      topNavigation: state.topNavigation.topNavigation,
      loggedInUser: state.loggedInUser.loggedInUser,
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    updateTopNavigation: payload => dispatch(updateTopNavigation(payload))
  };
}
