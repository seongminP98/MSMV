import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenrePresenter from './Presenters/GenrePresenter';
import {useLocation} from 'react-router-dom';

const Genre = () => {
  const [result, setResult] = useState([[]]);
  const location = useLocation();
  
  console.log(location.pathname);

  const genreSearch = async (e) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/search${location.pathname}`)
    .then((response) => {
      console.log(response.data.result);
      setResult(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
    
    console.log("end axios");
  }
  useEffect(() => genreSearch(), []);

  return ( 
    <GenrePresenter result={result}/>
  )
}

export default Genre;