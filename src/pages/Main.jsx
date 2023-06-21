import React, { useState, useEffect } from 'react';
import "../styles/main.css"
import Popup from 'reactjs-popup';
import 'react-calendar/dist/Calendar.css';
import { YMaps, Map, Placemark, Button } from '@pbe/react-yandex-maps';
import AllEvents from '../components/AllEvents'
import MyEvents from '../components/MyEvents';
import IWillGo from '../components/IWillGo';
import Error from './Error';
import axios from "axios";
import authApi, {API_URL} from "../api/axios";
import CreateEvent from '../components/CreateEvent';

const city = [
  { id: 0, name: 'Сызрань', center: [53.155669, 48.474611]},
  { id: 1, name: 'Самара', center: [53.195878, 50.100202] },
  { id: 2, name: 'Москва', center: [55.75, 37.57] },
  { id: 3, name: 'Санкт-Петербург', center: [59.938955, 30.315644] },
  { id: 4, name: 'Саратов', center: [51.533562, 46.034266] },
]

var placeId;

function Main( {userForAuth, isLoggedIn} ) {
    const [selectedSport, setSelectedSport] = useState("Баскетбол")
    const [selectedCity, setSelectedCity] = useState(city[0])
    const [places, setPlaces] = useState([]);
    const [page, setPage] = useState(0);
    const [state, setState] = useState(false);
    
    useEffect(() => {
      authApi.get(`address`).then(response => 
      {
        setPlaces(response.data);
          
      })
    }, []);

    if(isLoggedIn === false){
      return(
        <Error></Error>
      ); 
    }

    function updateData(value) {
      setState(value)
    }

    const handleGetPlaceId = (e) => {
      localStorage.setItem('addressId', e.get('target').properties.get('balloonContent')); 
      
      console.log(localStorage.getItem('addressId'));
    }

    return (
      <div className="Main">
        <div className="content__Main">
          <div className="content__Map">
            <div className="filters">
              
                <label>
                    <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}>
                      <option value="Баскетбол">Баскетбол</option>
                      <option value="Футбол">Футбол</option>
                      <option value="Настольные игры">Настольные игры</option>
                    </select>
                </label>           
                <h2>Места</h2>
                <label>
                    <select value={selectedCity.id} onChange={e => setSelectedCity(city[e.target.value])}>
                      {city.map((city, index) => { return <option key={index} value={index} center={city.center}>{city.name}</option>})}
                    </select>
                </label>
            </div>
            <hr/>
            <div className="ymap">
              <YMaps>
                <Map width="100%" height="100%" state={{ center: selectedCity.center, zoom: 10 }} modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }>
                  {places.map(place => 

                  
                  <Placemark key={place.id} id={place.id}
                    geometry={ [place.x_coordinate, place.y_coordinate]} 
                    properties={{hintContent: place.name, balloonContent: place.id}}
                    options={{ iconLayout: 'default#image' }}
                    onClick={handleGetPlaceId}
                    />)}
                </Map>
              </YMaps>
            </div>
          </div>

          <div className="content__Events">
            <div className="navEvents">
              <a href="#" onClick={() => setPage(0)}><h2>Все события</h2></a> <a href="#" onClick={() => setPage(1)}><h2>Я пойду</h2></a>
            </div>
            <hr/>
            {page === 0 ? <AllEvents city={selectedCity.name} sport={selectedSport} userID={localStorage.getItem('userId')}/> : false}
            {page === 1 ? <IWillGo city={selectedCity.name} sport={selectedSport} userID={localStorage.getItem('userId')}/> : false}
          </div>
          <div className="content__myEvents">
            <Popup trigger={<h2>Мои события <a href="#">+</a> </h2>} position="bottom center">
              <CreateEvent updateData={updateData}/>
            </Popup>
            <hr/>
            <MyEvents isCreate={state}></MyEvents> 
          </div>
        </div> 
      </div>
    );
  }
  
export default Main;