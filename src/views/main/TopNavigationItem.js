/**
 * Top level navigation item.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/LoggedInUserReduxMappings';

class TopNavigationItemClass extends Component {
    enabled(item) {
        // No login, no roles - Enable
        if (!item.roles && !item.loggedIn ) {
            return true;
        }

        // Login, no role - Enable when the user is logged in
        if (!!item.loggedIn && !item.roles) {
            return !!this.props.loggedInUser.loggedInUserName;
        }

        // Login and role - Enable whether roles match
        if (!!item.loggedIn && !!item.roles) {
            if (Array.isArray(this.props.loggedInUser.loggedInUserRoles)) {
                return item.roles.some(role => this.props.loggedInUser.loggedInUserRoles.indexOf(role) >= 0); 
            }
            return false;
        }

        // Do not enable for all other cases (if any)
        return false
    }

    render() {
        const parent = this.props.parent;
        const item = this.props.item;
        const index = this.props.index;
        const jsx = this.enabled(item) ? (
            <div>
                <li key={index} className="nav-item">
                    <Link to={item.path} className={`nav-link ${parent.navStyleItem(item)}`} onClick={() => parent.clickNavigation(item)}>
                            {item.name}
                    </Link>
                </li>
            </div>
        ) : <div/>;
        return jsx;
    }
}

const TopNavigationItem = connect(mapStateToProps, mapDispatchToProps)(TopNavigationItemClass);
export default TopNavigationItem;

