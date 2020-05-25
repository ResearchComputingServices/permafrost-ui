import React, { Component, createRef } from 'react';
import { mouse, select, scaleLinear, scaleBand, min, max, axisLeft, axisBottom } from 'd3';
import * as _ from 'lodash';
import * as palette from 'google-palette';

class DepthOnlyObservationChart extends Component {
    constructor(props) {
        super(props);
        this.d3svg = createRef(null);
        this.initialize();
        this.createColorCache();
    }

    createColorCache() {
        // This cache should live as long as the component is mounted and is uneffected by re-renders.
        this.colorCache = {};
    }

    initialize() {
        const minWidth = 350;
        this.transitionDuration = 750;
        this.legend = {};
        this.legendToggle = {};
        this.hasBarTransitionEnded = false;
        this.maxCharLimit = this.props.width > minWidth ? 15 : 8;
        this.tooltipHeight = 40;
        this.tooltipWidth = 150;
        this.colorPalette = this.createColorPalette();
    }

    createColorPalette() {
        const n = this.props.data.length;
        return (n > 65 ? palette('tol-dv', n) : _.reverse(palette('mpn65', n))) || [];
    }

    createLegendData() {
        const colorScale = this.createColorScale(_.get(this, 'props.greyScaleRange') || [0, 100]);
        _.each(_.get(this, 'props.data'), (d, i) => {
            const legendName = this.getLegendName(d);
            d.legendName = legendName;
            this.legend[legendName] = {
                name: legendName,
                fullName: this.getLegendName(d, { verbose: true }),
                color: !_.isNil(d.numeric_value) && _.isNumber(d.numeric_value)
                    ? this.createGreyScaleColor(colorScale(parseFloat(d.numeric_value)))
                    : (function() {
                        if (legendName in this.colorCache) {
                            return this.colorCache[legendName];
                        }
                        const randomColor = this.colorPalette[i];
                        this.colorCache[legendName] = randomColor;
                        return randomColor;
                    }.call(this))
            };
        });
    }

    getLegendName(d, options) {
        const verbose = options && options.verbose;
        let characterLimit = options && options.characterLimit;
        characterLimit = characterLimit != null ? characterLimit : this.maxCharLimit;
        let name = 'No Data';
        if (d.text_value && d.text_value !== '') {
            name = d.text_value;
        } else if (d.numeric_value && d.numeric_value !== '') {
            name = d.numeric_value.toString();
        }
        return !verbose ? this.shortenName(name, characterLimit) : name;
    }

    highlight(element) {
        // Highlight bar.
        select(element)
            .transition()
            .duration(100)
            .attr('opacity', '.7')
            .attr('width', this.props.width - 10)
            .attr('x', 6);
    }

    unHighlight(element) {
        // Un-higlight bar.
        select(element)
            .transition()
            .duration(100)
            .attr('opacity', '1')
            .attr('width', this.props.width - 20)
            .attr('x', 11);
    }

    shortenName(name, characterLimit) {
        characterLimit = characterLimit != null ? characterLimit : this.maxCharLimit;
        if (characterLimit === 0) return name;
        if (name.length > characterLimit) {
            name = `${name.slice(0, characterLimit)}...`;
        }
        return name;
    }

    createGreyScaleColor(intensity) {
        return `hsl(0,0%,${intensity}%)`;
    }

    getDomain() {
        const { data } = this.props;
        return [0, min(data, d => d.to)];
    }

    getRange() {
        return [0, this.props.height];
    }

