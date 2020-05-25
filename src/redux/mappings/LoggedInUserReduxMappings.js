/**
 * Redux Mappings
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import { updateLoggedInUser } from '../../redux/actions/loggedInUserActions'

export const mapStateToProps = state => {
  return { loggedInUser: state.loggedInUser.loggedInUser };
};

export function mapDispatchToProps(dispatch) {
  return {
    updateLoggedInUser: payload => dispatch(updateLoggedInUser(payload))
  };
}
