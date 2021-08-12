import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenrePresenter from './Presenters/GenrePresenter';
import {useLocation} from 'react-router-dom';

const Genre = () => {
  const [currentGenre, setCurrentGenre] = useState("Init");
  const [result, setResult] = useState([]);
  const location = useLocation();
  console.log(location);
  //etCurrentGenre(window.location.pathname);

  const genreSearch = async (e) => {
    console.log("genreSearch");
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/search/genre${currentGenre}`)
    .then((response) => {
      setResult(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
    console.log("end axios");
  }


  return ( 
    <GenrePresenter currentGenre={currentGenre} result={result}/>
  )
}

export default Genre;