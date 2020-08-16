import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  Select,
  Card,
  CardContent,
  FormControl,
} from '@material-ui/core'
import InfoBox from './Components/InfoBox/InfoBox'
import Map from './Components/Map/Map'
import Table from './Components/Table/Table'
import { sortedData } from './utils/utils'
import LineGraph from './Components/LineGraph/LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {

  const [countries, setCountries] = useState([]);  //fetching all countries data
  const [country, setCountry] = useState('worldwide'); //single country data
  const [countryInfo, setCountryInfo] = useState({}); // individual country cases,deaths and recovered
  const [tableData, setTableData] = useState([]); //To populate the right table containing country and their cases
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); // setting inital load position of map
  const [mapZoom, setMapZoom] = useState(2); // setting zoom level of the map
  const [mapCountries, setMapCountries] = useState([]); //get all data form countries to draw circle in map
  const [casesType, setCasesType] = useState('cases') //tracking click of infoboxes to deaths or cases or recovered

  //UseEffect to fetch worldwide data when the screen loads initially
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, []);

  //UseEffect to fetch courties data from "disease.sh"
  useEffect(() => {
    //async call to fetch data
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countriesData = data.map((country) => (
            {
              //_id : country.countryInfo._id, //unique id for each country
              name: country.country, //india,japan etc..
              value: country.countryInfo.iso3, //IND,JPN etc..
            }
          ));
          const sortData = sortedData(data); //sorting data based on cases
          setTableData(sortData);
          setCountries(countriesData);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    // fetch data for the specific country
    // if country == worldwide -> url = 'https://disease.sh/v3/covid-19/countries/all'
    // if country == [any country] -> url = 'https://disease.sh/v3/covid-19/countries/[countrycode]'
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;  //back ticks are special jsx that helps us concatenate strings together

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data); //whole country data about covid-19 of selected country is saved as json
        setCountry(countryCode); //set value to the clicked country
        if (countryCode === 'worldwide') {
          setMapCenter([34.80746, -40.4796]); //worldwide latlng position
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]) //setting map positon to selected country
          setMapZoom(4);
        }
      });
  }

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          {/* Header */}
          <h1>COVID-19 Tracker</h1>
          {/* Countries Dropdown */}
          <FormControl className='app__dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              {/* populate countries here through map */}
              <MenuItem value='worldwide'>WorldWide</MenuItem>
              {countries.map((country, index) => <MenuItem key={index} value={country.value}>{country.name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>

        {/* Infoboxes * 3 */}
        <div className='app__stats'>
          <InfoBox title='Coronavirus Cases'
            isRed
            active={casesType === 'cases'}
            onClick={e => setCasesType('cases')}
            cases={countryInfo.todayCases}
            total={countryInfo.cases} />

          <InfoBox title='Recovered'
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')}
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered} />

          <InfoBox title='Deaths'
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')}
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map mapCountries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
      </div>
      {/* Tabel to list country and cases */}
      <Card className='app__right'>
        <CardContent>
          <div className='app__information'>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className='app__graphTitle'>Worldwide new cases</h3>
            <LineGraph className='app__graph' casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