    showTooltip(tooltip, text, coordinates, wrapText = true) {
        const [x, y] = coordinates;
        tooltip
            .attr('visibility', 'visible')
            .attr('transform', `translate(${x}, ${y})`)
            .select('text')
            .text(text);

        if (wrapText) {
            tooltip.call(() => {
                const self = this;
                const text = tooltip.select('text');
                const container = tooltip.select('rect');
                text.each(function() {
                    const text = select(this);
                    const words = text.text().split(/\s+/).reverse();
                    const lineHeight = 20;
                    const width = parseFloat(text.attr('width')) - 10;
                    const y = parseFloat(text.attr('y'));
                    const x = text.attr('x');
                    const anchor = text.attr('text-anchor');

                    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
                    container.attr('x', x - (width / 2) - 10);
                    let lineNumber = 0;
                    let line = [];
                    let word = words.pop();
                    while (word) {
                        line.push(word);
                        tspan.text(line.join(' '));
                        if (tspan.node().getComputedTextLength() > width) {
                            lineNumber += 1;
                            line.pop();
                            tspan.text(line.join(' '));
                            line = [word];
                            container.attr('x', x - (width / 2) - 10);
                            tspan.attr('x', x);
                            tspan = text.append('tspan').attr('x', x).attr('y', y + lineNumber * lineHeight).attr('anchor', anchor).text(word);
                        }
                        word = words.pop();
                    };
                    container.attr('height', self.tooltipHeight + (lineNumber * lineHeight));
                });
            });
        }
    }

    hideTooltip(tooltip) {
        this.initializeTooltip(tooltip);
    }

    addBarTransitions(tooltip, bar) {
        const self = this;
        // Add bounce effect on mount.
        bar
            .transition()
            .attr('width', this.props.width - 20)
            .attr('transform', ' scale(1)')
            .attr('x', 11)
            .duration(this.transitionDuration);

        setTimeout(() => {
            // Add mouse over highlight transitions.
            bar
                .on('mouseover', function(d, i) {
                    // Highlight hovered bar.
                    self.highlight(this);
                    let { from, to, legendName } = d;
                    from = typeof from === 'number' ? from.toFixed(2) : 'N/A';
                    to = typeof to === 'number' ? to.toFixed(2) : 'N/A';
                    const [x, y] = mouse(this);
                    const offsetX = 80;
                    self.showTooltip(tooltip, `From: ${from}, To: ${to} \n Value: ${legendName}`, [x + offsetX, y]);
                })
                .on('mouseout', function(d, i) {
                    // Highlight hovered bar.
                    self.unHighlight(this);
                    self.hideTooltip(tooltip);
                });
        }, this.transitionDuration);
    }

    addLegendTransitions(legendName, legendBubble, bar, tooltip) {
        const self = this;
        const highlightBar = (legendData, i) => {
            bar.each(function(barData, j) {
                const name = self.getLegendName(barData);
                if (name === legendData.name) {
                    self.highlight(this);
                }
            });
        };
        const unHighlightBar = (legendData, i) => {
            bar.each(function(barData, j) {
                const name = self.getLegendName(barData);
                if (name === legendData.name) {
                    self.unHighlight(this);
                }
            });
        };
        const hideBars = (legendData) => {
            if (_.size(this.legend) <= 1) return;
            // Flag to dictate how toggle behaviour will work, show will determine if a switch has been toggled.
            let show = false;
            // Loop over each bar.
            bar.each(function(barData) {
                const name = self.getLegendName(barData);
                // If the legend name matches the bar name and name not in toggle.
                if (name === legendData.name && !(name in self.legendToggle)) {
                    // We set mode of show to true, as we will need to show only certain bars.
                    // If this if statement condition never gets caught then show will be false.
                    show = true;
                    self.legendToggle[name] = show;
                }
                // If name of the bar doesn't match legend name and there exists a toggle switch
                // for the bar, we delete it as we are not dealing with that legend.
                if (name !== legendData.name && (name in self.legendToggle)) {
                    delete self.legendToggle[name];
                }
            });
            // Now that all the modes have been set we loop over bars again to set css.
            bar.each(function(barData) {
                const name = self.getLegendName(barData);
                // If the legend name batches the bar name and we are at show mode === true which means we are toggling it for the first time.
                if (name === legendData.name && self.legendToggle[name] === true && show) {
                    select(this)
                        .attr('visibility', 'visible');
                    // When show mode is false we show everything, as the toggle has been triggered the second time.
                } else if (!show) {
                    // If we are in this if statement that means the self.legendToggle[name] could have returned false.
                    if (name === legendData.name) {
                        // If it did we delete it's toggle history.
                        delete self.legendToggle[name];
                    }
                    select(this)
                        .attr('visibility', 'visible');
                    // This if statement makes sure that by default all the bars are hidden, if none of the if statements above gets triggered.
                } else {
                    select(this)
                        .attr('visibility', 'hidden');
                }
            });
        };
        setTimeout(() => {
            legendName
                .on('click', hideBars)
                .on('mouseover', function(legendData, i) {
                    if (legendData.fullName.length > self.maxCharLimit) {
                        const offsetX = -30;
                        const coordinates = [legendBubble.attr('cx') - tooltip.select('rect').attr('width') / 2.3 + offsetX, i * 25];
                        self.showTooltip(tooltip, legendData.fullName, coordinates);
                    }
                    highlightBar(legendData, i);
                })
                .on('mouseout', function(legendData, i) {
                    self.hideTooltip(tooltip);
                    unHighlightBar(legendData, i);
                });

            legendBubble
                .on('click', hideBars)
                .on('mouseover', highlightBar)
                .on('mouseout', unHighlightBar);
        }, this.transitionDuration);
    }

