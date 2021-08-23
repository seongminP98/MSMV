import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Login = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  font-family: inter;
  height:800px;
`;

const LoginForm = styled.form`
  width: 500px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  box-sizing: border-box;
`;

const LoginTitle = styled.div`
  margin-top: 8px; // 
  font-size: 30px;
  font-weight: 600;
`;

const InputContainer = styled.div`
  width: 80%;
  margin-top: 40px;
`;

const Input = styled.input`
  padding: 0px 10px;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid gray;
  border-radius: 1px;
  transition: border 0.1s ease-in-out;
  outline: none;
  &:hover,
  &:focus {
    border: 2px solid #6799ff;
  }
`;

const PasswordTitleDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

// const PasswordResetLink = styled(Link)`
//   color: red;
//   text-decoration: none;
//   font-size: 13px;
// `;

const LoginButton = styled.button`
  margin-top: 25px;
  border: none;
  cursor: pointer;
  outline: none;
  width: 80%;
  background-color: #6b66ff;
  height: 50px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 20px;
  &:hover {
    background-color: #6799ff;
    color: white;
  }
  
`;

const AskJoinDiv = styled.div`
  margin-top: 30px;
  position: relative;
  top: -60px;
  display: flex;
`;

const AskJoinTitle = styled.div`
  margin-right: 8px;
  font-size: 15px;
  color: gray;
`;

const JoinLink = styled(Link)`
  text-decoration: none;
  color: black;
  position: relative;
  top: -1px;
  transition: all 0.1 ease-in-out;
  &:hover {
    color: darkred;
  }
`;

const LinkInnerSpan = styled.span`
  display: box;
  margin-right: 5px;
`;

const AuthPresenter = ({ id, password, onChange, onSubmit }) => {
  return (
    <Login>
      <LoginForm onSubmit={onSubmit}>
        <LoginTitle>로그인</LoginTitle>
        <InputContainer>
          <Input onChange={onChange} value={id} placeholder="아이디" id="id" />
          <PasswordTitleDiv>
          </PasswordTitleDiv>
          <Input onChange={onChange} value={password} placeholder="비밀번호" id="password" type="password" />
        </InputContainer>
        <LoginButton type="submit">로그인 하기</LoginButton>
      </LoginForm>

      <AskJoinDiv>
        <AskJoinTitle>처음 오셨나요?</AskJoinTitle>
        <JoinLink to="/join">
          <LinkInnerSpan>회원가입</LinkInnerSpan>
        </JoinLink>
      </AskJoinDiv>
    </Login>
  );
};

export default AuthPresenter;