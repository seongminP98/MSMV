import axios from 'axios';
import React, {useEffect, useState} from 'react';
import store from "../store";
import MyPagePresenter from './Presenters/MyPagePresenter.js';
import swal from "@sweetalert/with-react";

const MyPage = () => {
  const [newNickname, setNewNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [myReviews, setMyReviews] = useState([]);

  const takeNewNickname = (e) => {
    setNewNickname(e.target.value);
  }

  const submitNewNickname = async () => {
    const nickname = newNickname;

    if (nickname === store.getState().user.nickname) {
      swal("현재 닉네임과 동일한 닉네임입니다.")
    }
    else {
      await axios.patch(`${process.env.REACT_APP_SERVER_URL}/mypage/nickname`, { nickname }, { withCredentials: true })
      .then((response) => {
        if (response.data.code === 400) {
          swal("해당 닉네임이 이미 존재합니다.");
        }
        else if (response.data.code === 200) {
          swal("닉네임이 정상적으로 변경되었습니다.\n\n잠시 후 업데이트됩니다...");
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        }
      })
      .catch((error) => {
        swal(error);
      });
    }
  }

  const takeNewPassword = async (e) => {
    setNewPassword(e.target.value);
  }
  const takeOldPassword = async (e) => {
    setOldPassword(e.target.value);
  }

  const submitNewPassword = async () => {
    await axios.patch(`${process.env.REACT_APP_SERVER_URL}/mypage/password`, { oldPassword, newPassword }, { withCredentials: true })
    .then((response) => {
      swal("비밀번호가 정상적으로 변경되었습니다.\n\n잠시 후 업데이트됩니다...");
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    })
    .catch((error) => {
      swal(error.response.data.message);
    });
  }

  const takeWithdrawPassword = async (e) => {
    setWithdrawPassword(e.target.value);
  }

  const submitWithdraw = async () => {
    const pw = withdrawPassword;
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/mypage/withdraw`, { pw }, { withCredentials: true })
    .then((response) => {
      swal("탈퇴가 정상적으로 진행되었습니다.");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000)
    })
    .catch((error) => {
      swal(error.response.data.message);
    });
  }

  const getMyReviews = async() => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/mypage/myReview`, { withCredentials:true })
    .then((response) => {
      setMyReviews(response.data.result);
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  useEffect(() => getMyReviews(), []);

  return (
    <MyPagePresenter takeNewNickname={takeNewNickname} submitNewNickname={submitNewNickname} takeNewPassword={takeNewPassword} takeOldPassword={takeOldPassword} submitNewPassword={submitNewPassword} takeWithdrawPassword={takeWithdrawPassword} submitWithdraw={submitWithdraw} myReviews={myReviews}/>
  )
}

export default MyPage;