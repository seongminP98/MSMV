const express = require('express');
const router = express.Router();
const axios = require('axios');
const utf8 = require('utf8');
const request = require('request')

const cheerio = require('cheerio');
const naverAPI = require('../lib/boxOffice/naverAPI');
const crawling = require('../lib/boxOffice/crawling');
const movieData = require('../lib/boxOffice/movieData');

router.post('/',(req,response)=>{
    console.log('search start')
    console.log(req.body.check)
    if(req.body.check===1){ //제목으로 검색
        console.log('제목으로 검색')
        if(req.body.movieNm === undefined){
            response.status(400).send({code : 400, message : "제목을 입력해 주세요"});
        }else{
            const option = {
                query : req.body.movieNm,
                start :1,
                display:20,
                sort :'sim',
                filter:'small',
            
            }
            let movieListNm = new Array();
            naverAPI.getMovieListNm(option)
            .then(function(result){
                //let resultLen = result.length;
                let len = result.length;
                console.log('asdfasdf',result);
                if(result.length === 0) {
                    console.log("없음")
                    return response.status(204).send();
                }
                for(let i=0; i<len; i++){
                    crawling.parsing(result[i].movieCd,result[i],function(res){
                        if(res.image === 'https://ssl.pstatic.net/static/movie/2012/06/dft_img203x290.png'){ //포스터 이미지 없는 영화 제외
                            len--;
                        }else{
                            movieListNm.push(res);
                        }
                        if(movieListNm.length === len){
                            movieListNm.sort(function(a,b){
                                return parseFloat(b.rate)-parseFloat(a.rate)
                            })
                            response.status(200).send({code : 200, result : movieListNm});
                        }
                    })
                }
            })
        }
        
    }
    else if(req.body.check===2){ //감독명으로 검색
        console.log("감독명으로 검색");
        if(req.body.dirNm === undefined){
            response.status(400).send({code : 400, message : "감독명을 입력해 주세요"});
        } else{
            function searchMovieDir(directorNm, callback){
                dirNm = utf8.encode(directorNm);
                return axios.get( `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${process.env.serviceKey}&directorNm=${dirNm}`).then(response2 =>{
                    resultMovies = new Array();
                    let result = response2.data.movieListResult.movieList
                    for(let i=0; i<result.length; i++){
                        resultMovies.push({'movieName' : result[i].movieNm,
                                            'prdtYear' : result[i].prdtYear})
                    }
                    console.log(resultMovies);
                    if(resultMovies.length === 0){
                        console.log("없음")
                        return response.status(204).send();
                    }
                    callback(resultMovies)
                })
            }
            
            searchMovieDir(req.body.dirNm,function(res){
                let checkLength =res.length
                
                let movieList = new Array();
                for(let i=0; i<res.length; i++){
                    let prdtYear = res[i].prdtYear;
                    const option = {
                        query : res[i].movieName,
                        start : 1,
                        display : 5,
                        yearfrom : prdtYear,
                        yearto : prdtYear,
                        sort : 'sim',
                        filter : 'small',
                    }
                    naverAPI.getMovieListDir(option,req.body.dirNm)
                    .then(function(result2){
                        
                        if(!result2){
                            checkLength--;
                        }else{
                            crawling.parsing(result2.movieCd,result2,function(res){
                                movieList.push(res);
                                if(movieList.length === checkLength){
                                    movieList.sort(function(a,b){
                                        return parseFloat(b.rate)-parseFloat(a.rate)
                                    })
                                    //console.log(movieList);
                                    response.status(200).send({code : 200, result : movieList});
                                    
                                }
                            })
                        }
                    })
                }
            })
        }
        
    }
    else{
        response.status(400).send({code : 400, message : "감독명이나 영화로 검색해주세요(check에러)"});
    }
})

router.get('/genre/:tg', (request, response) => {
    /**
     *  1: 드라마 2: 판타지
        3: 서부 4: 공포
        5: 로맨스 6: 모험
        7: 스릴러 8: 느와르
        9: 컬트 10: 다큐멘터리
        11: 코미디 12: 가족
        13: 미스터리 14: 전쟁
        15: 애니메이션 16: 범죄
        17: 뮤지컬 18: SF
        19: 액션 20: 무협
        21: 에로 22: 서스펜스
        23: 서사 24: 블랙코미디
        25: 실험 26: 영화카툰
        27: 영화음악 28: 영화패러디포스터
     */
    //위에 다되기는 하지만 아래있는것만.
    /**
     *  1. 드라마
        2. 판타지
        4. 공포
        5. 로맨스
        6. 모험
        7. 스릴러
        8. 느와르
        10. 다큐멘터리
        11. 코미디
        12. 가족
        13. 미스터리
        14. 전쟁
        15. 애니메이션
        16. 범죄
        17. 뮤지컬
        18. SF
        19. 액션
     */
    crawling.parsingGenre(request.params.tg, (res) => {
        if(res.length === 0 ){
            response.status(400).send({code : 400, message : "잘못된 입력입니다."});
        }

        let movieList = new Array();
        for(let i=0; i<res.length; i++) {
            crawling.parsing(res[i].code, res[i], (res2) => {

                movieList.push(res2);
                if(movieList.length === res.length){
                    movieList.sort(function(a,b){
                        return parseFloat(a.rank)-parseFloat(b.rank)
                    })
                    response.status(200).send({code : 200, result : movieList});
                }
            })
        }

    })
})
module.exports = router;