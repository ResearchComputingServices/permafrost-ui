/**
 * Temperature Height Line Chart
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default class MapTemperatureHeightLineChart extends React.Component {
    constructor(props) {
        super(props);

        const categories = this.getCategories(props);
        const minValues = this.arrayOfValues(0, props, categories);
        const averageValues = this.arrayOfValues(1, props, categories);
        const maxValues = this.arrayOfValues(2, props, categories);

        this.state = {
            height: props.height,
            options: {
                chart: {
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Temperature by Height',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                legend: {
                    offsetX: 50,
                    offsetY: -10,
                    height: 50
                },
                xaxis: {
                    type: 'numeric',
                    tickAmount: 'dataPoints',
                    categories: categories,
                    title: {
                        text: 'Temperature',
                        style: {
                            fontSize: '15px'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Height',
                        style: {
                            fontSize: '15px'
                        }
                    }
                }
            },
            series: [{
                name: 'Min',
                data: minValues
            }, {
                name: 'Average',
                data: averageValues
            }, {
                name: 'Max',
                data: maxValues
            }]
        };
    }

    getKeys(index, props) {
        return Object.keys(props.data[index].data);
    }

    getValues(index, props) {
        return Object.values(props.data[index].data);
    }

    getCategories(props) {
        // Concatenate the three arrays: min, average and max
        const array = (props.data.length > 0)
            ? this.getKeys(0, props).concat(this.getKeys(1, props)).concat(this.getKeys(2, props)) : [];

        // Convert an array of string items into an array of float items
        let x = 0;
        const len = array.length;
        while (x < len) {
            array[x] = parseFloat(array[x]);
            x++;
        }

        return array;
    }

    arrayOfValues(index, props, categories) {
        const array = [];
        const keys = (props.data.length > 0) ? this.getKeys(index, props) : [];

        for (const item of categories) {
            if (keys.includes(item.toFixed(2))) {
                array.push(props.data[index].data[item.toFixed(2)]);
            } else {
                array.push(null);
            }
        }
        return array;
    }

    propsHasData(props) {
        return props.data && Array.isArray(props.data) && props.data.length > 0;
    }

    render() {
        return (
            <div>
                <div id='chart'>
                    {
                        this.propsHasData(this.props) &&
                        <ReactApexChart options={this.state.options} series={this.state.series} type='line' height={this.state.height} />
                    }
                </div>
                <div id='html-dist'>
                </div>
            </div>
        );
    }
}
