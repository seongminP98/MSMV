import axios from 'axios';
import React, {useState, useEffect} from 'react';
import RecommPresenter from './Presenters/RecommPresenter.js'

const Recomm = () => {
  const [searchContent, setSearchContent] = useState('');
  let [result, setResult] = useState([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const props = {searchContent, result, currentSearch};

  const submitSearch = async (e) => {
    if (e.key === "Enter") {
      if (searchContent === '') { // 아무것도 입력하지 않을 시
        setCurrentSearch(searchContent);
        return; // 아무것도 반환하지 않음
      }
      const check = 1;
      const movieNm = searchContent;
      console.log("start axios");
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, { check, movieNm })
      .then((response) => {
        if (response.status === 204)
          setResult([]);
        else
          setResult(response.data.result);
      })
      .catch((error) => {
        window.alert(error.response.data.message);
      });
      console.log("end axios");
    
      //result.sort((a, b) => a.rate < b.rate);
      console.log(result);
      setCurrentSearch(searchContent);
    }
  }
  
  const takeInput = (e) => {
    setSearchContent(e.target.value);
  }
  
  const [movieList, setMovieList] = useState([]);

  const selectMovie = async (e) => {
    if (movieList.length < 5)
      if (!movieList.includes(e.target.value))
        setMovieList(movieList => [...movieList, e.target.value]);
    console.log(movieList);
  }

  const confirmMovie = async () => {
    if (movieList.length === 0)
      window.alert("Enter somethign");
    else {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/personalrcm`, { movieList }, {withCredentials : true})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    
      await showRecommendMovies();
      await getSelectedMovies();
      setMovieList([]);
      setSelectedMovies([]);
    }
  }

  const [recommendMovieList, setRecommendMovieList] = useState([]);

  const showRecommendMovies = async () => {
    
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/personalrcm`, {withCredentials : true})
    .then((response) => {
      console.log(showRecommendMovies);
      console.log(response);
      if (response.data.result.length===0)
        setRecommendMovieList(undefined);
      else
        setRecommendMovieList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [selectedMovies, setSelectedMovies] = useState([]);
  
  const showSelectedMovies = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/personalrcm/usermovie`, {movieList}, {withCredentials : true})
    .then((response) => {
      console.log(response);
      if (response.data.result==="먼저 영화를 선택해주세요.")
        setSelectedMovies([]);
      else
        setSelectedMovies(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [selectedMovieList, setSelectedMovieList] = useState([]);

  const getSelectedMovies = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/personalrcm/usermovies`, {withCredentials : true})
    .then((response) => {
      console.log(response);
      setSelectedMovieList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  useEffect(() => showRecommendMovies(), []);
  useEffect(() => showSelectedMovies(), [movieList]);
  useEffect(() => getSelectedMovies(), []);

  return (
    <RecommPresenter submitSearch={submitSearch} takeInput={takeInput} selectMovie={selectMovie} confirmMovie={confirmMovie} recommendMovieList={recommendMovieList} selectedMovies={selectedMovies} selectedMovieList={selectedMovieList} {...props}/>
  )
}

export default Recomm;