const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const movieRcm = require('../lib/movie/recommend');
const axios = require('axios');
const crawling = require('../lib/movie/crawling');

router.post('/', async(request, res, next) => {
    let movieList = new Array();
    movieList = request.body.movieList;

    if(movieList.length > 5) {
        return res.status(400).send({code:400, result : "5개 이하로 선택해주세요."});
    }

    await db.query(`DELETE from usermovie where user_id = ?`,
    [request.user.id], (error, result) => {
        if(error) {
            console.error('db error');
            next(error);
        }
    })

    for(let i=0; i<movieList.length; i++) {
        await db.query(`INSERT INTO usermovie(user_id, movieCd) VALUES(?,?)`,
        [request.user.id, movieList[i]],
        (error, result) => {
            if(error) {
                console.error('db error');
                next(error);
            }
        })
    }
    res.status(200).send({code:200, result : "저장되었습니다."})

})

router.get('/', async (request, response, next) => {
    let movieCdList = new Array();

    await db.query('SELECT * FROM usermovie where user_id = ?',
    [request.user.id], async (error, result) => {
        for(let i=0; i<result.length; i++) {
            movieCdList.push(result[i].movieCd);
        }
        if(error) {
            console.error('db error')
            next(error);
        }
        if(result.length===0) {
            return response.status(204).send({code:204, result : "먼저 영화를 선택해주세요."})
        } else{
            let sumList = new Array();
            let check = 0;

            for(let i=0; i<result.length; i++) {
                
                let movieCode = result[i].movieCd;
                let res = await axios.get(`${process.env.FLASK_SERVER_URL}/personal/${encodeURI(movieCode)}`);
                movieRcm.movieRecommend(movieCode, res, function(movieList){
                    check++;
                    if(movieList === 400){
                        console.log(400)
                        return response.status(400).send({code : 400, result : '에러'});
                    }
                    else if(movieList === 204){
                        console.log(204)
                    } else{
                        for(let j=0; j<movieList.length; j++) {
                            
                            if(!movieCdList.includes(movieList[j].movieCode)){
                                sumList.push(movieList[j]);
                                movieCdList.push(movieList[j].movieCode)
                            }
                        }
                    }

                    if(check === result.length) {
                        sumList.sort((a,b)=>{
                            return parseFloat(a.rank)-parseFloat(b.rank);
                        })
                        
                        return response.status(200).send({code : 200, result : sumList});
                    }
                })
            }
        }
    })
})

router.post('/usermovie', async (request, response) => {

    let movieCd = request.body.movieList; //사용자가 선택한 영화

    let movieList = [];
    for(let i=0; i<movieCd.length; i++){
        let result = new Object();
        result.rank = i;
        result.movieCd = movieCd[i];
        crawling.parsing(movieCd[i],result,function(res){
            movieList.push(res);
            
            if(movieList.length === movieCd.length){
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
})

router.get('/usermovies', async (request, response) => {
    await db.query('select * from usermovie where user_id = ?',
    [request.user.id], async (error, dbResult) =>{
        if(error) {
            console.error('db error')
            next(error);
        }
        if(dbResult.length===0) {
            return response.status(204).send({code:204, result : "먼저 영화를 선택해주세요."})
        } else{
            let movieList = [];
            for(let i=0; i<dbResult.length; i++){
                let result = new Object();
                result.rank = i;
                result.movieCd = dbResult[i].movieCd;
                crawling.parsing(dbResult[i].movieCd,result,function(res){
                    movieList.push(res);
                    
                    if(movieList.length === dbResult.length){
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