import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Join = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: inter;
`;

const JoinForm = styled.form`
  width: 500px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  box-sizing: border-box;
`;

const JoinTitle = styled.div`
  margin-top: 10px;
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

const JoinButton = styled.button`
  margin-top: 25px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
  width: 80%;
  background-color: #6b66ff;
  height: 50px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  &:hover {
    background-color: #6799ff;
    color: white;
  }
`;

const AskLoginDiv = styled.div`
  margin-top: 20px;
  display: flex;
`;

const AskLoginTitle = styled.div`
  margin-right: 8px;
  font-size: 15px;
  color: gray;
`;

const LoginLink = styled(Link)`
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

const JoinPresenter = ({ onSubmit, onChange, id, password, nickname, passwordCheck }) => {
  return (
    <Join>
      <JoinForm>
        <JoinTitle>회원가입</JoinTitle>
        <InputContainer>
          <Input required={true} minLength={5} maxLength={10} value={id} placeholder="아이디" id="id" onChange={onChange} />
          <Input required={true} maxLength={8} value={nickname} placeholder="닉네임" id="nickname" onChange={onChange} />
          {/* <Input
            required={true}
            minLength={10}
            maxLength={30}
            type="email"
            value={email}
            placeholder="이메일"
            id="email"
            onChange={onChange}
          /> */}
          <Input
            required={true}
            minLength={6}
            maxLength={13}
            type="password"
            value={password}
            placeholder=" 비밀번호"
            id="password"
            onChange={onChange}
          />
          <Input
            required={true}
            minLength={6}
            maxLength={13}
            type="password"
            value={passwordCheck}
            placeholder="비밀번호 확인"
            id="passwordCheck"
            onChange={onChange}
          />
          
        </InputContainer>
        <JoinButton onClick={onSubmit}>회원가입</JoinButton>
        <AskLoginDiv>
          <AskLoginTitle>이미 계정이 있으신가요?</AskLoginTitle>
          <LoginLink to="/login">
            <LinkInnerSpan>로그인</LinkInnerSpan>
          </LoginLink>
        </AskLoginDiv>
      </JoinForm>
    </Join>

  );
};

export default JoinPresenter;
