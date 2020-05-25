import React, { Component, createRef } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DepthOnlyObservation from './DepthOnlyObservation';

export default class extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.containerRef = createRef(null);
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            let { width } = this.getDimension();
            if (this.state.numCharts > 1) {
                width = this.reCalculateWidth();
            }
            this.setState({
                ...this.state,
                width
            });
        });
    }

    getInitialState() {
        const { width, height } = this.getDimension();
        const initialNumCharts = 1;
        return {
            numCharts: initialNumCharts,
            width,
            height,
            addButtonDisabled: this.shouldDisableAddButton(initialNumCharts),
            removeButtonDisabled: this.shouldDisableRemoveButton(initialNumCharts)
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

    getMinWidth() {
        return 350;
    }

    getDimension() {
        const margin = this.getMargin();
        const windowWidth = window.innerWidth;
        const height = 620;
        let width = 650;
        if (windowWidth > 1280) {
            width = 650;
        } else if (windowWidth > 768) {
            width = 450;
        } else if (windowWidth > 439) {
            width = this.getMinWidth();
        } else if (windowWidth < 439) {
            width = this.getMinWidth();
        }
        return {
            width: width - margin.left - margin.right,
            height: height - margin.top - margin.bottom
        };
    }

    scrollToPosition() {
        const containerDiv = this.containerRef.current;
        if (containerDiv) {
            containerDiv.scroll({
                left: containerDiv.scrollWidth,
                behavior: 'smooth'
            });
        }
    }

    shouldDisableAddButton(numCharts) {
        return false;
    }

    shouldDisableRemoveButton(numCharts) {
        return numCharts === 0;
    }

    createChart(key) {
        const margin = this.getMargin();
        const { offsetX, offsetY } = this.getOffset();
        return <DepthOnlyObservation
            offsetX={offsetX}
            offsetY={offsetY}
            margin={margin}
            height={this.state.height}
            width={this.state.width}
            key={key}
        />;
    }

    reCalculateWidth(numCharts) {
        const { width: initialWidth } = this.getDimension();
        const margin = this.getMargin();
        if (numCharts > 1) return this.getMinWidth() - margin.left - margin.right;
        if (numCharts < 2) return initialWidth;
        return this.state.width;
    }

    onAddChart() {
        const numCharts = this.state.numCharts + 1;
        this.setState({
            ...this.state,
            numCharts,
            width: this.reCalculateWidth(numCharts),
            addButtonDisabled: this.shouldDisableAddButton(numCharts),
            removeButtonDisabled: this.shouldDisableRemoveButton(numCharts)
        }, this.scrollToPosition.bind(this));
    }

    onRemoveChart() {
        if (this.state.numCharts === 0) return;
        const numCharts = this.state.numCharts - 1;
        this.setState({
            ...this.state,
            numCharts,
            width: this.reCalculateWidth(numCharts),
            addButtonDisabled: this.shouldDisableAddButton(numCharts),
            removeButtonDisabled: this.shouldDisableRemoveButton(numCharts)
        }, this.scrollToPosition.bind(this));
    }

    createCharts() {
        const charts = [];
        for (let i = 0; i < this.state.numCharts; ++i) {
            charts.push(this.createChart(i));
        }
        return charts;
    }

    render() {
        return (
            <div
                style={{ maxHeight: window.innerHeight - 100 }}
                className='h-100 d-flex justify-content-center'
            >
                <div className='position-absolute depth-only-observations-control-panel'>
                    <IconButton
                        size='small'
                        onClick={this.onAddChart.bind(this)}
                        disabled={this.state.addButtonDisabled}
                        className={`mx-2 ${this.state.addButtonDisabled ? 'inactive-button' : 'active-button'}`}
                    >
                        <AddIcon />
                    </IconButton>
                    <IconButton
                        size='small'
                        onClick={this.onRemoveChart.bind(this)}
                        disabled={this.state.removeButtonDisabled}
                        className={`${this.state.removeButtonDisabled ? 'inactive-button' : 'active-button'}`}
                    >
                        <RemoveIcon />
                    </IconButton>
                </div>
                <div
                    ref={this.containerRef}
                    className='px-1 row flex-nowrap overflow-auto'
                >
                    {this.createCharts()}
                </div>
            </div>
        );
    }
}
