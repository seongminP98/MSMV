const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const axios = require('axios');
const naverAPI = require('../lib/movie/naverAPI');
const crawling = require('../lib/movie/crawling');
const movieData = require('../lib/movie/movieData');
const movieRcm = require('../lib/movie/recommend');


router.get('/detail/:movieCd', async function(req, res, next){
  const movieCd = req.params.movieCd;
  await db.query('SELECT * FROM moviecount WHERE movieCd = ?', [movieCd], async function(error, results){
    if(error){
      next(error);
    }
    if(results.length===0){ //null값 moviecount에 추가.
      await db.query('INSERT INTO moviecount(movieCd, count) values (?, ?)', [
        movieCd, 1
      ])
    }
    else{ //moviecount에 해당 영화가 있으면 count+1
      await db.query('SELECT count FROM moviecount where movieCd = ?',[movieCd] ,async function(error2, count){
        if(error2){
          next(error2);
        }
        await db.query('UPDATE moviecount SET count = ? WHERE movieCd = ?', [count[0].count+1, movieCd]
        );
      })
    }
    await db.query('select review.id,contents, created, updated, rate, nickname, commenter from review left join users on review.commenter = users.id WHERE movieCd = ?', 
    [req.params.movieCd], async (error3, resultR)=>{
      if(error3){
        throw(error3)
      }
      else{
        crawling.parsingDetail(movieCd,resultR,function(movie){
          crawling.parsingPost(movieCd,movie,function(movieWithImage){
            if(movieWithImage){
              res.status(200).send({code : 200, result : movieWithImage});
            }else{
              res.status(400).send({code : 400, result : '에러'});
            }
          })
        })
      }
    })
  })
})

router.get('/boxOffice', async function(req, res, next){

  await db.query('select * from boxoffice order by movierank',async(err, result)=>{
    if(err){
      next(err)
    }
    if(result.length>0){
      res.status(200).send({code:200, boxOffice: result});
    }
    else{
      let now = new Date();	// 현재 날짜 및 시간
    
      let yesterday = new Date(now.setDate(now.getDate() - 1));	// 어제
      
      let yy = yesterday.toString().split(' ');
    
      let month = function(d){
          if(d[1]==='Jan'){
              return '01'
          } else if(d[1] === 'Feb'){
              return '02'
          } else if(d[1] === 'Mar'){
              return '03'
          } else if(d[1] === 'Apr'){
              return '04'
          } else if(d[1] === 'May'){
              return '05'
          } else if(d[1] === 'Jun'){
              return '06'
          } else if(d[1] === 'Jul'){
              return '07'
          } else if(d[1] === 'Aug'){
              return '08'
          } else if(d[1] === 'Sep'){
              return '09'
          } else if(d[1] === 'Oct'){
              return '10'
          } else if(d[1] === 'Nov'){
              return '11'
          } else if(d[1] === 'Dec'){
              return '12'
          }
      }
      
      let targetDt = yy[3]+month(yy)+yy[2];
      
      let a = movieData.getName(targetDt);
      
      a.then(function(result){
          let movieList = new Array();

          for(let i=0; i<result.dailyBoxOfficeList.length; i++){
            let prdtYear = result.dailyBoxOfficeList[i].prdtYear;
                  const option = {
                  query : result.dailyBoxOfficeList[i].movieNm,
                  start :1,
                  display:1,
                  yearfrom:prdtYear,
                  yearto:prdtYear,
                  sort :'sim',
                  filter:'small',
              }
              let rank = result.dailyBoxOfficeList[i].rnum
              naverAPI.getMovieList(option,rank)
              .then((result2)=>{
                      
                    crawling.parsing(result2.movieCd,result2,async function(movie){
                        movieList.push(movie);
                        
                        await db.query('insert into boxoffice(movierank,name,movieCd,image) values(?,?,?,?)',[movie.rank*=1, movie.name, movie.movieCd, movie.image], function(err,result){
                          if(err){
                            console.error('sql error, 검색안되는 영화 있음');
                          }
                        })
                        
                        if(movieList.length === result.dailyBoxOfficeList.length){
                          await db.query('select * from boxoffice order by movierank',async(err, result)=>{
                            if(err){
                              next(err)
                            }
                             res.status(200).send({code:200, boxOffice: result});
                          })
                        }
                    })
              })
          }
      })
    }
  })
})


router.get('/top10', async function(req, res){
  await db.query('SELECT * FROM weeklymovie ORDER BY count DESC LIMIT 10', function(error, result){
    if(error){
      throw(error);
    }

    let movieCd = [];
    for(let i=0; i<result.length; i++){
      movieCd.push(result[i].movieCd)
    }
  let topMovies = [];
  for(let i=0; i<movieCd.length; i++){
      let result2 = new Object();
      result2.rank = i;
      result2.movieCd = movieCd[i];
      crawling.parsing(movieCd[i],result2,function(movies){
          topMovies.push(movies);
          
          if(topMovies.length === movieCd.length){
              topMovies.sort(function(a,b){
                  return parseFloat(a.rank)-parseFloat(b.rank)
              })
              if(topMovies){
                res.status(200).send({code : 200, result : topMovies});
              }else{
                res.status(400).send({code : 400, result : '에러'});
              }
          }
      })
    }
  })
})

router.get('/recommend/:movieCode', async function(req, res){
  let rcmMovies = await axios.get(`${process.env.FLASK_SERVER_URL}/${encodeURI(req.params.movieCode)}`);
  movieRcm.movieRecommend(req.params.movieCode, rcmMovies, function(movieList){

    if(movieList === 400){
      return res.status(400).send({code : 400, result : '에러'});
    }
    else if(movieList === 204){
      return res.status(204).send({code : 204, result : "이 콘텐츠에 대한 추천은 제공하지 않습니다."});
    } else{
      res.status(200).send({code : 200, result : movieList});
    }
  })
})

module.exports = router;


