import axios from 'axios';
import React, {useState, useEffect} from 'react';
import RecommPresenter from './Presenters/RecommPresenter.js'
import swal from "@sweetalert/with-react";

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
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/search`, { check, movieNm })
      .then((response) => {
        if (response.status === 204)
          setResult([]);
        else
          setResult(response.data.result);
      })
      .catch((error) => {
        swal(error.response.data.message);
      });
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
  }

  const deleteMovie = async (e) => {
    if (movieList.length === 1)
      setMovieList([]);
    else {
      setMovieList(movieList.filter((movie) => movie !== e.target.getAttribute("value")));
    }
    
  }

  const confirmMovie = async () => {
    if (movieList.length === 0)
      swal("하나 이상의 영화를 선택해주세요.");
    else {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/personalrcm`, { movieList }, {withCredentials : true})
      .then((response) => {
        swal("아래에서 추천 영화를 확인하세요!");
      })
      .catch((error) => {
        console.error(error);
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
      if (response.status === 204) {
        setRecommendMovieList(undefined);
      }
      else
        setRecommendMovieList(response.data.result);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const [selectedMovies, setSelectedMovies] = useState([]);
  
  const showSelectedMovies = async () => {
    if (movieList.length === 0)
      setSelectedMovies([]);
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/personalrcm/usermovie`, {movieList}, {withCredentials : true})
    .then((response) => {    
      if (response.data.result==="먼저 영화를 선택해주세요.")
        setSelectedMovies([]);
      else
        setSelectedMovies(response.data.result);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const [selectedMovieList, setSelectedMovieList] = useState([]);

  const getSelectedMovies = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/personalrcm/usermovies`, {withCredentials : true})
    .then((response) => {
      setSelectedMovieList(response.data.result);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  useEffect(() => showRecommendMovies(), []);
  useEffect(() => showSelectedMovies(), [movieList]);
  useEffect(() => getSelectedMovies(), [movieList]);

  return (
    <RecommPresenter submitSearch={submitSearch} takeInput={takeInput} selectMovie={selectMovie} deleteMovie={deleteMovie} confirmMovie={confirmMovie} recommendMovieList={recommendMovieList} selectedMovies={selectedMovies} selectedMovieList={selectedMovieList} {...props}/>
  )
}

export default Recomm;