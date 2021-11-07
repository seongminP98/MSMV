const statusCode = require('../config/statusCode');
const axios = require('axios');
const naverAPI = require('../lib/movie/naverAPI');
const crawling = require('../lib/movie/crawling');
const movieData = require('../lib/movie/movieData');
const movieRcm = require('../lib/movie/recommend');
const reviewModel = require('../model/reviewModel');
const movieCountModel = require('../model/movieCountModel');
const boxOfficeModel = require('../model/boxOfficeModel');
const weeklyMovie = require('../model/weeklyMovieModel');

const postController = {
    detail : async(req, res) => {
        try{
            let thisMovie = await movieCountModel.movieCount.findByMovieCd(req);
            if(thisMovie.length === 0) {
                await movieCountModel.movieCount.save(req);
            } else {
                await movieCountModel.movieCount.update(req, thisMovie[0].count+1);
            }

            let postReview = await reviewModel.review.getPostReview(req);
            crawling.parsingDetail(req.params.movieCd, postReview, (movie) => {
                crawling.parsingPost(req.params.movieCd, movie, (movieWithPost) => {
                    if(movieWithPost){
                        res.status(statusCode.OK).send({code: statusCode.OK, result: movieWithPost});
                    } else {
                        res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR});
                    }
                })
            })
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    boxOffice : async(req, res) => {
        let flag = false;
        let boxOfficeMovies = await boxOfficeModel.boxOffice.orderByRank();
        if(boxOfficeMovies.length > 0) {
            let now = new Date();
            if(boxOfficeMovies[0].created.getDate() < now.getDate()) {
                await boxOfficeModel.boxOffice.delete();
            }
            return res.status(statusCode.OK).send({code: statusCode.OK, boxOffice: boxOfficeMovies});
        }

        let now = new Date();// 현재 날짜 및 시간
        let yesterday = new Date(now.setDate(now.getDate() - 1)); // 어제
        let yy = yesterday.toString().split(' ');
        let month = (d) => {
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
        let movieName = movieData.getName(targetDt);
        movieName.then(async(boxOfficeMovies) => {
            let movieList = new Array();
            for(let i=0; i<boxOfficeMovies.dailyBoxOfficeList.length; i++){
                let prdtYear = boxOfficeMovies.dailyBoxOfficeList[i].prdtYear;
                    const option = {
                    query : boxOfficeMovies.dailyBoxOfficeList[i].movieNm,
                    start :1,
                    display:1,
                    yearfrom:prdtYear,
                    yearto:prdtYear,
                    sort :'sim',
                    filter:'small',
                }
                let rank = boxOfficeMovies.dailyBoxOfficeList[i].rnum
                let result2 = await naverAPI.getMovieList(option,rank)
                crawling.parsing(result2.movieCd,result2,async(movie) => {
                    movieList.push(movie);
                    await boxOfficeModel.boxOffice.save(movie);
                    if(movieList.length === boxOfficeMovies.dailyBoxOfficeList.length){
                        return res.status(statusCode.OK).send({code: statusCode.OK, boxOffice: await boxOfficeModel.boxOffice.orderByRank()});
                    }
                })
            }
            return;
        })
    },

    topTen : async(req, res) => {
        let topTenMovies = await weeklyMovie.weeklyMovie.findLimitTen();
        let movieCd = [];
        for(let i=0; i<topTenMovies.length; i++){
            movieCd.push(topTenMovies[i].movieCd)
        }
        let topMovies = [];
        for(let i=0; i<movieCd.length; i++){
            let movie = new Object();
            movie.rank = i;
            movie.movieCd = movieCd[i];
            crawling.parsing(movieCd[i], movie, (movies) => {
                topMovies.push(movies);
                if(topMovies.length === movieCd.length){
                    topMovies.sort((a, b) => {
                        return parseFloat(a.rank) - parseFloat(b.rank)
                    })
                    if(topMovies){
                      res.status(statusCode.OK).send({code: statusCode.OK, result: topMovies});
                    } else {
                      res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR});
                    }
                }
            })
        }
    },

    recommendedMovies : async(req, res) => {
        let rcmMovies = await axios.get(`${process.env.FLASK_SERVER_URL}/${encodeURI(req.params.movieCode)}`);
        movieRcm.movieRecommend(req.params.movieCode, rcmMovies, (movieList) => {
            if(movieList === 400){
                res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result: '에러'});
            } else if(movieList === 204){
                res.status(statusCode.NO_CONTENT).send();
            } else{
                res.status(statusCode.OK).send({code: statusCode.OK, result: movieList});
            }
        })
    }
}

module.exports = postController;