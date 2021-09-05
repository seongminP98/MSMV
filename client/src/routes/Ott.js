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
    console.log(e);
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
  const [money, setMoney] = useState();

  const titleChange = (e) => {
    setTitle(e.target.value);
  }

  const classificationChange = (e) => {
    setClassification(e.target.value);
  }

  const max_member_numChange = (e) => {
    setMax_member_num(e.target.value);
  }

  const moneyChange = (e) => {
    setMoney(e.target.value);
  }

  const change = {classChange, titleChange, classificationChange, max_member_numChange, moneyChange};

  const createRoom = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/make`, {title, classification, max_member_num, money}, {withCredentials : true})
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
        console.log(response);
        setGroupDetail(response.data.result);
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
        window.alert(e.target.result);
      else
        history.push(`/Ott/${e.target.value}`);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const submit = {createRoom, enterRoom};

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

  const props = {roomList, myRoomList};


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
    console.log(e.target.value);
    setDetailTitle(e.target.value);
  }

  const noticeChange = (e) => {
    console.log(e.target.value);
    setNotice(e.target.value);
  }

  const accountChange = (e) => {
    console.log(e.target.value);
    setAccount(e.target.value);
  }

  const ott_idChange = (e) => {
    console.log(e.target.value);
    setOtt_id(e.target.value);
  }

  const ott_pwdChange = (e) => {
    console.log(e.target.value);
    setOtt_pwd(e.target.value);
  }

  const termChange = (e) => {
    console.log(e.target.value);
    setTerm(e.target.value);
  }

  const start_dateChange = (e) => {
    console.log(e.target.value);
    setStartDate(e.target.value);
  }

  const newMoneyChange = (e) => {
    console.log(e.target.value);
    setNewMoney(e.target.value);
  }


  const patchDetail = async () => {
    let title = detailTitle;
    let money = newMoney;
    let tempDate = new Date(start_date);
    tempDate.setDate(tempDate.getDate() + term);
    let end_date = moment(tempDate).format('YYYY-MM-DD');
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}${location.pathname}`, {title, notice, account, ott_id, ott_pwd, term, start_date, end_date, money}, {withCredentials : true})
    .then((response) => {    
      console.log(response);
      getRoomDetail();
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
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const setMemberRemittance = async (e) =>{
    let groupId = groupDetail.id
    let user_id = e.target.value;
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/ott/remittance/complete`, {groupId, user_id}, {withCredentials : true})
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

  const detailChange = {detailTitleChange, noticeChange, accountChange, ott_idChange, ott_pwdChange, termChange, start_dateChange, newMoneyChange};
  const detailSubmit = {patchDetail, checkMemberRemittance, sendRemittanceDone, setMemberRemittance};

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