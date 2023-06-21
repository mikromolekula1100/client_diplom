import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import Popup from 'reactjs-popup';
import "../styles/main.css"
import axios from "axios";
import authApi, {API_URL} from "../api/axios";

var eventId;
var temp = false;

function MyEvents( {isCreate} ) {
    const [myEvents, setMyEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(3);
    const [whoGo, setWhoGo] = useState([]);
    
    useEffect(() => {
      async function getEvents(){
        authApi.get(`events`).then(response => 
        {
          setMyEvents(response.data);
          
        })
      }
      getEvents();

      if(temp === true || isCreate === true){
        getEvents();
        temp = false;
        isCreate = false;
      }
    }, [temp, isCreate]);

    const filteredMyEvents = myEvents.filter(event => {
      return event.creator.id.includes(localStorage.getItem('userId'));
    });

    const handleDeleteEvent = (e) =>{
      try{
        authApi.delete(`events/` + e.target.id);
        setMyEvents(filteredMyEvents.splice(e.target.id, 1));
        temp = true;
      }
      catch(err){
        console.log(err);
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
  
    const lastEventsIndex = currentPage * eventsPerPage;
    const firstEventsIndex = lastEventsIndex - eventsPerPage;
    const currentEvents = filteredMyEvents.slice(firstEventsIndex, lastEventsIndex) 
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage( prev => prev + 1);
    const prevPage = () => setCurrentPage( prev => prev - 1);

    return (
      <div>
        {currentEvents.map((myEvents, index) => 
            <div key={myEvents.id} className="formCreateEvent">
              <a id={myEvents.id} href="#">{myEvents.address.name}</a>             
              <br/>              
              <p className="card__event">
                Город: {myEvents.address.city}<br/>
                Дата: {myEvents.date}<br/>
                Время: {myEvents.time}<br/>
                Кол-во человек: {" "}                
                <Popup trigger={<a href="#" id={myEvents.id} onMouseOver={handleWhoGoOnEvent}>{myEvents.maximum}</a>} position="bottom center">                
                  {whoGo.length !== 0 ? whoGo.map(crowd => 
                    <div className="popupNav__App" id={crowd.id}>
                      <p className="card__event">
                        {crowd.teammate.firstname + " " + crowd.teammate.lastname}
                      </p>
                    </div>) : false}
                </Popup>
                <br/>
                Организатор: {myEvents.creator.firstname + " " + myEvents.creator.lastname}<br/>
              </p>
              <button id={myEvents.id} onClick={handleDeleteEvent}>Удалить</button>
            </div>
          )}
            {filteredMyEvents.length !== 0 ? 
            <div>
              <Pagination eventsPerPage={eventsPerPage} totalEvents={filteredMyEvents.length} pagination={paginate}/>
              <div className="btnPagination">
                <button id='btnPrev' onClick={prevPage}>Предыдущая</button>
                <button id='btnNext' onClick={nextPage}>Следующая</button>
              </div>
            </div>
          : <h3>Вы не создали ни одного события</h3>}
      </div>  
    );
}
  
export default MyEvents;