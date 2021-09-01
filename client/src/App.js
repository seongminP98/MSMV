import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Main from './routes/Main.js';
import Auth from './routes/Auth.js';
import Join from './routes/Join.js';
import Header from './routes/Header.js';
import Search from './routes/Search.js';
import Detail from './routes/Detail.js';
import MyPage from './routes/MyPage.js';
import Genre from './routes/Genre.js';
import Recomm from './routes/Recomm.js'
import Ott from './routes/Ott.js'

import store from "./store";
import axios from 'axios';

import { useEffect, useState } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom'; 
import { Footer } from 'antd/lib/layout/layout';
import styled from 'styled-components';

const FooterDesign = styled(Footer)`
  font-family:  system-ui;
  font-size: 12px;
  background-color: #6B66FF;
  color: white;
  height: 70px;
  border-width : 3px 0 0 0;
  border-style : solid ;
  border-color: #595959;
  padding-top: 17px;
  min-width:1190px;
`;

function App() {
  const [isLoginChecked, setIsLoginChecked] = useState(false);
  const loginCheck = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/login`, { withCredentials: true })
    .then(async (result) => {
        await store.dispatch({ type: 'LOGIN', user: result.data.data });
        setIsLoginChecked(true);
      })
    .catch((error) => {
      setIsLoginChecked(true);
    });
    

  };


  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <div className="App">
      {isLoginChecked && (
        <Router>
            <Header />
          <Route exact path="/">
            <Main />
          </Route>
          <Route exact path="/login">
            <Auth />
          </Route>
          <Route exact path="/join">
            <Join />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/genre/:tag" component={Genre}/>

          <Route exact path="/detail" component={Detail}/>
          <Route exact path="/mypage">
            <MyPage />
          </Route>
          <Route exact path="/recomm" component={Recomm}/>
          <Route path="/ott" component={Ott}/>
        </Router>
      )}
      <FooterDesign>Made by SangMyung University<br/>CS GladOS Team</FooterDesign>
    </div>
    
  );
}

export default App;
