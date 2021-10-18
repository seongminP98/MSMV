const crawling = require('./crawling');


async function movieRecommend(movieCode, res){ //추천된 영화들에 대한 정보 찾기.
    
    if(res.data === "error") {
        return 204;
    //   response.status(204).send({code : 204, result : "이 콘텐츠에 대한 추천은 제공하지 않습니다."});
    //   return;
    } else{
        const movieList = new Array();
        let check = Object.values(res.data).length;
        let mv = new Object();
  
        let flag = await crawling.parsingRecommend(movieCode,mv);
        if(flag===false){
          for(let i=0; i<check; i++) {
            let movie = new Object();
            movie.movieCode = Object.values(res.data)[i]
            movie.rank = i;
            let result = await crawling.parsing(Object.values(res.data)[i],movie);
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
              return movieList;
            }else{
                return 400;
            }
          }
        }
      } else{
        for(let i=0; i<check; i++) {
          let movie = new Object();
          movie.movieCode = Object.values(res.data)[i]
          movie.rank = i;
          
          let result = await crawling.parsingRecommend(Object.values(res.data)[i],movie)
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
                return movieList;
              }else{
                return 400;
              }
            }
        }
      }
    }
}

module.exports = {movieRecommend};