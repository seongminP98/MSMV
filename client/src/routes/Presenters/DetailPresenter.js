import React from 'react';
import store from '../../store';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {Row, Col, Comment} from 'antd';
import 'antd/dist/antd.css';
import 'antd/dist/antd.less';
import '../../App.css';
import StarRatingComponent  from 'react-star-rating-component';
import moment from 'moment';
import { Tab, Tabs } from 'react-bootstrap';

const DetailContainer=styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 450px;
  border: 1px #F6F6F6;
`;

const DetPad=styled.div`
  padding: 20px;
`
const ReviewButton = styled.button`
  font-weight: 600;
  color: white;
  border: 1px solid #6799FF;
  padding: 0.5rem;
  padding-bottom: 0.4rem;
  margin-left:5px;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  font-size:18px;
  transition: .2s all;
  background:#6B66FF;

  &:hover {
      background-color: white;
      color: #6799FF;
  }
`;
const ReviewTitle = styled.div`
  margin-top: 50px;
  font-size: 30px;
  font-weight: 700;
  font-family: 'Nanum Gothic', sans-serif;
`;

const Detail = styled.div`
    margin-left:40px;
    margin-right:40px;
    min-width:1190px;
`;

const Pad = styled.div`
    margin: auto;
    width : 1000px;
`;
const ComLeft = styled.div`
    font-size: 15px;
    text-align: left;
`;


//현정
const ThemovieTitle = styled.div`
    font-family: 'Nanum Gothic', sans-serif;
    font-weight: 700;
    font-size:40px;
`;
const MovieOutline = styled.div`
    font-family: 'Nanum Gothic', sans-serif;
    font-size:15px;
`;
const MovieElement = styled.div`
    font-family: 'Nanum Gothic', sans-serif;
    text-align: justify;
    padding-top:10px;
    font-size:15px;
`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    white-space: pre-line;
    margin-left:60px;
    margin-right:60px;
    column-gap: 15px;
`;
const MyImage = styled.img`
    margin:auto;
    margin-top:20px;
    // padding:10px;
    width:550px;
`;


const ReviewContent = styled(ComLeft)`
  font-family: '나눔고딕'
`

const Font = styled.div`
  font-family: 'Gowun Dodum', sans-serif;
  font-size:15px;
`;

const ReviewDeleteButton = styled.button`
  color: white;
  background-color: #6B66FF;
  border-color: #6B66FF;
`

const PeopleWord = styled.div`
  font-size : 13px;
`;

const TitleWord = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  font-size : 15px;
  font-weight: 600;
`;

const NonReviewDiv = styled.div`
  margin: 15px;
  font-family: '나눔고딕'
`
const YTButton = styled.div`
  width: 40px;
  height: 40px;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 2px;
  transition: .2s all;
  background: red;

  &:hover {
      background: black;
  }
