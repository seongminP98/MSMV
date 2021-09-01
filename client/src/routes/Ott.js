import React, {useState} from 'react';
import axios from 'axios';
import OttListPresenter from './Presenters/OttListPresenter';
import OttRoomPresenter from './Presenters/OttRoomPresenter';
import { HashRouter as Router, Route } from 'react-router-dom'; 


const Ott = ({match}) => {
  
  

  return (
    <Router>
      <Route exact path={match.path}>
        <OttListPresenter/>
      </Route>
      <Route path={`${match.path}/:id`}>
        <OttRoomPresenter/>
      </Route>
    </Router>
  )
}

export default Ott;