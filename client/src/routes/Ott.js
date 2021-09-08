import React, {useEffect, useState} from 'react';
import axios from 'axios';
import OttListPresenter from './Presenters/OttListPresenter';
import OttRoomPresenter from './Presenters/OttRoomPresenter';
import { HashRouter as Router, Route, useHistory, useLocation } from 'react-router-dom'; 
import moment from "moment";


const Ott = ({match}) => {
  // below Room List

  const [searchClass, setSearchClass] = useState();

  const classChange = async (e) => {
    if (e === "all") {
      getRoomList();
      setSearchClass("");
    }
    else 
      setSearchClass(e);
  }

/*  
  const axiosform = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/`, {withCredentials : true})
    .then((response) => {    
    })
    .catch((error) => {
    });
  }
  */
  
  const getClassRoomList = async () => {
    if (!searchClass)
      await getRoomList();
    else {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/ott/search/${searchClass}`, {withCredentials : true})
    .then((response) => {    
      setRoomList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  }

  const [title, setTitle] = useState();
  const [classification, setClassification] = useState("netflix");
  const [max_member_num, setMax_member_num] = useState();

  const titleChange = (e) => {
    setTitle(e.target.value);
  }

  const classificationChange = (e) => {
    setClassification(e.target.value);
  }

  const max_member_numChange = (e) => {
    setMax_member_num(e.target.value);
  }

  const change = {classChange, titleChange, classificationChange, max_member_numChange};

  const createRoom = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/make`, {title, classification, max_member_num}, {withCredentials : true})
    .then((response) => {    
      getRoomList();
      getMyRoomList();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [groupDetail, setGroupDetail] = useState();

  const history = useHistory();
  const location = useLocation();

  const getRoomDetail = async () => {
    if (location.pathname === "/Ott") {
      ; // in list page, do nothing
    }
    else {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}${location.pathname}`, {withCredentials : true})
      .then((response) => {
        setGroupDetail(response.data.result);
        setDetailTitle(response.data.result.title);
        setNotice(response.data.result.notice);
        setAccount(response.data.result.account);
        setOtt_id(response.data.result.ott_id);
        setOtt_pwd(response.data.result.ott_pwd);
        setTerm(response.data.result.term);
        setStartDate(moment(response.data.result.start_date).format("YYYY-MM-DD"));
        setNewMoney(response.data.result.total_money);
      })
      .catch((error) => {
        window.alert(error);
        history.push("/");
      });
    }
  }

  const enterRoom = async (e) => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/ott/participation/${e.target.value}`, {withCredentials : true})
    .then((response) => {
      console.log(response);
      if (response.data.code === 198) 
        window.alert(response.data.result);
      else
        history.push(`/Ott/${e.target.value}`);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const submit = {createRoom, enterRoom, translationPlatform};

  const [roomList, setRoomList] = useState([]);
  const [myRoomList, setMyRoomList] = useState([]);

  const getRoomList = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/ott`, {withCredentials : true})
    .then((response) => {    
      setRoomList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getMyRoomList = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/ott/mine`, {withCredentials : true})
    .then((response) => {    
      setMyRoomList(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const props = {roomList, myRoomList, searchClass};


  // below Room Detail

  const [detailTitle, setDetailTitle] = useState();
  const [notice, setNotice] = useState();
  const [account, setAccount] = useState();
  const [ott_id, setOtt_id] = useState();
  const [ott_pwd, setOtt_pwd] = useState();
  const [term, setTerm] = useState();
  const [start_date, setStartDate] = useState();
  const [newMoney, setNewMoney] = useState();

  const detailTitleChange = (e) => {
    setDetailTitle(e.target.value);
  }

  const noticeChange = (e) => {
    setNotice(e.target.value);
  }

  const accountChange = (e) => {
    setAccount(e.target.value);
  }

  const ott_idChange = (e) => {
    setOtt_id(e.target.value);
  }

  const ott_pwdChange = (e) => {
    setOtt_pwd(e.target.value);
  }

  const termChange = (e) => {
    setTerm(e.target.value);
  }

  const start_dateChange = (e) => {
    setStartDate(moment(e.target.value).format('YYYY-MM-DD'));
  }

  const newMoneyChange = (e) => {
    setNewMoney(e.target.value);
  }


  function validateDate(date) {
    let today = new Date();
    let comp = new Date(date);

    if (comp - today >= 0)
      return false;
    else 
      return true;
  }

  const patchDetail = async () => {
    let title = detailTitle;
    let money = newMoney;
    if (validateDate(start_date)) {
      window.alert("입력한 날짜가 유효하지 않습니다.");
      return 0;
    }

    let tempDate = new Date(start_date);
    tempDate.setDate(tempDate.getDate() + Number(term));
    let end_date = moment(tempDate).format('YYYY-MM-DD');
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}${location.pathname}`, {title, notice, account, ott_id, ott_pwd, term, start_date, end_date, money}, {withCredentials : true})
    .then((response) => {    
      window.alert("수정이 완료됐습니다.");
      getRoomDetail();
    })
    .catch((error) => {
      console.log(error);
    });

    
  }

  const exitRoom = async () => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/ott/${groupDetail.id}`, {withCredentials : true})
    .then((response) => {    
      console.log(response);
      history.push("/ott");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [remittances, setRemittances] = useState();

  const checkMemberRemittance = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/ott/remittance/${groupDetail.id}`, {withCredentials : true})
    .then((response) => {    
      console.log(response);
      setRemittances(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const sendRemittanceDone = async () => {
    let groupId = groupDetail.id;
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/remittance`, {groupId}, {withCredentials : true})
    .then((response) => {    
      console.log(response);
      window.alert(response.data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const setMemberRemittance = async (e) =>{
    let groupId = groupDetail.id
    let user_id = e.target.value;
    let remittance_id = e.target.name;
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/remittance/complete`, {groupId, user_id, remittance_id}, {withCredentials : true})
    .then((response) => {    
      console.log(response);
      window.alert(`리미턴스 체크 완료`);
      getRoomDetail();
      checkMemberRemittance();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const [contents, setContents] = useState();

  const commentsChange = (e) => {
    setContents(e.target.value);
  }

  const writeOnClick = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/comment/${groupDetail.id}`, { contents }, {withCredentials : true})
    .then((response) => {
     console.log(response);
     getRoomDetail();
    })
    .catch((error)=> {
      console.log(error);
      window.alert("댓글 작성 중 오류가 발생했습니다.")
    })
  }

  const deleteOnClick = async (e) => {
    await axios.delete(`${process.env.REACT_APP_SERVER_URL}/ott/comment/${e.target.id}`, {withCredentials: true})
    .then((response) => {
     console.log(response);
     window.alert("리뷰가 삭제되었습니다.")
     getRoomDetail();
    })
    .catch((error)=> {
      console.log(error);
      //window.alert(error.message);
    }) 
  }

  function translationPlatform(platform) {
    if (platform === "netflix")
      return ("넷플릭스");
    else if (platform === "watcha")
      return ("왓챠");
    else if (platform === "wave")
      return ("웨이브");
    else if (platform === "tving")
      return ("티빙");
    else
      return ("기타");
  }

  const detailChange = {detailTitleChange, noticeChange, accountChange, ott_idChange, ott_pwdChange, termChange, start_dateChange, newMoneyChange, commentsChange};
  const detailSubmit = {patchDetail, exitRoom, translationPlatform, checkMemberRemittance, sendRemittanceDone, setMemberRemittance, writeOnClick, deleteOnClick};


  useEffect(() => getRoomList(), [window.location.href]);
  useEffect(() => getMyRoomList(), [window.location.href]);
  useEffect(() => getRoomDetail(), [window.location.href]);
  useEffect(() => getClassRoomList(), [searchClass]);

  return (
    <Router>
      <Route exact path={match.path}>
        <OttListPresenter {...change} {...submit} {...props}/>
      </Route>
      <Route path={`${match.path}/:id`}>
        <OttRoomPresenter groupDetail={groupDetail} remittances={remittances} {...detailChange} {...detailSubmit}/>
      </Route>
    </Router>
  )
}

export default Ott;