    initializeTooltip(tooltip) {
        const width = this.tooltipWidth;
        const height = this.tooltipHeight;
        tooltip.attr('visibility', 'hidden');
        tooltip
            .select('rect')
            .style('fill', 'white')
            .attr('color', 'black')
            .style('stroke', '#9c9c9c')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('x', -width / 2)
            .attr('y', -12.5)
            .attr('width', width + 10)
            .attr('height', height);
        tooltip
            .select('text')
            .attr('font-size', '12px')
            .attr('width', width)
            .attr('x', 5.5)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .text(null);
    }

    createCanvas() {
        const svg = select(this.d3svg.current);
        const { margin: { left: x, top: y } } = this.props;
        return svg
            .append('g')
            .attr('transform', `translate(${x},${y})`);
    }

    createXScale() {
        const xScale = scaleBand()
            .domain([''])
            .range([0, this.props.width]);
        return xScale;
    }

    createYScale() {
        // Scale Linear function is used to translate the data received into numbers in pixels.
        const yScale = scaleLinear()
            .domain(this.getDomain())
            .range(this.getRange());
        return yScale;
    }

    createColorScale(range) {
        const data = _.get(this, 'props.data');
        const domain = [max(data, d => d.numeric_value), min(data, d => d.numeric_value)];
        // Scale Linear function is used to translate the data received into numbers in pixels.
        const colorScale = scaleLinear()
            .domain(domain)
            .range(range);
        return colorScale;
    }

    createXAxis(svgGrp, xScale) {
        return svgGrp
            .append('g')
            .attr('transform', `translate(${0},${this.props.height})`)
            .call(axisBottom(xScale).tickValues([]));
    }

    createYAxis(svgGrp, yScale) {
        return svgGrp
            .append('g')
            .attr('transform', `translate(${0}, ${0})`)
            .call(axisLeft(yScale));
    }

    createYAxisTitle(svgGrp, title) {
        return svgGrp.append('text')
            .attr('transform', 'rotate(-90)')
            // x and y axis get flipped when the text is rotated
            .attr('y', -this.props.margin.left)
            .attr('x', -this.props.height / 2)
            .attr('dy', '1em')
            .attr('font-size', '15px')
            .attr('text-anchor', 'middle')
            .text(title);
    }

    createChartTitle(svgGrp, title) {
        return svgGrp.append('text')
            // x and y axis get flipped when the text is rotated
            .attr('y', -this.props.margin.top + 20)
            .attr('x', this.props.width / 2)
            .attr('dy', '1em')
            .attr('font-size', '17px')
            .attr('text-anchor', 'middle')
            .text(title);
    }

    createTooltip(svgGrp) {
        const tooltipGrp = svgGrp.append('g');
        tooltipGrp.append('rect');
        tooltipGrp.append('text');
        this.initializeTooltip(tooltipGrp);
        return tooltipGrp;
    }

    createBar(svgGrp, yScale) {
        const { data } = this.props;
        const barGrp = svgGrp.append('g');
        // Make sure we return a reference to the individual bar and not the bar grp.
        const bar = barGrp
            .selectAll('depth-bar')
            .data(data == null ? [] : data)
            // The method .enter will return a pointer to the list of all the rectangles.
            // Which means when you chain methods on this variable, it will invoke the methods on every single bar.
            .enter()
            .append('rect')
            .attr('y', d => yScale(d.from))
            .attr('height', d => yScale(d.to - d.from));

        bar
            .style('fill', (d, i) => {
                return _.get(this, ['legend', d.legendName, 'color']);
            })
            // Removing width by 20px, so that it fits within axis (x axis is arbitary).
            .attr('width', this.props.width - 20)
            // Moving x axis by 10px, so that it shifts a bit to the right (x axis is arbitary).
            .attr('x', 30)
            .attr('transform', ' scale(0.9)')
            .attr('cursor', 'pointer');
        // We return the pointer to the list of all the rectangles.
        return bar;
    }

