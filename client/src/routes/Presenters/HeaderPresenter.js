import React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import { Tooltip } from "antd";
import "../../App.css";



const Header = styled.header`
  position:relative; 
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding-top: 13px;
  width: 100%;
  height: 90px;
  background-color:#6b66ff;
  overflow: hidden;
  border-width : 0 0 3px 0;
  border-style : solid ;
  border-color: #595959;
  min-width:1190px;
`;

const Banner = styled(Link)`
  font-size: 3.1rem;
  letter-spacing:3px;
  color: white;
  text-decoration: none;
  font-family: 'Jua', sans-serif;
  &:hover {
    color: #C3D2E5;
  }
`;

const Menu = styled.div`
  display: block;
  text-align: right;
  padding-right: 80px;
`;

const StyledLink = styled(Link)`
  font-weight: 300;
  background-color: white;
  color : #6b66ff;
  padding: 15px;
  padding-top: 12px;
  padding-bottom: 10px;
  margin:0 5px 5px 0;
  position: relative;
  top: 20px;
  cursor: pointer;
  text-decoration: none;
  font-size: 20px;
  transition: .2s all;
  font-family: 'Jua', sans-serif;
  border-radius: 5px;
  &:hover {
      background: #7D79FF;
      color: white;
  }
`;

const MenuLeft = styled(Menu)`
  display: block;
  text-align: left;
  padding-left: 80px;
  padding-right:0px;
  overflow:hidden;
`;

const IntroMent = styled(StyledLink)`
  font-size: 20px;
  color: white;
  background: transparent;
  &:hover {
    color: #E8EFF8;
  }
`;

const HeaderPresenter = ({user, LogoutClick}) => {
  return (
    <Header>
      <MenuLeft>
        {user ? (
          <>
            <Tooltip title="마이페이지 가기!">
              <StyledLink to="MyPage"><img src="./avatar.png" width="25px"/></StyledLink>
            </Tooltip>
            <IntroMent to="MyPage">안녕하세요, {user.nickname}님!</IntroMent>
          </>
        ) : (<></>)}  
      </MenuLeft>
      <Banner to='/'>무슨무비</Banner>
      <Menu>
        {user ? (
            <StyledLink to="/" onClick={LogoutClick}>로그아웃</StyledLink>
        ) : (
          <>
            <StyledLink to="Login">로그인</StyledLink>
            <StyledLink to="Join">회원가입</StyledLink>
          </>
        )}  
            <Tooltip title="영화검색하러 가기!">
            <StyledLink to="Search"><img src="./search.png" width="25px"/></StyledLink>
            </Tooltip>
      </Menu>
    </Header>
  )
}

export default HeaderPresenter;