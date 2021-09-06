import React, {useState, optionsState} from "react";
import {Link} from "react-router-dom";
import {Modal, Dropdown} from "react-bootstrap";
import styled from "styled-components";
import moment from "moment";

const StyledLink = styled(Link)`
  font-weight: 300;
  background-color: white;
  color : #6b66ff;
  padding: 15px;
  padding-top: 6px;
  padding-bottom: 6px;
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

const OttSelect = styled.select`
  text-align: center;
  width : 80px;
  height : 50px;
  font-size: 20px;
  margin-top : 5px;
  padding-left: 3px;
  outline: none;
  &:hover,
  &:focus {
    border: 1px solid #6799ff;
  }
`;

const OttOption = styled.option`
  text-align: center;
  font-size: 20px;
`;

const OttPage = styled.div`
  min-height: 900px;
  ;
`

const OttRoomListDiv = styled.div`
  width : 800px;
  margin: auto;
  padding-top: 25px;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  padding-bottom:10px;
  margin-bottom: 10px;
`
const OttRoom = styled.div`
  padding-top : 15px;
  height : 200px;
  width : 700px;
  margin: auto;
  background-color: #E2E1FF;
  margin-top : 25px;
  font-size: 18px;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  border-radius : 10px;
`

const OttRoomTitle = styled.div`

`;

const OttRoomContent = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const MyRoomListDiv = styled(OttRoomListDiv)`

  border-bottom : 1px solid;
`

const MyRoom = styled(OttRoom)`
  background-color: #B4B1FF;
`

const OttListPresenter = ({classChange, titleChange, classificationChange, max_member_numChange, moneyChange, createRoom, enterRoom, roomList, myRoomList}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }
  
  const handleConfirm = () => {
    setShow(false);
    createRoom();
  }

  const handleShow = () => {
    setShow(true);
  }

  return (
      
    <OttPage>
      {myRoomList ? 
        <MyRoomListDiv>
          <h2>참여한 방 목록</h2>
          {myRoomList && myRoomList.slice(0).reverse().map((room) => ( 
            <MyRoom key={room.group_id}>
              <OttRoomTitle><h3>{room.title}</h3></OttRoomTitle>
              <OttRoomContent>
                <p>{room.classification}</p>
                <p>{room.current_count} / {room.max_member_num}인</p>
                <p>{moment(room.created).format('YYYY-MM-DD')}</p>
                {room.total_money ? <p> {room.total_money} 원</p> : <p>금액 미정</p>}
              </OttRoomContent>
              <StyledButton onClick={enterRoom} value={room.group_id}>ENTER</StyledButton>
            </MyRoom>
            ))}
        </MyRoomListDiv> : <></>}

      <OttRoomListDiv>
        <h2>참여할 수 있는 방 목록
          <StyledButton variant="primary" onClick={handleShow}>생성</StyledButton> 
          <Dropdown onSelect={classChange}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              플랫폼 선택
            </Dropdown.Toggle>
            <Dropdown.Menu  >
              <Dropdown.Item eventKey="netflix"> 넷플릭스</Dropdown.Item>
              <Dropdown.Item eventKey="watcha"> 왓챠</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </h2>
        {roomList && roomList.slice(0).reverse().map((room) => ( 
          <OttRoom key={room.group_id}>
            <OttRoomTitle><h3>{room.title}</h3></OttRoomTitle>
            <OttRoomContent>
              <p>{room.classification}</p>
              <p>{room.current_count} / {room.max_member_num}인</p>
              <p>{room.created}</p>
              <StyledButton onClick={enterRoom} value={room.group_id}>ENTER</StyledButton>
            </OttRoomContent>
          </OttRoom>
          ))}
      </OttRoomListDiv>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>방 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <h2>방 내용 입력</h2>
          <OttSelect name="ott" value={optionsState} onChange={classificationChange}>
            <OttOption value="netflix"> 넷플릭스</OttOption>
            <OttOption value="watcha"> 왓챠</OttOption>
            <OttOption value="tving"> 티빙</OttOption>
            <OttOption value="wave"> 웨이브</OttOption>
            <OttOption value="etc"> 기타</OttOption>
          </OttSelect>
          <Input placeholder="title" onChange={titleChange}></Input>
          <Input placeholder="maxmemnum"onChange={max_member_numChange}></Input>
          <Input placeholder="money"onChange={moneyChange}></Input>
        </Modal.Body>
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