`;

const DetailPresenter = ({movieData, movieReviews, peoples, recommendedMovies, reviewOnChange, writeOnClick, submitDeleteReview, starRating, onStarClick}) => {
  const director = [];
  const actor = [];

  for (let i = 0 ; i < peoples.length; i++) {
    let people = peoples[i];
    people.peopleJob = people.peopleJob.replace(/\n/g,' ');
    people.peopleJob = people.peopleJob.replace(/\t/g,'');

    if (people.peopleJob === "감독") {
      director.push(people);
    }
    else
      actor.push(people);
  }

  return (
      <Detail>
        <GridContainer>
          <MyImage src={movieData.image} alt={movieData.title}/>
          <MovieElement>
            <br/>
            <ThemovieTitle>{movieData.title}</ThemovieTitle>
            <br/>
            <MovieOutline>
              <p>관람등급 : {movieData.grade}<br/>
              개봉 날짜 : {movieData.openDt}<br/>
              장르 : {movieData.genres}<br/>
              국가 : {movieData.country}<br/>
              상영시간 : {movieData.runningTime}</p>
              <br/>
            <p style={{ color: 'black', fontStyle: 'italic', fontSize:'20px', fontWeight: 'bold'}}> 
              이 영화가 해시태그로 달린 유튜브 영상 보러가기!
            </p>
            
            <a href={`https://www.youtube.com/results?search_query=%23${movieData.title}`}>
              <YTButton>
              <img src="https://beslow.co.kr/assets/img/video_play.png" width="25px" />
              </YTButton>
              </a>           
            <br/>
            </MovieOutline>
            
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="home" title="줄거리">
                <DetailContainer><DetPad>{movieData.summary}</DetPad></DetailContainer>
              </Tab>
              <Tab eventKey="profile" title="감독">
                <PeopleWord>
                <div label="감독" span={3} contentStyle={{ background: "white" }}>
                  {director && director.map((people) => ( 
                    <React.Fragment key={people.peopleName}>
                        <img style={{width:'90px', height:'auto'}} src={people.peopleImage} alt={people.peopleName}/><br/>
                        <TitleWord>{people.peopleName}</TitleWord>
                        <p>{people.peopleJob}</p>
                    </React.Fragment>
                ))}</div>
                </PeopleWord>
              </Tab>
              <Tab eventKey="contact" title="배우">
                <PeopleWord>
                <div label="배우" span={3} contentStyle={{ background: "white" }}>
                  
                  <Row gutter={[16,16]}>
                    {actor && actor.map((people) => ( 
                    <React.Fragment key={people.index}>
                      <Col lg={4} md={6} xs={12}>
                        <img style={{ width:'100%', height:'auto'}} src={people.peopleImage} alt={people.peopleName}/> 
                        <TitleWord>{people.peopleName}</TitleWord>
                        <p>{people.peopleJob}</p>
                      </Col>
                    </React.Fragment>
                  ))}
                  </Row>
                </div>
                </PeopleWord>
              </Tab>
              <Tab eventKey="recommend" title="추천영화">
                {recommendedMovies.length ? <div label="추천" span={3} contentStyle={{ background: "white" }}>
                  <DetailContainer><DetPad>
                    <Row gutter={[16,16]}>
                      {recommendedMovies && recommendedMovies.map((movie) => ( 
                        <React.Fragment key={movie.movieCode}>
                          <Col lg={6} md={6} xs={12}>
                            <Link to={`/Detail?code=${movie.movieCode}`}> <img src={movie.image} alt="" width="100%" height="auto"/> </Link>
                            <TitleWord>{movie.title}</TitleWord>
                          </Col>
                        </React.Fragment>
                      ))}
                      
                      </Row>
                    </DetPad></DetailContainer>
                  </div> : <div>관련된 영화 데이터가 없습니다.</div>}
                
              </Tab>
            </Tabs>
            </MovieElement>
        </GridContainer>
      
    <div>
      <ReviewTitle>영화 리뷰</ReviewTitle>
      {store.getState().user ? (<Pad>
        <Font>
          <StarRatingComponent 
              name="rate1" 
              starCount={5}
              size={20}
              value={starRating.rating}
              onStarClick={onStarClick}
          />
          <form style={{ display: 'flex' }}>
            <textarea style={{ width: '80%', borderRadius: '2px' }}
              onChange={reviewOnChange}
              placeholder="리뷰를 입력해주세요">
            </textarea>
            <ReviewButton style={{ width: '20%', height: '52px' }} onClick={writeOnClick}>작성</ReviewButton>
          </form>
        </Font>
      </Pad>):(<div>리뷰를 작성하려면 로그인하세요.</div>)} 
    </div>
    
    <Pad>
      <Font>
      {movieReviews.length !== 0 ? (
        <>
        {movieReviews.map((review) => ( 
          <Comment 
            actions={[
              <React.Fragment key={review.id}>
              <div>
                {store.getState().user ? (
                  (store.getState().user.id === review.commenter) ? (
                    <ReviewDeleteButton type="button" id={review.id} onClick={submitDeleteReview}>리뷰 삭제</ReviewDeleteButton>
                    ) : (<p>{review.commenter}, {store.getState().user.id}</p>)
                    ) : (<p></p>)
                }
              </div>
              </React.Fragment>
            ]}
            content={
              <ReviewContent>
                <div>        
                  <b>{review.nickname}</b> &nbsp;{moment(review.created).format("YYYY-MM-DD")} 작성<br/>
                  <StarRatingComponent 
                    name="rate2" 
                    editing={false}
                    starCount={5}
                    value={review.rate}
                  /><br/>
                </div>
                <div> 
                  {review.contents}
                </div>
              </ReviewContent>
            }>
            <hr/>
          </Comment>
        ))}
        </>
      ):(
        <NonReviewDiv>리뷰가 없습니다.</NonReviewDiv>
      )}
      </Font>
    </Pad>
    </Detail>
  )
}

export default DetailPresenter;