/**
 * Top level navigation loading.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react';
import { connect } from "react-redux";
import ReactLoading from 'react-loading'
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/MapSettingsReduxMappings'

class TopNavigationLoadingClass extends Component {
    render() {
        return (this.props.mapsSettings.loading ?  <ReactLoading type={'spokes'} color={'#34aeeb'} height={50} width={50} /> : null)
    }
}

const TopNavigationLoading = connect(mapStateToProps, mapDispatchToProps)(TopNavigationLoadingClass);
export default TopNavigationLoading;

