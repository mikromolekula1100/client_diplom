import React from "react";
import "../styles/home.css"
import "../styles/media.css"
import courtImg from "../img/court.png"
import societyImg from "../img/society.png"

function Home() {
    return (
      <div className="Home">
        <div className="info__Home">
          <p className="header__Home">
            <strong>Веб - приложение по поиску спортплощадок, мест, и компании для проведения совместного активного досуга</strong>
          </p>
        </div>

        <div className="content__Home">
          <div className="blockCourt__Home">
            <img src={courtImg} id="courtImg"/>
            <p id="header__info">
              <strong>Поиск спортплощадок и тайм-кафе</strong>
            </p>
            <p id="footer__info">
              Приложение позволяет искать места проведения досуга, будь то площадка на улице или же крытый корт
            </p>
          </div>

          <div className="blockSociety__Home">
            <img src={societyImg} id="societyImg"/>
            <p id="header__info">
             <strong>Поиск компании для совместного досуга</strong>
            </p>
            <p id="footer__info">
              Приложение позволяет искать события создаваемые пользователями и откликаться на существующие
            </p>
          </div>
        </div> 
      </div>
    );
  }
  
export default Home;