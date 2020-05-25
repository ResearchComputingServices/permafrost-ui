/**
 * Top level banner with the logo.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react';
import carletonUniversityLogo from '../../icons/carleton.jpg';

export default class CarletonBanner extends Component {
    render() {
        return (
            <div className="row top-banner">
                <div className='carleton-university-logo'>
                    <img src={carletonUniversityLogo} className="img-rounded" alt="Carleton University"/>
                </div>
                <div className='carleton-central'>
                    <div>Permafrost Database Viewer</div>
                </div>
            </div>
        );
    }
}

