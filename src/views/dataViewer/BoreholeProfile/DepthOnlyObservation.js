import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DepthOnlyObservationChart from './DepthOnlyObservationChart';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';
import * as _ from 'lodash';

class DepthOnlyObservation extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
            greyScaleRange: [0, 100],
            greyScaleRangeInputMin: 0,
            greyScaleRangeInputMax: 100,
            isInputValid: true,
            categoryValue: (this.props.mapsSettings.depthOnlyObservationsCategories[0] &&
                this.props.mapsSettings.depthOnlyObservationsCategories[0].label) || ''
        };
    }

    getOffset() {
        return {
            offsetX: 0,
            offsetY: 0
        };
    }

    getMargin() {
        return {
            top: 80,
            right: 60,
            bottom: 80,
            left: 60
        };
    }

    getDimension(margin) {
        const windowWidth = window.innerWidth;
        const height = 620;
        let width = 650;
        if (windowWidth > 1280) {
            width = 650;
        } else if (windowWidth > 768) {
            width = 450;
        } else if (windowWidth > 439) {
            width = 350;
        } else if (windowWidth < 439) {
            width = 300;
        }
        return {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };
    }

    checkInputValidity(val, min, max) {
        val = parseInt(val);
        min = parseInt(min);
        max = parseInt(max);
        return ((val >= 0 && val <= 100) || isNaN(val))
            && ((isNaN(min) && isNaN(max)) ? min < max : true)
            && min !== max;
    }

    onGreyScaleRangeInputMinChange(e) {
        const val = _.get(e, 'target.value');
        const { greyScaleRangeInputMax } = this.state;
        this.setState({
            ...this.state,
            greyScaleRangeInputMin: val,
            isInputValid: this.checkInputValidity(val, val, greyScaleRangeInputMax)
        });
    }

    onGreyScaleRangeInputMaxChange(e) {
        const val = _.get(e, 'target.value');
        const { greyScaleRangeInputMin } = this.state;
        this.setState({
            ...this.state,
            greyScaleRangeInputMax: val,
            isInputValid: this.checkInputValidity(val, greyScaleRangeInputMin, val)
        });
    }

    onCategoryChange(e) {
        const val = _.get(e, 'target.value');
        this.setState({
            ...this.state,
            categoryValue: val
        });
    }

    onRefreshChart() {
        const { greyScaleRangeInputMin, greyScaleRangeInputMax } = this.state;
        this.setState({
            ...this.state,
            greyScaleRange: [greyScaleRangeInputMax, greyScaleRangeInputMin]
        });
    }

    render() {
        const { mapsSettings: { depthOnlyObservationsCategories, loading } } = this.props;
        const { greyScaleRange, greyScaleRangeInputMin, greyScaleRangeInputMax, isInputValid, categoryValue } = this.state;
        const data = _.get(this, `props.mapsSettings.depthOnlyObservationsByCategory.${this.state.categoryValue}`);
        const { offsetX, offsetY } = this.getOffset();
        const margin = this.props.margin || this.getMargin();
        const { width, height } = this.getDimension(margin);
        return !loading && data && data.length > 1 ? (
            <div>
                <div className='borehole-profile-container' style={{ marginLeft: margin.left }}>
                    <FormControl>
                        <Select
                            value={categoryValue || depthOnlyObservationsCategories[0].label}
                            onChange={this.onCategoryChange.bind(this)}
                        >
                            {
                                depthOnlyObservationsCategories
                                    ? depthOnlyObservationsCategories.map((item, key) =>
                                        <MenuItem key={key} value={item.label} >
                                            {item.label}
                                        </MenuItem>)
                                    : null
                            }
                        </Select>
                        <FormHelperText>Category</FormHelperText>
                    </FormControl>
                    <FormControl className='mx-3'>
                        <div>
                            <TextField
                                className='borehole-profile-range-input'
                                value={greyScaleRangeInputMin}
                                type={'number'}
                                error={!isInputValid}
                                onChange={this.onGreyScaleRangeInputMinChange.bind(this)}
                            />
                            <TextField
                                className='borehole-profile-range-input'
                                value={greyScaleRangeInputMax}
                                type={'number'}
                                error={!isInputValid}
                                onChange={this.onGreyScaleRangeInputMaxChange.bind(this)}
                            />
                            {isInputValid && <FontAwesomeIcon
                                onClick={this.onRefreshChart.bind(this)}
                                className='borehole-profile-range-refresh-btn'
                                icon='sync'
                            />}
                            <FormHelperText>Greyscale Range</FormHelperText>
                        </div>
                    </FormControl>
                </div>
                <div className='depth-only-observation-chart'>
                    <DepthOnlyObservationChart
                        margin={margin}
                        width={this.props.width || width}
                        height={this.props.height || height}
                        data={data}
                        chartTitle={'Depth Only Observation'}
                        yAxisTitle={'Depth'}
                        greyScaleRange={greyScaleRange}
                        offsetX={this.props.offsetX != null ? this.props.offsetX : offsetX}
                        offsetY={this.props.offsetY != null ? this.props.offsetXY : offsetY}
                    />
                </div>
            </div>
        ) : <></>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepthOnlyObservation);
