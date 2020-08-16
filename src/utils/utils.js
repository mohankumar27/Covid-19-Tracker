import React from 'react'
import numeral from 'numeral'
import { Circle, Popup } from 'react-leaflet'

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 800,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 1200,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 2000,
    },
};

//sort data by cases for Table
export const sortedData = (data) => {
    const sortData = [...data];
    return sortData.sort((a, b) => a.cases < b.cases ? 1 : -1)
}

// print cases formatted using numeral in Infobox
export const prettyPrint = (stat) =>
    stat ? `+${numeral(stat).format('0.0a')}` : '+0';

//method to draw circles in Mao
export const drawCircles = (data, casesType = 'cases') => (
    data.map((country, index) => (
        <Circle
            key={index}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div className='info-container'>
                    <div className='info-flag' style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className='info-country'>{country.country}</div>
                    <div className='info-cases'>Cases:{numeral(country.cases).format('0,0s')}</div>
                    <div className='info-recovered'>Recovered:{numeral(country.recovered).format('0,0')}</div>
                    <div className='info-deaths'>Deaths:{numeral(country.deaths).format('0,0')}</div>
                </div>
            </Popup>
        </Circle>
    ))
);