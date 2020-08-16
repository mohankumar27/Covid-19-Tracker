import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';


//provided by char.js [refer documentation]
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

//get the x and y values from queried data to form the graph
const buildChartData = (data, casesType = 'cases') => {
    let chartData = [];
    let lastDatapoint;
    for (let date in data.cases) {
        if (lastDatapoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDatapoint,
            };
            chartData.push(newDataPoint);
        }
        lastDatapoint = data[casesType][date];
    };
    return chartData;
}

function LineGraph({casesType, className}) {
    const [graphData, setGraphData] = useState({});

    //query to fetch last 120 days data to plot the graph
    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(response => response.json())
                .then((data) => {
                    let chartData = buildChartData(data, casesType);
                    setGraphData(chartData);
                });
        };
        fetchData();
    }, [casesType]);

    return (
        <div className={className}>
            {/* optional chaining syntax "graphData?." refer doc 
            (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) */}
            {graphData?.length > 0 && ( 
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: graphData,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    )
}

export default LineGraph
