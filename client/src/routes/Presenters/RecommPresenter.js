import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Modal, Button} from "react-bootstrap";
import styled from "styled-components";
import "../../App.css";

const Recomm = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  min-height: 900px;
`;

const SearchMovieModal = styled(Modal)`
`


const SearchInput = styled.input``;

const SearchMovieList = styled(Modal.Body)`
  display: grid;
  grid-template-columns: 1fr 1fr;

`;

const MovieCard = styled.div`
  class: "card bg-primary mb-3";
  margin: 20px auto 20px auto;
  display: grid;
  width: 360px;
  height: 129px;
  grid-template-columns: 1fr 2fr;
  box-shadow: 1px 2px 2px gray;
  font-family: 나눔고딕;
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

const ModalButtonDiv = styled.div`
  padding-right: 20px;
  display: block;
`

const SelectButton = styled.button`
  font-size: 15px;
  float: right;
`;

const RecommPresenter = ({submitSearch, takeInput, result, currentSearch, initMovieList, selectMovie, confirmMovie, recommendMovieList}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    confirmMovie();
  }
  const handleShow = () => {
    setShow(true);
    initMovieList();
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
        <SearchMovieModal.Header closeButton>
          <Modal.Title>영화 목록 선택</Modal.Title>
        </SearchMovieModal.Header>
        <SearchMovieModal.Body>
          <SearchInput type="text" onChange={takeInput} onKeyPress={submitSearch} placeholder="제목으로 영화 찾기"></SearchInput>
        </SearchMovieModal.Body>
        <SearchMovieList>
        {currentSearch ? (<>
          {result.map((movie) => ( 
            <MovieCard key={movie.movieCd}>
              <MovieImageLink>
                <Link to={`/Detail?code=${movie.movieCd}`}><MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage></Link>
              </MovieImageLink>
              <MovieContent> <Link to={`/Detail?code=${movie.movieCd}`}>{movie.title}</Link>
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
            <h2>제목으로 영화를 검색하세요.</h2>
        </>)}
        </SearchMovieList>

        <SearchMovieModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleClose}>
            결정
          </Button>
        </SearchMovieModal.Footer>
      </SearchMovieModal>

          
      {(recommendMovieList.length > 0) ? (<>
        {recommendMovieList.map((movie) => ( 
          <MovieCard key={movie.movieCode}>
            <MovieImageLink>
              <Link to={`/Detail?code=${movie.movieCode}`}><MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage></Link>
            </MovieImageLink>
            <MovieContent> <Link to={`/Detail?code=${movie.movieCode}`}>{movie.title}</Link>
            </MovieContent> 
            
          </MovieCard>
          ))}</>) : (
        <>
        {/* 아무것도 검색되지 않았을 때의 표시 공간 */}
            <h2>유사한 영화를 제공해드립니다.</h2>
        </>)}

        <Button variant="primary" onClick={handleShow}>
        추천 영화 목록 만들기
      </Button>
    </Recomm>
  )
}

export default RecommPresenter;