import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import MainDelimiter from './MainDelimiter';
import CarletonBanner from './CarletonBanner';
import linksServices from '../../services/LinksServices';
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/TopNavigationReduxMappings';
import LoggedInUser from './LoggedInUser';
import TopNavigationItem from './TopNavigationItem';
import TopNavigationLoading from './TopNavigationLoading';

class TopNavigationClass extends Component {
    constructor(props) {
        super(props);
        this.props.updateTopNavigation({
            ...this.props.topNavigation,
            link: linksServices.getCurrentLink()
        });
    }

    clickNavigation(item) {
        this.props.updateTopNavigation({
            ...this.props.topNavigation,
            link: item
        });
    }

    navStyleItem(item) {
        if (this.props.topNavigation.link && item.name === this.props.topNavigation.link.name) {
            return 'top-nav-selected-item'
        }
        return 'top-nav-item'
    }

    userIsLoggedIn() {
        return this.props.loggedInUser.loggedInUserAuthenticated === true;
    }

    render() {
        return (
            <div>
                {
                    this.userIsLoggedIn() && <CarletonBanner />
                }
                <LoggedInUser />
                {
                    this.userIsLoggedIn() &&
                    <Router>
                        <div className='top-nav' >
                            <ul className='nav nav-tabs' id='myTab' role='tablist'>
                                {linksServices.links.map((item, index) => (
                                    <TopNavigationItem key={index} index={index} item={item} parent={this} {...this.props} />
                                ))}
                                <TopNavigationLoading />
                            </ul>
                        </div>
                        <MainDelimiter />
                        <AppRoutes {...this.props} />
                    </Router>
                }
            </div>
        );
    }
}

const TopNavigation = connect(mapStateToProps, mapDispatchToProps)(TopNavigationClass);
export default TopNavigation;
