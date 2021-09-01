import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Modal} from "react-bootstrap";
import styled from "styled-components";


const StyledLink = styled(Link)`
  font-weight: 300;
  background-color: white;
  color : #6b66ff;
  padding: 15px;
  padding-top: 12px;
  padding-bottom: 10px;
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
  margin: auto;
`;

const StyledButton = styled.button`
  background-color: #7D79FF;
  color : white;
  cursor: pointer;
  font-size: 18px;
  transition: .2s all;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  border-radius: 5px;
  border-color: white;
  &:hover {
      background: white;
      color: #6b66ff;
  }
`;

const OttPage = styled.div`
  height: 900px;
  ;
`

const OttRoomListDiv = styled.div`
  height : 400px;
  width : 800px;
  margin: auto;
  padding-top: 25px;
`
const OttRoom = styled.div`
  padding-top : 15px;
  height : 150px;
  width : 700px;
  margin: auto;
  background-color: #E2E1FF;
  margin-top : 25px;
`

const MyRoomListDiv = styled(OttRoomListDiv)`
  border-bottom : 1px solid;
`

const MyRoom = styled(OttRoom)`
  background-color: #E2E1FF;
`

const OttListPresenter = ({}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }
  
  const handleConfirm = () => {
    setShow(false);
  }

  const handleShow = () => {
    setShow(true);
  }

  return (
      
    <OttPage>
      <MyRoomListDiv>
        <h2>참여한 방 목록</h2>
        <MyRoom>
          <h3>방의 이름</h3>
          <StyledLink to="/Ott/mine">ENTER</StyledLink>
        </MyRoom>
      </MyRoomListDiv>

      <OttRoomListDiv>
        <h2>참여할 수 있는 방 목록  <StyledButton variant="primary" onClick={handleShow}>생성</StyledButton></h2>
        <OttRoom>
          <StyledLink to="/Ott/other">ENTER</StyledLink>
       </OttRoom>
      </OttRoomListDiv>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>방 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>방 내용 입력</Modal.Body>
        <Modal.Footer>
          <StyledButton variant="secondary" onClick={handleClose}>
            닫기
          </StyledButton>
          <StyledButton variant="primary" onClick={handleConfirm}>
            생성
          </StyledButton>
        </Modal.Footer>
      </Modal>
    </OttPage>
  )
}

export default OttListPresenter;