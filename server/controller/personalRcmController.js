const statusCode = require('../config/statusCode');
const axios = require('axios');
const crawling = require('../lib/movie/crawling');
const movieRcm = require('../lib/movie/recommend');
const userMovieModel = require('../model/userMovieModel');

const personalRcmController = {
    movieSave : async(req, res) => {
        try {
            let movieList = req.body.movieList;

            if(movieList.length > 5) {
                return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '5개 이하로 선택해주세요.'});
            }

            await userMovieModel.usreMovie.deleteByUserId(req);
            for(let i=0; i<movieList.length; i++) {
                await userMovieModel.usreMovie.save(req,movieList[i]);
            }

            res.status(statusCode.OK).send({code: statusCode.OK, result: '저장되었습니다.'});

        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    getRecommendedMovies : async(req, res) => {
        try {
            let movieCodeList = new Array();
            let selectedMovies = await userMovieModel.usreMovie.findByUserId(req);

            for(let i=0; i<selectedMovies.length; i++) {
                movieCodeList.push(selectedMovies[i].movieCd);
            }
            if(selectedMovies.length === 0) {
                return res.status(statusCode.NO_CONTENT).send();
            } else {
                let resultList = new Array();
                let check = 0;

                for(let i=0; i<selectedMovies.length; i++) {
                    let movieCode = selectedMovies[i].movieCd;
                    let rcmMovie = await axios.get(`${process.env.FLASK_SERVER_URL}/personal/${encodeURI(movieCode)}`);
                    movieRcm.movieRecommend(movieCode, rcmMovie, (movieList) => {
                        check++;
                        if(movieList === 400){
                            return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '추천 시스템 에러'});
                        }
                        else if(movieList === 204){
                            console.log(204)
                        } else{
                            for(let j=0; j<movieList.length; j++) {
                                if(!movieCodeList.includes(movieList[j].movieCode)){
                                    resultList.push(movieList[j]);
                                    movieCodeList.push(movieList[j].movieCode)
                                }
                            }
                        }

                        if(check === selectedMovies.length) {
                            resultList.sort((a,b)=>{
                                return parseFloat(a.rank)-parseFloat(b.rank);
                            })
                            
                            return res.status(statusCode.OK).send({code: statusCode.OK, result: resultList});
                        }
                    })
                }
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    userSelectedMovie : (req, res) => {
        let movieCd = req.body.movieList;
        let movieList = [];
        for(let i=0; i<movieCd.length; i++){
            let movie = new Object();
            movie.rank = i;
            movie.movieCd = movieCd[i];
            crawling.parsing(movieCd[i], movie, (movie) => {
                movieList.push(movie);
                
                if(movieList.length === movieCd.length){
                    movieList.sort((a,b) => {
                        return parseFloat(a.rank)-parseFloat(b.rank)
                    })
                    if(movieList){
                        res.status(statusCode.OK).send({code: statusCode.OK, result : movieList});
                    }else{
                        res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '결과 없음'});
                    }
                }
            })
        }
    },

    userRcmMovies : async(req, res) => {
        try {
            let selectedMovies = await userMovieModel.usreMovie.findByUserId(req);
            if(selectedMovies.length === 0) {
                return res.status(statusCode.NO_CONTENT).send();
            } else {
                let movieList = [];
                for(let i=0; i<selectedMovies.length; i++){
                    let movie = new Object();
                    movie.rank = i;
                    movie.movieCd = selectedMovies[i].movieCd;
                    crawling.parsing(selectedMovies[i].movieCd, movie, (movie) => {
                        movieList.push(movie);
                        if(movieList.length === selectedMovies.length){
                            movieList.sort((a,b) => {
                                return parseFloat(a.rank)-parseFloat(b.rank)
                            })
                            if(movieList){
                                res.status(statusCode.OK).send({code: statusCode.OK, result : movieList});
                            }else{
                                res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result: '결과 없음'});
                            }
                        }
                    })
                }
            }

        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    }
}

module.exports = personalRcmController;