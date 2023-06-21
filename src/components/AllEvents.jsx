import React, { useState, useEffect } from 'react';
import "../styles/main.css"
import Popup from 'reactjs-popup';
import axios from "axios";
import authApi, {API_URL} from "../api/axios";
import Pagination from './Pagination';

var eventId;
var crowdId;
var btnId;

function AllEvents({city, sport, userID}) {
  const [allEvents, setAllEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(3);
  const [whoGo, setWhoGo] = useState([]);
  
  useEffect(() => {
    async function getEvents(){
      authApi.get(`events`).then(response => 
        {
          setAllEvents(response.data);
            
        })
    }  
    getEvents(); 
  }, []);

  const filteredByCategoryEvents = allEvents.filter(event => {
    return event.category.name.includes(sport);
  });

  const filteredByCity = filteredByCategoryEvents.filter(event => {
    return event.address.city.includes(city);
  });

  const filteredByUserId = filteredByCity.filter(event => {
    return event.creator.id !== userID;
  })

  const lastEventsIndex = currentPage * eventsPerPage;
  const firstEventsIndex = lastEventsIndex - eventsPerPage;
  const currentEvents = filteredByUserId.slice(firstEventsIndex, lastEventsIndex) 

  const paginate = pageNumber => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage( prev => prev + 1);
  const prevPage = () => setCurrentPage( prev => prev - 1);

  const handleIWillGo = async (e) => {
    const res = await authApi.get(`crowd/events/` + e.target.id)
    
    const filterExistSubscribe = res.data.filter(crowd => {
      return crowd.events.id === e.target.id && crowd.teammate.id === localStorage.getItem('userId');
    })

    if(filterExistSubscribe.length !== 0) {
      alert("Вы уже подписаны на это событие");
    }
    else{
      try{
        eventId = e.target.id;
      
        const crowd = {
          events: {
            id: eventId
          },
          teammate: {
            id: localStorage.getItem('userId')
          }
        }
  
        const res = await authApi.post(`crowd`, crowd);
      }
      catch(err){
        console.log(err);
      }
    }
  }
  
  const handleWhoGoOnEvent = async (e) => {
    eventId = e.target.id;
    console.log(eventId);
    
    try{
      const res = await authApi.get(`crowd/events/` + eventId);
      setWhoGo(res.data);
    }
    catch(err){
      console.log(err);
    }
  }

    return (
      <div className="AllEvents">
        {currentEvents.map((events, index) => 
            <div key={events.id} className="formCreateEvent">             
              <a href="#">{events.address.name}</a>
              <p className="card__event">
                Город: {events.address.city}<br/>
                Дата: {events.date}<br/>
                Время: {events.time}<br/>
                Кол-во человек: {" "}
                <Popup trigger={<a href="#" id={events.id} onMouseOver={handleWhoGoOnEvent}>{events.maximum}</a>} position="bottom center">
                  {whoGo.length !== 0 ? whoGo.map(crowd => 
                    <div className="popupNav__App" id={crowd.id}>
                      <p className="card__event">
                        {crowd.teammate.firstname + " " + crowd.teammate.lastname}
                      </p>
                    </div>) : false}
                </Popup>   
                <br/>   
                Организатор: {events.creator.firstname + " " + events.creator.lastname}<br/>
              </p>
              <button id={events.id} onClick={handleIWillGo}>Я пойду</button>
            </div>
          )}

          {filteredByUserId.length !== 0 ? 
            <div>
              <Pagination eventsPerPage={eventsPerPage} totalEvents={filteredByUserId.length} pagination={paginate}/>
              <div className="btnPagination">
                <button id='btnPrev' onClick={prevPage}>Предыдущая</button>
                <button id='btnNext' onClick={nextPage}>Следующая</button>
              </div>
            </div>
          : <h3>Событий с данными фильтрами не найдено</h3>}
      </div>
    );
  }
  
export default AllEvents;