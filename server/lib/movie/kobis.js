const axios = require('axios');
const dotenv = require('dotenv');
const utf8 = require('utf8');
dotenv.config();

function movieData(targetDt){ //박스오피스
    return axios.get( `http://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${process.env.serviceKey}&targetDt=${targetDt}`).then(response =>{
        return response.data
    })

}

function movieData2(movieCd){ //영화상세보기
    return axios.get( `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${process.env.serviceKey}&movieCd=${movieCd}`).then(response =>{  
        return response.data
    })

}

function searchMovieDir(directorNm, callback){ //감독으로 검색
    dirNm = utf8.encode(directorNm);
    return axios.get( `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${process.env.serviceKey}&directorNm=${dirNm}`).then(response2 =>{
        resultMovies = new Array();
        let result = response2.data.movieListResult.movieList
        for(let i=0; i<result.length; i++){
            resultMovies.push({'movieName' : result[i].movieNm,
                                'prdtYear' : result[i].prdtYear})
        }
        if(resultMovies.length === 0){
            return response.status(204).send();
        }
        callback(resultMovies)
    })
}

module.exports = {movieData,movieData2,searchMovieDir};
