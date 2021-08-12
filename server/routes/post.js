const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const request = require('request')
const boxOffice = require('../lib/boxOffice/boxOffice');
const axios = require('axios');
const cheerio = require('cheerio');
const naverAPI = require('../lib/boxOffice/naverAPI');
const crawling = require('../lib/boxOffice/crawling');
const movieData = require('../lib/boxOffice/movieData');


router.get('/detail/:movieCd', async function(req, response, next){
  const movieCd = req.params.movieCd;
  await db.query('SELECT * FROM moviecount WHERE movieCd = ?', [movieCd], async function(error, results){
    if(error){
      next(error);
    }
    if(results.length===0){ //null값

      await db.query('INSERT INTO moviecount(movieCd, count) values (?, ?)', [
        movieCd, 1
      ])
      //console.log('moviecount 테이블 갱신');
    }
    else{ //moviecount에 해당 영화가 있으면
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

        const getHTML = async(keyword) => {
          try{
              return await axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code="+keyword)
          }catch(err){
              console.log(err)
          }
          
      }

      const parsing = async(keyword,review, callback) => {
          const html = await getHTML(keyword);
          
          const $ = cheerio.load(html.data); //갖고온 html코드는 data안에 들어온다.
      //    const $itemList = $(".poster")
      
          let item = new Object();
          let show = false;
          let title = $(".mv_info").find(`h3>a`).text()
          if(title.includes('상영중')){
              title = title.split('상영중')[0];
              show = true;
          }else{
              title = title.substring(0,title.length/2);
          }
          let summary = $(".story_area").find(".con_tx").text()
          let $peopleList = $(".people >ul > li")
          let people = new Object();
          let peopleArray = new Array();
      
          $peopleList.each((idx,node)=>{
              let peopleImage = $(node).find("img").attr("src")
              let peopleName =  $(node).find(".tx_people").text()
              let peopleJob =$(node).find(".staff").text().trim()

              people = {
                  "peopleImage" : peopleImage,
                  "peopleName" : peopleName,
                  "peopleJob" : peopleJob,
              }
              peopleArray.push(people);
          })
          let genre = $(".info_spec").find("span:first").text().trim()
          let country = $(".info_spec").find("span:eq(1)").text().trim()
          let time = $(".info_spec").find("span:eq(2)").text().trim()
          let date = $(".info_spec").find("span:eq(3)").text().trim()
          let grade = $(".info_spec").find("span:eq(4)").text().trim()
          if(!show){
            if(date.charAt(0)==='['){
              grade = date;
            }
            date = '정보 없음'
          }
           
          
          if(grade.charAt(0)!=='['){
            grade = '정보 없음'
          }
          country = country.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
          grade = grade.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
          date = date.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
          genre = genre.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
      
          item = {
              //"image": $(".mv_info_area").find("img").attr("src"),
              //"title": $(".mv_info").find(`h3>a`).text(),
              "title": title,
              "show" : show,
              "summary": summary,
              //"movieCd": keyword,
              "people" : peopleArray,
              "genres" : genre,
              "country" : country,
              "runningTime" : time,
              "openDt" : date,
              "grade" : grade,
              "review" : review
          }
          callback(item);
      }
      const getHTMLPost = async(keyword) => {
        try{
            return await axios.get("https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode="+keyword)
        }catch(err){
            console.log(err)
        }
        
    }
      const parsingPost = async(keyword,result,callback) => {
        const html = await getHTMLPost(keyword);
        
        const $ = cheerio.load(html.data); 

        result.image = $("#page_content").find("img").attr("src")

        callback(result);
    }
      parsing(movieCd,resultR,function(res){
        //console.log(res);
        parsingPost(movieCd,res,function(res2){
          //console.log(res2);
          if(res2){
            response.status(200).send({code : 200, result : res2});
          }else{
            response.status(400).send({code : 400, result : '에러'});
          }
        })
          
          
      })

      }
  })
  })
})


