const boxOffice = require('./kobis');

async function getName(targetDt){

    let mvName = await boxOffice.movieData(targetDt);
    for(let i=0; i<mvName.boxOfficeResult.dailyBoxOfficeList.length; i++){
        let movieCd = mvName.boxOfficeResult.dailyBoxOfficeList[i].movieCd
        let mvName2 = await boxOffice.movieData2(movieCd)
        let prdtYear = mvName2.movieInfoResult.movieInfo.prdtYear
        mvName.boxOfficeResult.dailyBoxOfficeList[i].prdtYear = prdtYear;
        if(i===mvName.boxOfficeResult.dailyBoxOfficeList.length-1){
            return mvName.boxOfficeResult
        }
    }
}
module.exports = {getName};