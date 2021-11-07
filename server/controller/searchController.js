const statusCode = require('../config/statusCode');
const naverAPI = require('../lib/movie/naverAPI');
const crawling = require('../lib/movie/crawling');
const kobis = require('../lib/movie/kobis');

const searchController = {
    search : (req, res) => {
        if(req.body.check === 1) { //영화 제목으로 검색
            if(req.body.movieNm === undefined) {
                res.state(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message : '제목을 입력해 주세요'});
            } else {
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
                    let len = result.length;
                    if(result.length === 0) {
                        return res.status(statusCode.NO_CONTENT).send();
                    }
                    for(let i=0; i<len; i++){
                        crawling.parsing(result[i].movieCd,result[i], (movie) => {
                            if(movie.image === 'https://ssl.pstatic.net/static/movie/2012/06/dft_img203x290.png'){ //포스터 이미지 없는 영화 제외
                                len--;
                            } else{
                                movieListNm.push(movie);
                            }
                            if(movieListNm.length === len){
                                movieListNm.sort((a, b) => {
                                    return parseFloat(b.rate)-parseFloat(a.rate)
                                })
                                res.status(statusCode.OK).send({code: statusCode.OK, result: movieListNm});
                            }
                        })
                    }
                })
            }
        } else if(req.body.check === 2){ //감독명으로 검색
            if(req.body.dirNm === undefined){
                movie.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message : '감독명을 입력해 주세요'});
            } else{
                kobis.searchMovieDir(req.body.dirNm, (movie) => {
                    let checkLength =movie.length
                    let movieList = new Array();
                    for(let i=0; i<movie.length; i++){
                        let prdtYear = movie[i].prdtYear;
                        const option = {
                            query : movie[i].movieName,
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
                                crawling.parsing(result2.movieCd,result2,function(movie){
                                    movieList.push(movie);
                                    if(movieList.length === checkLength){
                                        movieList.sort((a, b) => {
                                            return parseFloat(b.rate) - parseFloat(a.rate)
                                        })
                                        res.status(statusCode.OK).send({code: statusCode.OK, result : movieList});
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
        else{
            res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: '감독명이나 영화로 검색해주세요(check에러)'});
        }
    },

    searchGenre : (req, res) => {
    /*
        1. 드라마
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
        crawling.parsingGenre(req.params.tg, (movies) => {
            if(movies.length === 0 ){
                res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, message: '잘못된 입력입니다.'});
            }
            let movieList = new Array();
            for(let i=0; i<movies.length; i++) {
                crawling.parsing(movies[i].code, movies[i], (movie) => {
                    movieList.push(movie);
                    if(movieList.length === movies.length){
                        movieList.sort((a, b) => {
                            return parseFloat(a.rank) - parseFloat(b.rank)
                        })
                        res.status(statusCode.OK).send({code: statusCode.OK, result: movieList});
                    }
                })
            }
        })
    }
}

module.exports = searchController;