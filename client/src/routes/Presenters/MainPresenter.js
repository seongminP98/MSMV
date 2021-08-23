import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Autoplay, Scrollbar } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import '../../App.css';

// const Wrapper = styled.div`
    
// `;

const MainPage = styled.div`
  background-color: white;
  min-width:1190px;
`;
// origin background-color: #eaeaea;

// const MainDiv = styled.div`
  
// `;

// const SearchedDiv = styled.div`

// `;

// const BoxofficeDiv = styled.div`
//   display: inline-block;
// `;

const SwipeDiv = styled.div`
  padding-top: 25px;
`;


// const Boxoffice = styled.div`

//   display: flex;

//   width: 1300px;
//   background: #606060;
//   float: right;
//   list-style: none;
//   padding: 15px;
//   border-radius: 10px;
//   box-shadow: 0 15px 10px #000;
//   font-family: 'Noto Sans KR', sans-serif;
// `;

// const BoxofficeImg = styled.div`
//   display: inline-block;
  
//   width: 390px;
//   height: auto;
//   margin: 10px -90px 0px -90px;
// `;

// const BoxofficeTitle = styled.div`

//   text-decoration: none;
//   margin-bottom: 50px;
  
// `;
const BoxOfficeTitle = styled.div`
  // margin-top: 50px;
  font-size: 30px;
  font-weight: 600;
  font-family: 'Nanum Gothic', sans-serif;
`;


const SwipePad = styled.div`
    padding-left: 100px;
    padding-right: 100px;
`;

const BannerPad = styled.div`
    padding-left: 50px;
    padding-right: 50px;
    padding-bottom: 50px;
`;

const NoMovieDiv = styled.div`
  margin-top : 10px;
  font-size: 20px;
`

const SearchButton = styled(Link)`
  font-weight: 600;
  background: white;
  border: 1px black;
  padding: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  border-radius: 2px;
  text-decoration: none;
  transition: .2s all;

  &:hover {
      background: lightblue;
  }
`;


SwiperCore.use([Navigation, Pagination, Autoplay, Scrollbar])

const MainPresenter = ({topTenData, boxOfficeData}) => {

  return (
    <MainPage>
      <SwipeDiv>
          <BoxOfficeTitle>주간 인기 영화</BoxOfficeTitle>
            <hr />
            {topTenData.length ? <SwipePad>
              <Swiper
                className="banner"
                spaceBetween={10}
                slidesPerView={5}
                slidesPerGroup={5}
                navigation
                pagination={{ clickable: true }} 
                >
                {topTenData && topTenData.map((movie) => ( 
                <SwiperSlide key={movie.movieCd}> 
                  <Link to={`/Detail?code=${movie.movieCd}`}>
                    <img style={{ width:'auto', height:'100%'}} src={movie.image} alt={movie.title}></img>
                  </Link>
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
      <SwipeDiv>
        <BoxOfficeTitle>최근 박스오피스 개봉영화</BoxOfficeTitle>
          <hr />
          <SwipePad>
            <Swiper
              className="banner"
              spaceBetween={10}
              slidesPerView={5}
              slidesPerGroup={5}
              navigation
              pagination={{ clickable: true }} 
              >
            
              {boxOfficeData && boxOfficeData.map((movie) => ( 
                  <SwiperSlide key={movie.movieCd}>
                    <Link to={`/Detail?code=${movie.movieCd}`}>
                      <img style={{ width:'auto', height:'100%'}} src={movie.image} alt={movie.name}></img>
                    </Link>
                  </SwiperSlide>
              ))}
              <br/>
              <br/>
            </Swiper>   
          </SwipePad>

      </SwipeDiv>
      <BannerPad>
        <Swiper
            className="banner"
            spaceBetween={50}
            slidesPerView={1}
            
            scrollbar={{ draggable: true }}
            pagination={{ clickable: true }} 
            autoplay={{ delay: 3000 }}
            
            >
                <SwiperSlide> 
                  <div style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0)
                    39%,rgba(0,0,0,0)
                    41%,rgba(0,0,0,0.65)
                    100%),
                    url('https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80'), #1c1c1c`,
                        height: '500px',
                        backgroundSize: '100%, cover',
                        backgroundPosition: 'center, center',
                        width: '100%',
                        position: 'relative',
                        marginTop: '50px'
                      }}>
                      <div>
                        <div style={{ position: 'absolute', maxWidth: '800px', bottom: '9rem', marginLeft: '20rem' }}>
                          <h2 style={{fontStyle: 'italic', fontSize:'30px', fontWeight: 'bold',color: 'white'}}> 무더운 여름 공기를 시원하게 해줄 공포영화를 원한다면? </h2>
                          <br/>
                          <p style={{ color: 'white', fontSize: '1rem' }}> 지금 바로 검색하러가기</p>
                          <SearchButton to="/Genre/4"><img src="https://beslow.co.kr/assets/img/arrow-foward.png" width="25px" alt=""/></SearchButton>
                        </div>
                      </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide> 
                  <div style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0)
                    39%,rgba(0,0,0,0)
                    41%,rgba(0,0,0,0.65)
                    100%),
                    url('https://images.unsplash.com/photo-1498747946579-bde604cb8f44?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1789&q=80'), #1c1c1c`,
                      height: '500px',
                      backgroundSize: '100%, cover',
                      backgroundPosition: 'center, center',
                      width: '100%',
                      position: 'relative',
                      marginTop: '50px'
                    }}>
                    <div>
                        <div style={{ position: 'absolute', maxWidth: '800px',  top: '50%', left: '50%', transform: 'translate( -50%, -50% )'  }}>
                            <h2 style={{  fontStyle: 'italic', fontSize:'30px', fontWeight: 'bold',color: 'white' }}> 장마를 잠시나마 잊게해줄<br/>  힐링영화를 원한다면? </h2>
                            <br/>
                            <p style={{ color: 'white', fontSize: '1rem' }}> 지금 바로 검색하러가기</p>
                            <SearchButton to="/Genre/6"><img src="https://beslow.co.kr/assets/img/arrow-foward.png" width="25px" alt=""/></SearchButton>
                          </div>
                      </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide> 
                  <div style={{
                          background: `linear-gradient(to bottom, rgba(0,0,0,0)
                      39%,rgba(0,0,0,0)
                      41%,rgba(0,0,0,0.65)
                      100%),
                      url('https://images.unsplash.com/photo-1606335543042-57c525922933?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1954&q=80'), #1c1c1c`,
                          height: '500px',
                          backgroundSize: '100%, cover',
                          backgroundPosition: 'center, center',
                          width: '100%',
                          position: 'relative',
                          marginTop: '50px'
                      }}>
                    <div>
                      <div style={{ position: 'absolute', maxWidth: '800px', top: '50%', left: '50%', transform: 'translate( -50%, -50% )' }}>
                        <h2 style={{ fontStyle: 'italic', fontSize:'30px', fontWeight: 'bold', color: 'white' }}> 계속되는 폭염을 시원하게 날려줄<br/>  격투영화가 보고싶다면? </h2>
                        <br/>
                        <p style={{ color: 'white', fontSize: '1rem' }}> 지금 바로 검색하러가기</p>
                        <SearchButton to="/Genre/19"><img src="https://beslow.co.kr/assets/img/arrow-foward.png" width="25px" alt=""/></SearchButton>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
          </Swiper> 
        </BannerPad>
    </MainPage>
  );
};

export default MainPresenter;