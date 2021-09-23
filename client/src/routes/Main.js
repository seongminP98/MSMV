import axios from 'axios';
import React, {useState, useEffect} from 'react';
import MainPresenter from './Presenters/MainPresenter.js'

const Main = () => {
  const [topTenData, setTopTenData] = useState([]);
  const [boxOfficeData, setBoxOfficeData] = useState([]);

  const getTopTen = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/top10`)
    .then((response) => {
      setTopTenData(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  const getBoxOffice = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/boxOffice`)
    .then((response) => {
      setBoxOfficeData(response.data.boxOffice);
    })
    .catch((error) => {
      window.alert(error);
    });
  }
  


  const [genre, setGenre] = useState();
  const [genreList, setGenreList] = useState([]);

  const getGenre = async () => {
    if (genre === undefined)
      setGenre(1);
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/search/genre/${genre}`)
    .then((response) => {
      setGenreList(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  const selectGenre = (e) => {
    setGenre(e.target.getAttribute("value"));
  }

  useEffect(() => getTopTen(), []);
  useEffect(() => getBoxOffice(), []);
  useEffect(() => getGenre(), [genre]);
  
  return (
    <MainPresenter topTenData={topTenData} boxOfficeData={boxOfficeData} genreList={genreList} selectGenre={selectGenre}/>
  )
}

export default Main;