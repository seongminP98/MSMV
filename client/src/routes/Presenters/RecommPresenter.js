import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Modal, Button} from "react-bootstrap";
import styled from "styled-components";
import { Swiper, SwiperSlide } from 'swiper/react';
import "../../App.css";

const Recomm = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  min-height: 900px;
`;

const SearchMovieModal = styled(Modal)`
`

const SearchInput = styled.input`
  height: 50px;
  width : 510px;
  margin-left: 125px;
  margin-top : 5px;
  font-size: 20px;
  transition: border 0.1s ease-in-out;
  outline: none;
  &:hover,
  &:focus {
    border: 2px solid #6799ff;
  }
`;

const SelectMovieLine = styled.div`
  display: float;
  margin: auto;
  margin-top : 30px;
  padding-bottom : 110px;
  width: 92%;
  border-bottom: 1px solid;
`
const SelectMovieCard = styled.div`
  max-width: 80px;
  max-height: 100px;
  display:grid;
  grid-template-rows: 3fr 1fr;
  margin: auto;
`

const SelectTitle = styled.div`
  text-align: center;
  color: black;
  hover {
    text-decoration: underline;
  }
  active {
    text-decoration: underline;
  }
  padding-top: 4px;
  font-size: 15px;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; 
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; 
  word-wrap:break-word;
  line-height: 1.5em;
  height: 4.5em;
`

const SelectAsk = styled.h2`
  margin: auto;
  height: 100px;
  position: relative;
  top: 60px;
`

const SearchMovieList = styled(Modal.Body)`
  display: grid;
  grid-template-columns: 1fr 1fr;

`;

const MovieCard = styled.div`
  class: "card bg-primary mb-3";
  margin: 5px auto 20px auto;
  display: grid;
  width: 360px;
  height: 129px;
  grid-template-columns: 1fr 2fr;
  font-family: 고딕;
`;

const MovieImageLink = styled.div`
  class: "card-img-top";
  margin: auto;
`;

const MovieImage = styled.img`
  overflow: hidden;
  width: 90px;
  height: 129px;
`;

const MovieContent = styled.div`
  display: grid;
  grid-template-rows: 2fr 1fr;
  text-decoration: none;
  font-size: 21px;
  color: black;
  hover {
    text-decoration: underline;
  }

  active {
    text-decoration: underline;
  }
`;

const RecommContent = styled.div`
  margin-top:10px;
  text-decoration: none;
  font-size: 21px;
  color: black;
  hover {
    text-decoration: underline;
    
  }

  active {
    text-decoration: underline;
  }
`;

const RecommLink = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  color: black;
  hover {
    text-decoration: underline;
  }

  active {
    text-decoration: underline;
  }
`

const ModalButtonDiv = styled.div`
  padding-right: 20px;
  display: block;
`

const SelectButton = styled.button`
  background-color: #7D79FF;
  color : white;
  margin-left: 170px;
  cursor: pointer;
  font-size: 18px;
  transition: .2s all;
  font-family: 'Jua', sans-serif;
  border-radius: 5px;
  border-color: white;
  &:hover {
      background: white;
      color: #6b66ff;
  }
`;

const MovieTitle = styled(Link)`
  color: black;
  hover {
    text-decoration: underline;
  }
  active {
    text-decoration: underline;
  }
`

const SwipeDiv = styled.div`
  padding-top: 25px;
`;

const RecommTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  font-family: 'Nanum Gothic', sans-serif;
`;

const SwipePad = styled.div`
    padding-left: 100px;
    padding-right: 100px;
`;

const NoMovieDiv = styled.div`
  margin-top : 10px;
  font-size: 20px;
  margin-bottom: 10px;
