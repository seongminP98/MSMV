const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const movieRcm = require('../lib/movie/recommend');
const axios = require('axios');

router.post('/', async(req, res, next) => {
    let movieList = new Array();
    movieList = req.body.movieList;

    if(movieList.length > 5) {
        return res.status(400).send({code:400, result : "5개 이하로 선택해주세요."});
    }

    await db.query(`DELETE from usermovie where user_id = ?`,
    [req.user.id], (error, result) => {
        if(error) {
            console.error('db error');
            next(error);
        }
    })

    for(let i=0; i<movieList.length; i++) {
        await db.query(`INSERT INTO usermovie(user_id, movieCd) VALUES(?,?)`,
        [req.user.id, movieList[i]],
        (error, result) => {
            if(error) {
                console.error('db error');
                next(error);
            }
        })
    }
    res.status(200).send({code:200, result : "저장되었습니다."})

})

router.get('/', async (req, response, next) => {
    let movieCdList = new Array();

    await db.query('SELECT * FROM usermovie where user_id = ?',
    [111], async (error, result) => {
        for(let i=0; i<result.length; i++) {
            movieCdList.push(result[i].movieCd);
        }
        if(error) {
            console.error('db error')
            next(error);
        }
        if(result.length===0) {
            return response.status(200).send({code:200, result : "먼저 영화를 선택해주세요."})
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


module.exports = router;