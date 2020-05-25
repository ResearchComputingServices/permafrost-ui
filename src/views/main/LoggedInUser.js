/**
 * Logged in user.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React from 'react';
import { connect } from 'react-redux';
import { updateLoggedInUser } from '../../redux/actions/loggedInUserActions';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import keycloakService from '../../services/KeycloakService';

const mapStateToProps = state => {
    return { loggedInUser: state.loggedInUser.loggedInUser };
};

function mapDispatchToProps(dispatch) {
    return {
        updateLoggedInUser: payload => dispatch(updateLoggedInUser(payload)),
    };
}

class ConnectedLoggedInUser extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async componentDidMount() {
        await this.handleLogin();
    }

    isUserLoggedIn() {
        return this.props.loggedInUser.loggedInUserAuthenticated === true;
    }

    async handleLogin() {
        try {
            const user = await keycloakService.login();
            this.props.updateLoggedInUser({
                ...this.props.loggedInUser,
                loggedInUserAuthenticated: true,
                loggedInUserName: user.username,
                loggedInFirstName: user.firstName,
                loggedInLastName: user.lastName,
                loggedInDisplayName: `${user.firstName || ''}${user.firstName ? ` ${user.lastName}` : ` ${user.lastName}`}`,
                loggedInUserRoles: user.roles,
                loggedInUserIsAdministrator: typeof user.roles === 'object' && user.roles.includes('Administrator'),
            });
        } catch (err) {
            ToastsStore.warning('Failed to login');
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        try {
            await keycloakService.logout()
            this.props.updateLoggedInUser({
                ...this.props.loggedInUser,
                loggedInUserAuthenticated: undefined,
                loggedInUserName: undefined,
                loggedInFirstName: undefined,
                loggedInLastName: undefined,
                loggedInDisplayName: undefined,
                loggedInUserRoles: undefined,
                loggedInUserIsAdministrator: undefined,
            });
        } catch (err) {
            ToastsStore.warning('Failed to logout');
        }
    }

    render() {
        return this.isUserLoggedIn()
            ? (
                <>
                    <div>
                        <div className='logged-in-user'>        
                            <span className='mx-3'>                
                                {this.props.loggedInUser.loggedInDisplayName}
                            </span>
                            <Button
                                onClick={this.handleLogout}
                                className='active-button'
                                variant='contained'
                                size='small'
                                startIcon={<ExitToAppIcon />}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                    <ToastsContainer store={ToastsStore} />
                </>
            ) : <></>;
    }
}

const LoggedInUser = connect(mapStateToProps, mapDispatchToProps)(ConnectedLoggedInUser);
export default LoggedInUser;

