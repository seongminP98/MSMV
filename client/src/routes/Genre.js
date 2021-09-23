import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenrePresenter from './Presenters/GenrePresenter';
import {useLocation} from 'react-router-dom';

//unused page

const Genre = () => {
  const [result, setResult] = useState([[]]);
  const location = useLocation();

  const genreSearch = async (e) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/search${location.pathname}`)
    .then((response) => {
      setResult(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
  }
  useEffect(() => genreSearch(), []);

  return ( 
    <GenrePresenter result={result}/>
  )
}

export default Genre;