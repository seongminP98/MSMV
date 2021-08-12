const request = require('request');


function getMovieList(option, rank){ //박스오피스 검색시 사용
    return new Promise(resolve=>{
        request.get({
            uri: 'https://openapi.naver.com/v1/search/movie.json',
            qs: option,
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        },function(err, res, body){
            let movieData = JSON.parse(body);

            if(movieData.items[0] === undefined){
                return resolve(false)
            }

            let boxOfficeData = {
                "rank" : rank,
                "name" : movieData.items[0].title,
                "movieCd" : movieData.items[0].link.split('code=')[1],
            }
            resolve(boxOfficeData)
        })
    })
}

function getMovieListDir(option,dirName){ //감독으로 검색 시 사용
    return new Promise(resolve=>{
        request.get({
            uri: 'https://openapi.naver.com/v1/search/movie.json',
            qs: option,
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        },function(err, res, body){
            let real = new Object();
            let movieData = JSON.parse(body);

            if(movieData.items[0]!==undefined){
                for(let i=0; i<movieData.display; i++){     
                    if(movieData.items[i].director.includes(dirName)){
                        real = movieData.items[i]
                    }
                }
            }
            if(real.title!==undefined){
                let boxOfficeData = {
                    "title" : real.title,
                    "movieCd" : real.link.split('code=')[1],
                    "rate" : real.userRating,
                }
                resolve(boxOfficeData)
            }else{
                resolve(false)
            }
        })
    })
}

function getMovieListNm(option){ //영화명으로 검색 시 사용
    return new Promise(resolve=>{
        request.get({
            uri: 'https://openapi.naver.com/v1/search/movie.json',
            qs: option,
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        },function(err, res, body){
            let movieData = JSON.parse(body);
            let searchList = new Array();
            for(let i=0; i<movieData.items.length; i++){
                searchList.push({'title' : movieData.items[i].title,
                                 'movieCd' : movieData.items[i].link.split("code=")[1],
                                 'rate' : movieData.items[i].userRating
                                })
            }
            resolve(searchList);

        })
    })
}
module.exports = {getMovieList, getMovieListDir, getMovieListNm};