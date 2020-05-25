/**
 * All the routes that the application has.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import MapPermafrost from '../map/MapPermafrost';
import UploadAndProcess from '../uploadAndProcess/UploadAndProcess';
import OverlyMaps from '../map/overlyMaps/OverlyMaps';
import MapDataViewer from '../dataViewer/MapDataViewer';

export default class AppRoutes extends Component {
    constructor(props) {
        super(props);
        this.handleMain = this.handleMain.bind(this);
        this.handleOverlyMaps = this.handleOverlyMaps.bind(this);
        this.handleObservations = this.handleObservations.bind(this);
        this.handleUploadAndProcess = this.handleUploadAndProcess.bind(this);
    }

    handleMain(e) {
        const link = { name: 'Maps', path: e.location.pathname };
        return <MapPermafrost link={link} {...this.props}/>;
    }

    handleObservations(e) {
        const link = { name: 'Observations', path: e.location.pathname };
        return <MapDataViewer link={link} {...this.props}/>;
    }

    handleOverlyMaps(e) {
        const link = { name: 'Overlay Maps', path: e.location.pathname };
        return <OverlyMaps link={link} {...this.props}/>;
    }

    handleUploadAndProcess(e) {
        const link = { name: 'Upload & Process', path: e.location.pathname };
        return <UploadAndProcess link={link} {...this.props}/>;
    }

    render() {
        return (
            <div>
                <Route path='/' exact render={this.handleMain}/>
                <Route path='/observations' exact render={this.handleObservations}/>
                <Route path='/overly-maps' exact render={this.handleOverlyMaps}/>
                <Route path='/upload-and-process' exact render={this.handleUploadAndProcess}/>
            </div>
        );
    }
}
