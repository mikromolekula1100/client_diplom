import React, { useState} from "react";
import { Route, Routes, BrowserRouter as Router, Link } from "react-router-dom";
import Popup from 'reactjs-popup';
import Home from "./pages/Home"
import Main from "./pages/Main"
import Error from "./pages/Error"
import "./styles/home.css"
import axios from "axios";
import authApi, {API_URL} from "./api/axios";

function App() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    
    const userForReg = {
      firstname: firstname,
      lastname: lastname,
      email: username,
      password: password
    }

    const userForAuth={
      email: username,
      password: password
    }

    const handleFirstnameChange = (e) => {
      setFirstname(e.target.value);
    };
    
    const handleLastnameChange = (e) => {
      setLastname(e.target.value);
    };

    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
    
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };

    const handleTokenChange = (e) => {
      setToken(e.target.value);
    };
    
    const handleLogin = (e) => {
      try{
        authApi.post(`auth/login`, userForAuth).then(response => {
          if (response.status === 200){
            setIsLoggedIn(true);
          }
        });
        
        console.log(localStorage.getItem('token'))
      }
      catch(err){
        console.log(err);
      }
      
    };
    
    const handleLogout = (e) => {
      try{
        authApi.post(`auth/logout`, userForAuth);
        setIsLoggedIn(false);
      }
      catch(err){
        console.log(err);
      }
    };

    const handleRegistration = (e) => {
      try{
        axios.post(API_URL + 'auth/reg/', userForReg, {headers: {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"}} ).
        then(response => {
          if (response.status === 200){
            console.log(response.data.value);
            localStorage.setItem('token', response.data.value);
            localStorage.setItem('userId', response.data.userId)

            setIsRegistration(true);
          }
        });}
      catch (err){
        console.log(err);
      }
    }

    const handleConfirmToken = (e) => {
      try{
        authApi.post(`auth/confirm?token=${token}`, userForAuth).then(response =>{
          if (response.status === 200){
            setIsRegistration(false);
          }
        });
      }
      
      catch(err){
        console.log(err);
      }
    }

    
  return (
      <Router>

        <div className="App">
          <header className="header__App">
            <nav className="nav__App">
              <h1>Кто? Где? Когда?</h1>
              <Link to="/">Главная</Link>
              <Link to="/main">Поиск мест и событий</Link>
               
              <Popup trigger=
                  {<a href="#">Регистрация</a>}
                  position="bottom center">
                   
                  <div className="popupNav__App">
                    
                    <input type="text" placeholder="Имя" value={firstname} onChange={handleFirstnameChange}></input>
                    <input type="text" placeholder="Фамилия" value={lastname} onChange={handleLastnameChange}></input>
                    <input type="email" placeholder="Введите логин" value={username} onChange={handleUsernameChange}></input>
                    <input type="password" placeholder="Придумайте пароль" value={password} onChange={handlePasswordChange}></input>
                    
                    {isRegistration === false ? <button onClick={handleRegistration}>Зарегистрироваться</button> : false}

                    {isRegistration === true ? 
                      <div className="popupNav__App">
                      
                        <input placeholder="Введите токен из почты" value={token} onChange={handleTokenChange}></input>
                        <button onClick={handleConfirmToken}>Подтвердить</button>
                    </div> : false}
                  </div>   
              </Popup>
              
              <Popup trigger=
                  {<a href="#">Вход</a>}
                  position="bottom center">
                  <div className="popupNav__App">
                    
                    {isLoggedIn === false ? 
                      <div>
                        <input type="email" placeholder="Введите логин" onChange={handleUsernameChange}></input>
                        <input type="password" placeholder="Введите пароль" onChange={handlePasswordChange}></input>
                        <button onClick={handleLogin}>Войти</button>
                      </div> : false}
                    
                    {isLoggedIn === true ? 
                      <div>
                        <button onClick={handleLogout}>Выйти</button>
                      </div> : false}
                  </div>  
              </Popup>
            </nav>
          </header>
        </div>

          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/main" element={<Main isLoggedIn={isLoggedIn}/>}/>
            <Route path="*" element={<Error/>}/>
          </Routes>

          <article>
            <footer>
              <h2>Как связаться</h2>
              <p>
                <a href="mailto:yaroslavslastunov@gmail.com">yaroslavslastunov@gmail.com</a> или <a href="mailto:maxpaul506@gmail.com">maxpaul506@gmail.com</a>
                <br/> 
                Samara @Copyright 2023
              </p>
            </footer>
          </article>
      </Router>
  );
}

export default App;
