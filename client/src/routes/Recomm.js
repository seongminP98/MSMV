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
  
  const initMovieList = () => {
    setMovieList([]);
  }

  const selectMovie = (e) => {
    if (movieList.length < 5)
      if (!movieList.includes(e.target.value))
        setMovieList(movieList => [...movieList, e.target.value]);
    console.log(movieList);
  }

  const confirmMovie = async (e) => {
    if (!movieList)
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
    }
  }

  const [recommendMovieList, setRecommendMovieList] = useState([]);

  const showRecommendMovies = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/personalrcm`, {withCredentials : true})
    .then((response) => {
      console.log(response);
      if (response.data.result==="먼저 영화를 선택해주세요.")
        setRecommendMovieList([]);
      else
        setRecommendMovieList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => showRecommendMovies(), []);

  return (
    <RecommPresenter submitSearch={submitSearch} takeInput={takeInput} initMovieList={initMovieList} selectMovie={selectMovie} confirmMovie={confirmMovie} recommendMovieList={recommendMovieList} {...props}/>
  )
}

export default Recomm;