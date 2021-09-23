import React, {useState} from 'react';
import axios from 'axios';
import store from '../store';
import { useHistory } from 'react-router';
import swal from "@sweetalert/with-react";
import AuthPresenter from './Presenters/AuthPresenter';

const Auth = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');  
  const props = { id, password };
  const history = useHistory();

  const onChange = (e) => {
    const target = e.target.id;
    const { value } = e.target;

    if (target === 'id') 
      setId(value);
    else if (target === 'password')
      setPassword(value);
  }
  
  const onSubmit = async (e) => {
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {id, password}, { withCredentials: true })
    .then((response) => {
      history.push({pathname : '/'});
      store.dispatch({ type : 'LOGIN', user: response.data.result});
    })
    .catch((error) => swal("아이디와 비밀번호를 확인해주세요."));
  } 

  return (
    <AuthPresenter onChange={onChange} onSubmit={onSubmit} {...props}/>
  )
}

export default Auth;