`

const RecommPresenter = ({submitSearch, takeInput, result, currentSearch, selectMovie, confirmMovie, recommendMovieList, selectedMovies, selectedMovieList}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }

  const handleConfirm = () => {
    confirmMovie();
    setShow(false);
  }

  const handleShow = () => {

    setShow(true);
  }

  for (let i = 0 ; i < result.length; i++) {
    result[i].title = result[i].title.replace(/<b>/igm, '');
    result[i].title = result[i].title.replace(/<\/b>/igm, '');
    if (result[i].date === '정보 없음')
      result[i].date = "개봉일 정보 없음";
    if (result[i].summary === "")
      result[i].summary = "";
  }

  return (
    <Recomm>
      <SearchMovieModal show={show} onHide={handleClose} size="lg">
        <SearchMovieModal.Header>
          <Modal.Title>영화 목록 선택</Modal.Title>
        </SearchMovieModal.Header>
        <SearchMovieModal.Body>
          <SearchInput type="text" onChange={takeInput} onKeyPress={submitSearch} placeholder="제목으로 영화 찾기"></SearchInput>
          
          <SelectMovieLine>
            {!(selectedMovies.length === 0) ? (<>
              {selectedMovies.map((movie) => ( 
                <SelectMovieCard key={movie.movieCd}>
                  <MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage> 
                  <SelectTitle to={`/Detail?code=${movie.movieCd}`}><b>{movie.title}</b></SelectTitle>
                </SelectMovieCard>
              ))}</>) : (
            <>
            {/* 아무것도 검색되지 않았을 때의 표시 공간 */}
              <SelectAsk>추천 영화를 선택하세요. (최대 5개)</SelectAsk>
            </>)}
          </SelectMovieLine>
        </SearchMovieModal.Body>

        <SearchMovieList>
        {currentSearch ? (<>
          {result.map((movie) => ( 
            <MovieCard key={movie.movieCd}>
              <MovieImageLink>
                <Link to={`/Detail?code=${movie.movieCd}`}><MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage></Link>
              </MovieImageLink>
              <MovieContent> <MovieTitle to={`/Detail?code=${movie.movieCd}`}>{movie.title}</MovieTitle>
                <ModalButtonDiv>
                  <SelectButton value={movie.movieCd} onClick={selectMovie}>
                    선택
                  </SelectButton>
                </ModalButtonDiv>
              </MovieContent>              
            </MovieCard>
          ))}</>) : (
        <>
        {/* 아무것도 검색되지 않았을 때의 표시 공간 */}
        </>)}
        </SearchMovieList>

        <SearchMovieModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            결정
          </Button>
        </SearchMovieModal.Footer>
      </SearchMovieModal>

      <SelectMovieLine>
        {selectedMovieList ? (<>
          {selectedMovieList.map((movie) => ( 
            <SelectMovieCard key={movie.movieCd}>
              <MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage> 
              <SelectTitle to={`/Detail?code=${movie.movieCd}`}><b>{movie.title}</b></SelectTitle>
            </SelectMovieCard>
          ))}</>) : (
        <>
        {/* 아무것도 검색되지 않았을 때의 표시 공간 */}
          <SelectAsk>현재 데이터 없음</SelectAsk>
        </>)}
      </SelectMovieLine>

      <SwipeDiv>
        <RecommTitle>추천 영화</RecommTitle><hr />
        {recommendMovieList.length ? <SwipePad>
          <Swiper
            className="banner"
            spaceBetween={10}
            slidesPerView={(recommendMovieList.length < 5) ? recommendMovieList.length : 5}
            slidesPerGroup={5}
            navigation
            pagination={{ clickable: true }} 
          >
            {recommendMovieList && recommendMovieList.map((movie) => ( 
            <SwiperSlide key={movie.movieCode}> 
              <Link to={`/Detail?code=${movie.movieCode}`}>
                <img style={{ width:'auto', height:'100%'}} src={movie.image} alt={movie.title}></img>
              </Link>
              <RecommContent> 
                <RecommLink to={`/Detail?code=${movie.movieCode}`}><b>{movie.title}</b></RecommLink>
              </RecommContent> 
            </SwiperSlide>
            ))}
            <br/>
            <br/>
          </Swiper>   
        </SwipePad> : <SwipePad>
          <SwiperSlide>
            <NoMovieDiv>집계된 데이터가 없습니다.</NoMovieDiv>
          </SwiperSlide>
        </SwipePad>}
      </SwipeDiv>
        
      <Button variant="primary" onClick={handleShow}>
        추천 영화 목록 만들기
      </Button>
    </Recomm>
  )
}

export default RecommPresenter;