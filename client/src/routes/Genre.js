import React, {useState, useEffect} from 'react';
import axios from 'axios';
import GenrePresenter from './Presenters/GenrePresenter';
import {useLocation} from 'react-router-dom';

const Genre = () => {
  const [currentGenre, setCurrentGenre] = useState("");
  const [result, setResult] = useState([[]]);
  const location = useLocation();
  
  console.log(location.pathname);

  const genreSearch = async (e) => {
    console.log(location);
    console.log(currentGenre);
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/search/genre/1`)
    .then((response) => {
      setResult(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
    console.log("end axios");
  }

  genreSearch();
  //useEffect(() => genreSearch(), []);

  return ( 
    <GenrePresenter currentGenre={currentGenre} result={result}/>
  )
}

export default Genre;