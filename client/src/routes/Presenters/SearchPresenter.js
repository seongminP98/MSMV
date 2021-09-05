import React, {optionsState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

const Search = styled.div`
  padding-top: 40px;
  padding-bottom: 40px;
  min-height: 900px;
`;

const SearchUpper = styled.div`
  margin: auto;
  width: 900px;
  padding: auto;
  align: center;
  display: block;
  margin-bottom: 23px;
`;

const CritSelect = styled.select`
  text-align: center;
  width : 80px;
  height : 50px;
  font-size: 20px;
  margin-top : 5px;
  padding-left: 3px;
  outline: none;
  &:hover,
  &:focus {
    border: 1px solid #6799ff;
  }
`;

const CritOption = styled.option`
  text-align: center;
  font-size: 20px;
`;

const SearchInput = styled.input`
  height: 50px;
  margin-left : 10px;
  width : 810px;
  margin-top : 5px;
  font-size: 20px;
  padding-left: 5px;
  transition: border 0.1s ease-in-out;
  outline: none;
  &:hover,
  &:focus {
    border: 2px solid #6799ff;
  }
`;

const MovieCard = styled.div`
  padding : 15px;
  class: "card bg-primary mb-3";
  margin: 20px auto 20px auto;
  width: 700px;
  height: 245px;
  display: block;
  background-color: #E2E1FF;
  box-shadow: 1px 2px 2px gray;
  border-radius: 0.3em;
  font-family: 나눔고딕;
`;

const MovieImageLink = styled.div`
  class: "card-img-top";
  float: left;
  margin: auto;
`;

const MovieImage = styled.img`
  overflow: hidden;
  width: 150px;
  height: 215px;
`;

const MovieTitleLink = styled(Link)`
  text-decoration: none;
  font-size: 20px;
  color: black;
  hover {
    text-decoration: underline;
  }
  
  active {
    text-decoration: underline;
  }
`;

const MovieContent = styled.p`
  class: "card-body";
  float:right;
  margin:auto;
  width : 500px;
  text-align: left;
  size: 20px;
  dispaly:flex;
  color: black;
`;

const MovieSummary = styled.p`
  margin-top: 2px;
  text-align: left;
  color: black;
  width : 500px;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; 
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; 
  word-wrap:break-word;
  line-height: 1.5em;
  height: 7.5em;
  margin-bottom: 0;
`;

const SummaryLink = styled(Link)`
  height: 1.5em;
  position: relative;
  left:450px;
`;



const SearchPresenter = ({searchCritCheck, submitSearch, takeInput, result, currentSearch}) => {

  for (let i = 0 ; i < result.length; i++) {
    result[i].title = result[i].title.replace(/<b>/igm, '');
    result[i].title = result[i].title.replace(/<\/b>/igm, '');
    // if (result[i].rate === "0.00")
    //   result[i].rate = "정보 없음";
    if (result[i].date === '정보 없음')
      result[i].date = "개봉일 정보 없음";
    if (result[i].summary === "")
      result[i].summary = "";
  }

  return (
    
    <Search>
      
      <SearchUpper>
        <CritSelect name="SearchCrit" value={optionsState} onChange={searchCritCheck}>
          <CritOption value="title"> 제목</CritOption>
          <CritOption value="director"> 감독</CritOption>
        </CritSelect>

        <SearchInput type="text" onChange={takeInput} onKeyPress={submitSearch}
          placeholder="검색어 입력"></SearchInput>
      </SearchUpper>

      {currentSearch ? (<>
    
        {/* 무언가가 검색되었을 때의 표시 공간 */}
        <h2>'{currentSearch}' 전체 검색결과가 {result.length}건 발견되었습니다.</h2>
        {result.map((movie) => ( 
          
          <MovieCard key={movie.movieCd}>
            <MovieImageLink>
              <Link to={`/Detail?code=${movie.movieCd}`}><MovieImage alt="movie" src={movie.image} onerror="this.src='image.png'"></MovieImage></Link>
            </MovieImageLink>
            <MovieContent>
              <MovieTitleLink to={`/Detail?code=${movie.movieCd}`}>{movie.title}</MovieTitleLink> 
              <p>평점 {movie.rate}<br/>
              {movie.date}</p>
              <MovieSummary>
                {movie.summary} 
              </MovieSummary>
              <SummaryLink to={`/Detail?code=${movie.movieCd}`}>더 보기</SummaryLink>
              
            </MovieContent>
          </MovieCard>
          ))}</>) : (
        <>
        {/* 아무것도 검색되지 않았을 때의 표시 공간 */}
            <h2>제목 또는 감독으로 영화를 검색하세요.</h2>
            <div className="container">
              <blockquote className="blockquote text-center text-success">
                <p><i>"영화란 지루한 부분이 커트된 인생이다."</i></p>
                <footer className="blockquote-footer">알프레드 히치콕</footer>
              </blockquote>
            </div>
        </>)}
      
    </Search>
  )
}

export default SearchPresenter;