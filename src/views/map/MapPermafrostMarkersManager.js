import React, { Component } from 'react';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/LoggedInUserReduxMappings';
import MapPermafrostManageMarkers from './marker/MapPermafrostManageMarkers';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class MapPermafrostMarkersManagerClass extends Component {

    canDisplayView() {
        let canDisplay = (!!this.props.loggedInUser && !!this.props.loggedInUser.loggedInUserRoles &&
            !!this.props.loggedInUser.loggedInUserName);
        if (!!this.props.loggedInUser) {
            let hasPerms = false;
            if (Array.isArray(this.props.loggedInUser.loggedInUserRoles)) {
                hasPerms = ['Administrator', 'Contributor'].some(role => this.props.loggedInUser.loggedInUserRoles.indexOf(role) >= 0);
            }
            canDisplay = canDisplay && hasPerms;
        }
        return canDisplay;
    }

    render() {
        let enable = this.canDisplayView();
        return (
            enable ? (
                <div className='marker-manager-collapsible-container'>
                    <ExpansionPanel className='marker-manager-collapsible-expansion-panel'>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Manage Marker</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className='marker-manager-collapsible-expansion-panel-details'>
                            <MapPermafrostManageMarkers />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <div className='top-margin' />
                </div>
            ) : null
        );
    }
}

const MapPermafrostMarkersManager = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostMarkersManagerClass);
export default MapPermafrostMarkersManager;
