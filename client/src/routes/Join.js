import React, { useState } from 'react';
import axios from 'axios';
import store from '../store';
import {useHistory} from 'react-router';
import JoinPresenter from './Presenters/JoinPresenter';
import swal from "@sweetalert/with-react";

const Join = () => {
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const props = {id, nickname, password, passwordCheck};

  const onChange = (e) => {
    const target = e.target.id;
    const { value } = e.target;

    if (target === 'id') 
      setId(value);
    else if (target === 'nickname')
      setNickname(value);
    else if (target === 'password')
      setPassword(value);
    else if (target === 'passwordCheck')
      setPasswordCheck(value);
  };

  const isPasswordSame = () => {
    return password === passwordCheck;
  }

  const isIdAvailable = async () => {
    let code;

    if (id === "") {
      code = 401;
      return code;
    }

    if (id.length < 5) {
      code = 402;
      return code;
    }

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/join/id`, { id })
    .then((response) => {
      if (response.data.code === 200)
        code = 200;
    })
    .catch((e) => {
      if (e.response.data.code === 400)
        code = 400;
      else
        code = 0;
    })

    return code;
  }

  const isNicknameAvailable = async () => {
    let code;

    if (nickname === "") {
      code = 401;
      return code;
    }

    await axios.post(`${process.env.REACT_APP_SERVER_URL}/join/nick`, { nickname })
    .then((response) => {
      if (response.data.code === 200)
      code = 200;
  })
    .catch((e) => {
      if (e.response.data.code === 400)
        code = 400;
      else
        code = 0;
    })

    return code;
  }


  const isPasswordAvailable = () => {
    let code = 200;

    if (password === "") {
      code = 401;
    }

    else if (password.length < 6) {
      code = 402;
    }

    return code;
  }

  const history = useHistory();

  const requestJoin = async () => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/join`, { id, password, nickname })
      .then(async (response) => {
        await store.dispatch({ type: 'LOGIN', user: response.data.result });
        swal('정상적으로 회원가입 되었습니다!');
        history.push({ pathname: '/' });
      })
      .catch((error) => swal('회원가입 중 에러가 발생하였습니다!'));
  };

  const onSubmit = async (e) => {
    if (!isPasswordSame())
      return swal('비밀번호를 다시 확인해주세요.');
    
    //id check
    switch(await isIdAvailable()) {
      case 200 : 
        break;
      case 400 :
        return swal('중복된 아이디입니다.');
      case 401 :
        return swal("아이디를 입력해주세요.");
      case 402 : 
        return swal("아이디가 너무 짧습니다. (5자 이상)");
      default :
        return swal('ID 체크 중 오류');
    }

    switch(await isNicknameAvailable()) {
      case 200 : 
        break;
      case 400 :
        return swal('중복된 닉네임입니다.'); 
      case 401 :
        return swal("닉네임을 입력해주세요.");
      default :
        return swal('닉네임 체크 중 오류');
    }

    switch(isPasswordAvailable()) {
      case 200 : 
        break;
      case 401 :
        return swal("비밀번호를 입력해주세요.");
      case 402 : 
        return swal("비밀번호가 너무 짧습니다. (6자 이상)");
      default :
        return swal('비밀번호 체크 중 오류');
    }

    await requestJoin();
  }

  return (
    <JoinPresenter onSubmit={onSubmit} onChange={onChange} {...props} />
  )
}

export default Join;