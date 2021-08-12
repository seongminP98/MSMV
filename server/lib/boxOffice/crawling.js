const axios = require('axios');
const cheerio = require('cheerio');

const getHTML = async(keyword) => {
    try{
        return await axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code="+keyword)
    }catch(err){
        console.log(err)
    }
    
}

const parsing = async(keyword, result, callback) => {
    const html = await getHTML(keyword);
    
    const $ = cheerio.load(html.data); 

    let date = $(".info_spec").find("span:eq(3)").text().trim()
    date = date.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")

    let genre = $(".info_spec").find("span:first").text().trim()
    genre = genre.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")

    result.image = $(".mv_info_area").find("img").attr("src")
    result.summary = $(".story_area").find(".con_tx").text()


    if(!result.title){
        let title = $(".mv_info_area").find(".h_movie").text()
        title = title.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
        result.title = title
    }
    if(genre===date){
        result.date = "정보 없음";
        //callback(false)
    }
    else if(date.charAt(0)==='['){
        result.date = "정보 없음";
    } 
    else{
        
        result.date = date
        
    }
    callback(result);
    
}

const parsingRecommend = async(keyword, result,callback) => {
    const html = await getHTML(keyword);
    
    const $ = cheerio.load(html.data); 
    let grade = $(".info_spec").find("span:eq(4)").text().trim()
    grade = grade.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    result.grade = grade;
    if(grade.includes('[국내]청소년 관람불가')){
        callback(false);
    } else{
        let date = $(".info_spec").find("span:eq(3)").text().trim()
        date = date.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    
        let genre = $(".info_spec").find("span:first").text().trim()
        genre = genre.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    
        result.image = $(".mv_info_area").find("img").attr("src")
        result.summary = $(".story_area").find(".con_tx").text()
        
        if(!result.title){
            let title = $(".mv_info_area").find(".h_movie").text()
            title = title.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
            result.title = title
        }
        if(genre===date){
            result.date = "정보 없음";
            //callback(false)
        }
        else if(date.charAt(0)==='['){
            result.date = "정보 없음";
        } 
        else{
            
            result.date = date
            
        }
        callback(result);
    }
    
    
}

const getHTMLGenre = async(keyword) => {
    try{
        return await axios.get("https://movie.naver.com/movie/sdb/rank/rmovie.naver?sel=cnt&date=20210723&tg="+keyword)
    }catch(err){
        console.log(err)
    }
    
}
const parsingGenre = async(keyword, callback) => {
    const html = await getHTMLGenre(keyword);
    
    const $ = cheerio.load(html.data); 

    let list = new Array();
    let movie = new Object();
    let len = $(".list_ranking").find("tr").length;
    let rank = 1;
    for(let i=2; i<len-1; i++ ){
        let mvLink = $(".list_ranking").find(`tr:eq(${i})`).find("td.title > .tit3 > a").attr("href") //영화링크
        let mvName = $(".list_ranking").find(`tr:eq(${i})`).find("td.title > .tit3 > a").text()
        if(mvLink !== undefined){
            movie = {
                "code" : mvLink.split('code=')[1],
                "name" : mvName,
                "rank" : rank
            }
            list.push(movie);
            rank++;
        }
    }
    callback(list);
}



module.exports = {parsing, parsingGenre, parsingRecommend};