    createLegend(svgGrp) {
        const legendGrp = svgGrp.append('g');
        let legends = Object.values(this.legend);
        if (legends.length > 1) {
            const noData = _.remove(legends, data => data.name === 'No Data');
            legends = noData.concat(legends);
        }
        // Add one dot in the legend for each name.
        const offset = (this.props.width * 0.05);
        const legendBubblesGrp = legendGrp.append('g');
        const legendNamesGrp = legendGrp.append('g');
        const legendBubble = legendBubblesGrp
            .selectAll('legend-bubble')
            .data(legends)
            .enter()
            .append('circle')
            .attr('cx', this.props.width + offset)
            .attr('cy', (d, i) => i * 25)
            .attr('r', 7)
            .style('fill', d => d.color)
            .style('stroke', 'black')
            .style('stroke-width', '0.2px')
            .attr('cursor', 'pointer');

        // Add one dot in the legend for each name.
        const legendName = legendNamesGrp
            .selectAll('legend-name')
            .data(legends)
            .enter()
            .append('text')
            .attr('font-size', '16px')
            .attr('x', this.props.width + offset + 15)
            .attr('y', (d, i) => i * 25)
            .style('fill', 'black')
            .text(d => d.name)
            .attr('text-anchor', 'left')
            .style('alignment-baseline', 'middle')
            .attr('cursor', 'pointer');

        return {
            legendName,
            legendBubble
        };
    }

    createChart() {
        const data = _.get(this, 'props.data');
        if (!_.isNil(data) && _.size(data) > 0) {
            const svgGrp = this.createCanvas();
            const xScale = this.createXScale();
            const yScale = this.createYScale();
            this.createLegendData();
            this.createChartTitle(svgGrp, _.get(this, 'props.chartTitle', ''));
            this.createYAxis(svgGrp, yScale);
            this.createYAxisTitle(svgGrp, _.get(this, 'props.yAxisTitle', ''));
            this.createXAxis(svgGrp, xScale);
            const bar = this.createBar(svgGrp, yScale);
            const { legendName, legendBubble } = this.createLegend(svgGrp);
            const tooltip = this.createTooltip(svgGrp);
            this.addBarTransitions(tooltip, bar);
            this.addLegendTransitions(legendName, legendBubble, bar, tooltip);
        }
    }

    destroyChart() {
        this.initialize();
        const svg = select(this.d3svg.current);
        svg
            .select('g')
            .remove();
    }

    componentDidMount() {
        // We create the chart initially when the component renders.
        if (this.props.data && this.d3svg.current) {
            this.destroyChart();
            this.createChart();
        }
    }

    componentDidUpdate(prevProps) {
        // We need to check if the props.data changed, before we re-render the chart, to avoid useless renders.
        if (this.props.data && this.d3svg.current && !_.isEqual(this.props, prevProps)) {
            this.destroyChart();
            this.createChart();
        }
    }

    render() {
        const { width, height, margin, offsetX, offsetY } = this.props;
        if (_.isNil(width) || _.isNil(height) || (_.isNil(margin) && !_.isObject(margin))) {
            return <></>;
        }
        if (_.isNil(margin.top) || _.isNil(margin.bottom) || _.isNil(margin.left) || _.isNil(margin.right)) {
            return <></>;
        }
        const legendWidth = this.props.width > 350 ? 120 : 50;
        return (
            <svg
                width={width + margin.left + margin.right + (!_.isNil(offsetX) ? offsetX : 0) + legendWidth}
                height={height + margin.top + margin.bottom + (!_.isNil(offsetY) ? offsetY : 0)}
                role='img'
                ref={this.d3svg}
            />
        );
    }
}

export default DepthOnlyObservationChart;
