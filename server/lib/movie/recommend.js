const axios = require('axios');
const naverAPI = require('./naverAPI');
const crawling = require('./crawling');
const movieData = require('./movieData');


async function movieRecommend(movieCode, res, callback){
    
    if(res.data === "error") {
        callback(204)
    } else{
        const movieList = new Array();
        let check = Object.values(res.data).length;
        let mv = new Object();
  
    crawling.parsingRecommend(movieCode,mv,function(flag){
      if(flag===false){
        for(let i=0; i<check; i++) {
          let movie = new Object();
          movie.movieCode = Object.values(res.data)[i]
          movie.rank = i;
          crawling.parsing(Object.values(res.data)[i],movie,function(result){
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
                callback(movieList);
              }else{
                callback(400);
              }
            }
          })
        }
      } else{
        for(let i=0; i<check; i++) {
          let movie = new Object();
          movie.movieCode = Object.values(res.data)[i]
          movie.rank = i;
          
          crawling.parsingRecommend(Object.values(res.data)[i],movie,function(result){
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
                callback(movieList);
              }else{
                callback(400);
              }
            }
          })
        }
      }
    })
  }
}

module.exports = {movieRecommend};