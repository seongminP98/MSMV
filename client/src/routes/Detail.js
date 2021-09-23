import React, {useState, useEffect} from 'react';
import DetailPresenter from "./Presenters/DetailPresenter.js";
import {useLocation} from "react-router";
import axios from "axios";
import swal from "@sweetalert/with-react";

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
    })
    .catch((error) => {
    });

    await axios.get(`${process.env.REACT_APP_SERVER_URL}/post/recommend/${movieCd}`)
    .then((response) => {
      if (response.status === 204)
        setRecommendedMovies([]);
      else {
        console.log(response); // for test
        response.data.result.forEach(function(item, index, object) {
          if (item.image === 'https://ssl.pstatic.net/static/movie/2012/06/dft_img203x290.png') {
            object.splice(index, 1);
          }
        });
        setRecommendedMovies(response.data.result);
      }
    })
    .catch((error) => {
    });
  }


  
  // below for review code

  const [reviewContent, setReviewContent] = useState('');
  //const [rating, setRate] = useState(0);

  const submitWriteReview = async () => {
    const contents = reviewContent;
    const rate = starRating.rating;
    const movieTitle = movieData.title;
    if (starRating === 0) {
      swal("별점을 매겨주세요.");
      return;
    }

    if (contents === "") {
      swal("내용을 입력해주세요.");
      return;
    }

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/review`, { contents, rate, movieCd, movieTitle }, {withCredentials : true})
    .then((response) => {
     getMovieData();
    })
    .catch((error)=> {
      swal("리뷰 작성 중 오류가 발생했습니다.")
    })
    
  }

  const reviewOnChange = (e) => {
    setReviewContent(e.target.value);
  }

  const writeOnClick = () => {
    submitWriteReview();
  }
  
  const submitDeleteReview = async (e) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/review/${e.target.id}`, {withCredentials: true})
    .then((response) => {
     swal("리뷰가 삭제되었습니다.")
     getMovieData();
    })
    .catch((error)=> {
      swal(error.response.data.message);
    }) 
  }

  const onStarClick = (nextValue, prevValue, name) => {
    setStarRating({rating: nextValue});
  };

  useEffect(() => getMovieData(), [window.location.href]);

  return (
    <DetailPresenter movieData={movieData} movieReviews={movieReviews} peoples={peoples} recommendedMovies={recommendedMovies} reviewOnChange={reviewOnChange} writeOnClick={writeOnClick} submitDeleteReview={submitDeleteReview} starRating={starRating} onStarClick={onStarClick}/>
  )
}

export default Detail;