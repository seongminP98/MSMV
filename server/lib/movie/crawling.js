const axios = require('axios');
const cheerio = require('cheerio');

const getHTML = async(keyword) => {
    try{
        return await axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code="+keyword)
    }catch(err){
        console.error(err)
    }   
}

const getHTMLPost = async(keyword) => {
    try{
        return await axios.get("https://movie.naver.com/movie/bi/mi/photoViewPopup.naver?movieCode="+keyword)
    }catch(err){
        console.error(err)
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
        console.error(err)
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

const parsingDetail = async(keyword,review, callback) => {
    const html = await getHTML(keyword);
    
    const $ = cheerio.load(html.data);

    let item = new Object();
    let show = false;
    let title = $(".mv_info").find(`h3>a`).text()
    if(title.includes('상영중')){
        title = title.split('상영중')[0];
        show = true;
    }else{
        title = title.substring(0,title.length/2);
    }
    let summary = $(".story_area").find(".con_tx").text()
    let $peopleList = $(".people >ul > li")
    let people = new Object();
    let peopleArray = new Array();

    $peopleList.each((idx,node)=>{
        let peopleImage = $(node).find("img").attr("src")
        let peopleName =  $(node).find(".tx_people").text()
        let peopleJob =$(node).find(".staff").text().trim()

        people = {
            "peopleImage" : peopleImage,
            "peopleName" : peopleName,
            "peopleJob" : peopleJob,
        }
        peopleArray.push(people);
    })
    let genre = $(".info_spec").find("span:first").text().trim()
    let country = $(".info_spec").find("span:eq(1)").text().trim()
    let time = $(".info_spec").find("span:eq(2)").text().trim()
    let date = $(".info_spec").find("span:eq(3)").text().trim()
    let grade = $(".info_spec").find("span:eq(4)").text().trim()
    
    if(!show){
      if(date.charAt(0)==='['){
        grade = date;
      }
      show = '정보 없음'
    }
    
    if(!date.includes("개봉")){
        date = '정보 없음'
    }
    
    if(grade.charAt(0)!=='['){
      grade = '정보 없음'
    }
    country = country.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    grade = grade.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    date = date.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    genre = genre.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    time = time.replace(/(\r\n\t|\n|\r\t|\t)/gm,"")
    
    //드라마 디테일 페이지 
    if(time.substring(0,4) === '[국내]') {
      grade = time;
      time = '정보없음';
    }

    if(genre.includes('한국')){
      if(country.split(' ')[1] === '개봉') {
        date = country;
      }
      country = '한국';
      genre = '정보없음';
    }

    if(time.includes("개봉")){
      date = time;
      time = "정보없음";
    }

    if(!time.includes("분")){
      time = "정보없음";
    }
    //

    item = {
        "title": title,
        "show" : show,
        "summary": summary,
        "people" : peopleArray,
        "genres" : genre,
        "country" : country,
        "runningTime" : time,
        "openDt" : date,
        "grade" : grade,
        "review" : review
    }
    callback(item);
}

const parsingPost = async(keyword,result,callback) => {
    const html = await getHTMLPost(keyword);
    const $ = cheerio.load(html.data); 
    result.image = $("#page_content").find("img").attr("src")

    callback(result);
}



module.exports = {parsing, parsingGenre, parsingRecommend, parsingDetail, parsingPost};