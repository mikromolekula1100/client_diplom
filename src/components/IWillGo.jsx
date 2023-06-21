import React, { useState, useEffect } from 'react';
import "../styles/main.css"
import Popup from 'reactjs-popup';
import axios from "axios";
import authApi, {API_URL} from "../api/axios";
import Pagination from './Pagination';

var eventId;
var temp = false;

function IWillGo( { city, sport, userID } ){
    const [myEvents, setMyEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(3);
    const [whoGo, setWhoGo] = useState([]);
    
    useEffect(() => {
      async function getCrowd(){
        authApi.get(`crowd`).then(response => 
        {
            setMyEvents(response.data);
            
        })
      }
      getCrowd();
      
      if(temp === true){
        getCrowd();
        temp = false;
      }
      
    }, [temp]);

    const filteredByUser = myEvents.filter(crowd => {
      return crowd.teammate.id.includes(localStorage.getItem('userId'));
    });

    const handleDeleteEvent = (e) =>{
        try{
          authApi.delete(`crowd/` + e.target.id);
          
          setMyEvents(filteredByUser.splice(e.target.id, 1))
          temp = true;
          console.log(filteredByUser);
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
    const currentEvents = filteredByUser.slice(firstEventsIndex, lastEventsIndex) 

    const paginate = pageNumber => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage( prev => prev + 1);
    const prevPage = () => setCurrentPage( prev => prev - 1);

    return (
        <div>
          
          {currentEvents.map((myEvents, index) => 
              <div key={myEvents.id} className="formCreateEvent">
                <a id={myEvents.id} href="#">{myEvents.events.address.name}</a>               
                <br/>               
                <p className="card__event">
                  Город: {myEvents.events.address.city}<br/>
                  Дата: {myEvents.events.date}<br/>
                  Время: {myEvents.events.time}<br/>
                  Кол-во человек: {" "}                 
                  <Popup trigger={<a href="#" id={myEvents.events.id} onMouseOver={handleWhoGoOnEvent}>{myEvents.events.maximum}</a>} position="bottom center">            
                  {whoGo.length !== 0 ? whoGo.map(crowd => 
                    <div className="popupNav__App" id={crowd.id}>
                      <p className="card__event">
                        {crowd.teammate.firstname + " " + crowd.teammate.lastname}
                      </p>
                    </div>) : false}
                  </Popup>
                  <br/>
                  Организатор: {myEvents.events.creator.firstname + " " + myEvents.events.creator.lastname}<br/>
                </p>
                <button id={myEvents.id} onClick={handleDeleteEvent}>Я не пойду</button>
              </div>
            )}

            {filteredByUser.length !== 0 ? 
            <div>
              <Pagination eventsPerPage={eventsPerPage} totalEvents={filteredByUser.length} pagination={paginate}/>
              <div className="btnPagination">
                <button id="btnPrev" onClick={prevPage}>Предыдущая</button>
                <button id="btnNext" onClick={nextPage}>Следующая</button>
              </div>
            </div>
          : <h3>Вы не подписались ни на одно событие</h3>}      
        </div>
    );
}

export default IWillGo;