import React, {useState, useEffect} from 'react';
import DetailPresenter from "./Presenters/DetailPresenter.js";
import {useHistory, useLocation} from "react-router";
import axios from "axios";
import store from "../store";

const Detail = () => {
  // below for detail code
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieCd = searchParams.get("code")
  const [movieData, setMovieData] = useState([]);
  const [movieReviews, setMovieReviews] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [starRating, setStarRating] = useState(0);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  const getMovieData = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/detail/${movieCd}`)
    .then((response) => {
      setMovieData(response.data.result);
      setMovieReviews(response.data.result.review);
      setPeoples(response.data.result.people);
      console.log(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/recommend/${movieCd}`)
    .then((response) => {
      console.log(response);
      setRecommendedMovies(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }


  
  // below for review code

  const history = useHistory();

  const [reviewContent, setReviewContent] = useState('');
  //const [rating, setRate] = useState(0);

  const submitWriteReview = async () => {
    const contents = reviewContent;
    const rate = starRating.rating;
    console.log(starRating);
    const movieTitle = movieData.title;
    if (starRating === 0) {
      window.alert("별점을 매겨주세요.");
      return;
    }
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/review`, { contents, rate, movieCd, movieTitle }, {withCredentials : true})
    .then((response) => {
     console.log(response);
     window.alert("리뷰 작성 완료");
     window.location.reload();
    })
    .catch((error)=> {
      console.log(error);
      window.alert("리뷰 작성 중 오류 발생")
    })
    
  }

  const reviewOnChange = (e) => {
    setReviewContent(e.target.value);
  }

  const writeOnClick = () => {
    submitWriteReview();
  }

  const [id, setId] = useState(''); // id value for Delete Review
  
  const submitDeleteReview = async (e) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/review/${e.target.id}`, {withCredentials: true})
    .then((response) => {
     console.log(response);
     window.alert("리뷰 삭제 완료")
     window.location.reload();
    })
    .catch((error)=> {
      console.log(error);
      //window.alert(error.message);
    }) 
  }

  const onStarClick = (nextValue, prevValue, name) => {
    setStarRating({rating: nextValue});
    console.log(starRating);
  };

  useEffect(() => getMovieData(), [window.location.href]);

  return (
    <DetailPresenter movieData={movieData} movieReviews={movieReviews} peoples={peoples} recommendedMovies={recommendedMovies} reviewOnChange={reviewOnChange} writeOnClick={writeOnClick} submitDeleteReview={submitDeleteReview} starRating={starRating} onStarClick={onStarClick}/>
  )
}

export default Detail;