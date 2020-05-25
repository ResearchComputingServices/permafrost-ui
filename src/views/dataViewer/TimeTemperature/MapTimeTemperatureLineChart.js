/**
 * Time Temperature Line Chart
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import * as moment from 'moment';

export default class MapTimeTemperatureLineChart extends React.Component {
    constructor(props) {
        super(props);

        const categories = this.getCategories(props);
        const series = this.getSeries(props);

        this.state = {
            height: props.height,
            options: {
                chart: {
                    zoom: {
                        enabled: true,
                        type: 'xy',
                        autoScaleYaxis: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Time by Temperature',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    }
                },
                legend: {
                    offsetX: 60,
                    offsetY: -25,
                    height: 50
                },
                xaxis: {
                    type: 'datetime',
                    tickAmount: 'dataPoints',
                    categories: categories,
                    title: {
                        text: 'Time',
                        style: {
                            marginTop: 10,
                            fontSize: '15px'
                        }
                    }
                },
                yaxis: {
                    title: {
                        text: 'Temperature',
                        style: {
                            marginTop: 10,
                            fontSize: '15px'
                        }
                    }
                },
                tooltip: {
                    x: {
                        formatter: value => moment(value).format('DD MMM YYYY')
                    }
                }
            },
            series: series
        };
    }

    getKeys(index, props) {
        return Object.keys(props.data[index].data);
    }

    getValues(index, props) {
        return Object.values(props.data[index].data);
    }

    getCategories(props) {
        const categories = (props.data && props.data.length > 0) ? Object.keys(props.data[0].data) : [];
        return categories;
    }

    getSeries(props) {
        const series = [];
        for (const item of props.data) {
            const seriesItem = {
                name: item.name,
                data: Object.values(item.data)
            };
            series.push(seriesItem);
        }
        return series;
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
