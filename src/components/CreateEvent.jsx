import React, { useState, useEffect } from 'react';
import authApi from '../api/axios';
import "../styles/main.css"
import MyEvents from './MyEvents';
import Main from '../pages/Main';

var eventId;
var crowdId;

function CreateEvent({updateData}){
    const [selectedSport, setSelectedSport] = useState("Баскетбол");
    const [date, setDate] = useState('');
    const [maxUser, setMaxUser] = useState('');
    const [time, setTime] = useState('');
    
    const handleMaxUserOnChange = (e) => {
        setMaxUser(e.target.value);
    }
    const handleTimeOnChange = (e) => {
        setTime(e.target.value);
    }
    const handleDateOnChange = (e) => {
        setDate(e.target.value);
    }
 
    const handleCreateEvent = async () => {
      const events = {
        date: date,
        time: time,
        maximum: maxUser,
        address: { 
          id: localStorage.getItem('addressId'),
        },
        creator: { 
          id: localStorage.getItem('userId'), 
        },
        category: { 
          name: selectedSport 
        }
      }  
        
      try{
          const res = await authApi.post(`events`, events);
          eventId = res.data.id;   
          handleCreateCrowd();
          updateData(true)
        }
        catch(err){
          console.log(err);
        }
    }
    const handleCreateCrowd = async () => {
      try{
        const crowd = {
          events: {
            id: eventId
          },
          teammate: {
            id: localStorage.getItem('userId')
          }
        }
        console.log(crowd);

        const res = await authApi.post(`crowd`, crowd);
        crowdId = res.data.id;
        
      }
      catch(err){
        console.log(err);
      }
    }

      return(
        <div className="formCreateEvent">   
          <div className="selectsForms">
            <h3>Создать событие</h3>
            <p>Перед созданием выберите место на карте</p>
            <label>
                <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}>
                  <option value="Баскетбол">Баскетбол</option>
                  <option value="Футбол">Футбол</option>
                  <option value="Настольные игры">Настольные игры</option>
                </select>
            </label>
            <input type="text" placeholder="Кол-во человек: 10" value={maxUser} onChange={handleMaxUserOnChange}></input>
            <input type="text" placeholder="Время: 18:00:00" value={time} onChange={handleTimeOnChange}></input>           
            <input type="text" placeholder="Дата: год-месяц-день" value={date} onChange={handleDateOnChange}></input>
          </div>
          <button onClick={handleCreateEvent}>Создать событие</button>          
        </div>
      );
}

export default CreateEvent;