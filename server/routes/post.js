const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const request = require('request')
const boxOffice = require('../lib/boxOffice');
const axios = require('axios');
const cheerio = require('cheerio');

router.post('/review/write', async(req,res,next)=> {
  console.log("REVIEW");
  const contents = req.body.contents;
  const commenter = req.body.commenter;
  const rate = req.body.rate;
  const movieCd = req.body.movieCd;

  await db.query('INSERT INTO review(contents, commenter, rate, movieCd) values (?, ?, ?, ?)', [
    contents, commenter, rate, movieCd
  ], (error, result) =>{
    if(error) {
      next(error);
    }
    
    db.query('SELECT * FROM review WHERE movieCd = ?', [movieCd],
       (err, result) => {
       console.log(result);
       res.status(200),send({code: 200, result: result}) // 201 vs 200?
      });
  });
})

router.post('/', function(req, res){
  const movieCd = req.body.movieCd;
  db.query('select contents, created, updated, rate, nickname from review left join users on review.commenter = users.user_id WHERE movieCd = ?'), [movieCd],
  (err, result)=>{
    if(error){
      next(error);
    }
    console.log(result);
    res.status(200), send({code:200, result:result})
  }
})

/*
router.post('/review/update', async(req, res, next) => {
  console.log("Update review");
  const id = req.body.id;
  await db.query('UPDATE review SET comments = ? WHERE id = ?', [contents, id])
  //유저 입장에서 자기가 글 쓴 게 몇번인지 알 수 있나?...뭘 받아와야할지....
})
*/

/*
router.get('/review/delete', (req, res, next) => {
  console.log("Delete review");
  const id = req.body.id; //마찬가지
  db.query('DELETE FROM review WHERE id = ?', [id]);
})
*/

//moviecount테이블
/*
router.get('/:movieCd', function(req, res, next){
  const movieCd = req.params.movieCd;
  db.query('SELECT movieCd FROM moviecount', function(error, results){
    if(error){
      throw(error);
    }
    else if(!results){ //null값
      db.query('INSERT INTO moviecount(movieCd, count) values (?, ?)', [
        movieCd, 1
      ])
      console.log('moviecount 테이블 갱신');
    }
    else{ //moviecount에 해당 영화가 있으면
      db.query('SELECT count FROM moviecount', function(error2, count){
        if(error2){
          throw(error2);
        }
        else{
          db.query('UPDATE moviecount SET count = ? WHERE movieCd = ?', [count + 1, movieCd]);
        }
      })
    }
  })
})
*/

router.get('/boxOffice', function(req, response){
  let movies = new Object();
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
      } else if(d[1] === 'Sept'){
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
  
  async function getName2(targetDt){
      let mvName = await boxOffice.movieData(targetDt);
      return mvName.boxOfficeResult
      //console.log(mvName.boxOfficeResult);
  }
  let a = getName2(targetDt);
  
  
  a.then(function(result){
      let movieData;
      
      let movieList = new Array();
      //let movieTT = new Array();
      
      for(let i=0; i<result.dailyBoxOfficeList.length; i++){
          let year = result.dailyBoxOfficeList[i].openDt.split('-')[0];
              const option = {
              query : result.dailyBoxOfficeList[i].movieNm,
              start :1,
              display:1,
              yearfrom:year-1,
              yearto:year,
              sort :'sim',
              filter:'small',
          }
  
          request.get({
              uri: 'https://openapi.naver.com/v1/search/movie.json',
              qs: option,
              headers: {
                  'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                  'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
              }
          }, async function (err, res, body){
              movieData = JSON.parse(body);
              //console.log(movieData);
              movieData.items[0].rank = result.dailyBoxOfficeList[i].rnum;
  
              //console.log(movieData.items[0].rank);
              let boxOfficeData = { //데이터 골라서 넣기
                  "rank" : movieData.items[0].rank,
                  "name" : movieData.items[0].title,
                  "image" : movieData.items[0].image,
                  "director" : movieData.items[0].director,
                  "actor" : movieData.items[0].actor,
                  "movieCd" : movieData.items[0].link.split('code=')[1],
                  "userRating" : movieData.items[0].userRating,
              }
              
              movieList.push(boxOfficeData);
              if(movieList.length===10){
                  movieList.sort(function(a,b){
                      return parseFloat(a.rank)-parseFloat(b.rank)
                  })
                  //console.log(movieList);
                  
                  // movies = {
                  //     "boxOffice" : movieList
                  // }
                  console.log(movieList);
                  if(movieList){
                    response.status(200).send({code : 200, result : movieList});
                  }else{
                    response.status(400).send({code : 400, result : '에러'});
                  }
                  
              }
          })
      }
  })
  
})


//자정에 todaymovie로 테이블 복사 후 moviecount테이블초기화 -> mysql 내 이벤트 스케쥴러 COPYmoviecount
//main에 todaymovie 출력
// get('/', function(req, res){
//   db.query('SELECT * FROM todaymovie ORDER BY count DESC LIMIT 10', function(error, movierank){
//     if(error){
//       throw(error);
//     }
    
//     console.log(movierank);
//   })
// })

router.get('/top10', async function(req, response){
  console.log('탑텐 시작')
  await db.query('SELECT * FROM todaymovie ORDER BY count DESC LIMIT 10', function(error, result){
    if(error){
      throw(error);
    }
    console.log('result',result);
    let movieCd = [];
    for(let i=0; i<result.length; i++){
      movieCd.push(result[i].movieCd)
    }
    console.log('movieCd',movieCd);
    const getHTML = async(keyword) => {
      try{
          return await axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code="+keyword)
      }catch(err){
          console.log(err)
      }
  }
  console.log('영화코드',movieCd);
  const parsing = async(keyword, rank, callback) => {
      const html = await getHTML(keyword);
      
      const $ = cheerio.load(html.data); //갖고온 html코드는 data안에 들어온다.
  
      let item = new Object();
  
      let title = $(".mv_info").find(`h3>a`).text()
      if(title.includes('상영중')){
          title = title.split('상영중')[0];
      }else{
          title = title.substring(0,title.length/2);
      }
      item = {
          "image": $(".poster").find("img").attr("src"),
          "title": title,
          "movieCd": keyword,
          "rank": rank
      }
      callback(item);
  }
  let topMovies = [];
  for(let i=0; i<movieCd.length; i++){
      parsing(movieCd[i],i,function(res){
          topMovies.push(res);
          
          if(topMovies.length === movieCd.length){
              topMovies.sort(function(a,b){
                  return parseFloat(a.rank)-parseFloat(b.rank)
              })
              console.log(topMovies)
              if(topMovies){
                response.status(200).send({code : 200, result : topMovies});
              }else{
                response.status(400).send({code : 400, result : '에러'});
              }
              

          }
      })
  }
    
  })
})


module.exports = router;