router.get('/boxOffice', async function(req, response,next){

  await db.query('select * from boxoffice order by movierank',async(err, result)=>{
    if(err){
      next(err)
    }
    if(result.length>0){
      //console.log('있으면',result)
      response.status(200).send({code:200, boxOffice: result});
    }
    else{
      //console.log('없음')
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
      
      let a = movieData.getName(targetDt);
      
      a.then(function(result){
          // let movieData;
          
          let movieList = new Array();
          //let movieTT = new Array();
          // let checkLength = result.dailyBoxOfficeList.length;
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
              .then(function(result2){
                      
                    crawling.parsing(result2.movieCd,result2,async function(res){
                        movieList.push(res);
                        
                        await db.query('insert into boxoffice(movierank,name,movieCd,image) values(?,?,?,?)',[res.rank*=1,res.name,res.movieCd,res.image],function(err,result){
                          if(err){
                            console.error('sql error, 검색안되는 영화 있음');
                          }
                        })
                        
                        if(movieList.length === result.dailyBoxOfficeList.length){
                          await db.query('select * from boxoffice order by movierank',async(err, result)=>{
                            if(err){
                              next(err)
                            }
                             response.status(200).send({code:200, boxOffice: result});
                          })
                            // movieList.sort(function(a,b){
                            //     return parseFloat(a.rank)-parseFloat(b.rank)
                            // })
                            // movies = {
                            //     "boxOffice" : movieList
                            // }
                            // response.status(200).send({code:200, boxOffice:movies});
                        }
                    })
              })
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
  //console.log('탑텐 시작')
  await db.query('SELECT * FROM weeklymovie ORDER BY count DESC LIMIT 10', function(error, result){
    if(error){
      throw(error);
    }

    let movieCd = [];
    for(let i=0; i<result.length; i++){
      movieCd.push(result[i].movieCd)
    }

    const getHTML = async(keyword) => {
      try{
          return await axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code="+keyword)
      }catch(err){
          console.log(err)
      }
  }
  //console.log('영화코드',movieCd);
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
          "image": $(".mv_info_area").find("img").attr("src"),
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


router.get('/recommend/:movieCode', async function(req, response){
  let res = await axios.get(`${process.env.FLASK_SERVER_URL}/${encodeURI(req.params.movieCode)}`);
  if(res.data === "error") {
    response.status(204).send({code : 204, result : "이 콘텐츠에 대한 추천은 제공하지 않습니다."});
    return;
  } 
  const movieList = new Array();
  let check = Object.values(res.data).length;
  let mv = new Object();

  crawling.parsingRecommend(req.params.movieCode,mv,function(flag){
    if(flag===false){
      console.log('청불영화');
      for(let i=0; i<check; i++) {
        let movie = new Object();
        movie.movieCode = Object.values(res.data)[i]
        movie.rank = i;
        
        crawling.parsing(Object.values(res.data)[i],movie,function(result){
          //console.log(result);
          if(result!==false){
            movieList.push(result);
          } else{
            check--;
          }
          if(movieList.length === check) {
            movieList.sort(function(a,b){
              return parseFloat(a.rank)-parseFloat(b.rank)
          })
            if(movieList){
              response.status(200).send({code : 200, result : movieList});
            }else{
              response.status(400).send({code : 400, result : '에러'});
            }
          }
        })
      }
    } else{
      console.log('청불영화 아님');
      for(let i=0; i<check; i++) {
        let movie = new Object();
        movie.movieCode = Object.values(res.data)[i]
        movie.rank = i;
        
        crawling.parsingRecommend(Object.values(res.data)[i],movie,function(result){
          //console.log(result);
          if(result!==false){
            movieList.push(result);
          } else{
            check--;
          }
          if(movieList.length === check) {
            movieList.sort(function(a,b){
              return parseFloat(a.rank)-parseFloat(b.rank)
          })
            if(movieList){
              response.status(200).send({code : 200, result : movieList});
            }else{
              response.status(400).send({code : 400, result : '에러'});
            }
          }
        })
      }
    }
  })
  
  

})

module.exports = router;


