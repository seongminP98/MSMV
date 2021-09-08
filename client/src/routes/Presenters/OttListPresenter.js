import React, {useState, optionsState} from "react";
import {Modal, Dropdown} from "react-bootstrap";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import styled from "styled-components";
import moment from "moment";

const STabs = styled(Tabs)`
  font-family: 'Jua', sans-serif;
  width: 1000px;
`;


const STabList = styled(TabList)`
  display: grid;
  grid-template-columns: 1fr 1fr;

  list-style-type: none;
  margin: 3px;
  padding: 5px;
`;

const STab = styled(Tab)`
  font-size: 30px;
  
  cursor: pointer;
  transition: 0.3s;
  background: #E2E1FF;

  border-radius : 15px 0 0 15px ;
  &.is-selected {
    background: #B4B1FF;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.5);
  }
  &:hover {
    background-color: #B4B1FF;
  }
  &active {
    background-color: #B4B1FF;
  }
`;

const STab2 = styled(STab)`
  border-radius : 0 15px 15px 0 ;
`

const STabPanel = styled(TabPanel)`
  display: none;

  &.is-selected {
    display: block;
  }
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

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none; 
  }
  text-align: right;
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
  width: 1000px;
  margin: auto;
`

const OttRoomListDiv = styled.div`
  width : 900px;
  margin: auto;
  padding-top: 25px;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  padding-bottom:10px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const OttRoom = styled.div`
  padding-top : 15px;
  height : 200px;
  width : 400px;
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
`

const MyRoom = styled(OttRoom)`
  background-color: #B4B1FF;
`

const NoRoomListDiv = styled(MyRoomListDiv)`
  display: block;
`



const OttListPresenter = ({classChange, titleChange, classificationChange, max_member_numChange, createRoom, enterRoom, roomList, myRoomList}) => {
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
      <STabs selectedTabClassName="is-selected" selectedTabPanelClassName="is-selected">
        <STabList>
          <STab>참여할 수 있는 방 목록</STab>
          <STab2>참여한 방 목록</STab2>
        </STabList>

        <STabPanel>
          <StyledButton variant="primary" onClick={handleShow}>생성</StyledButton> 
          <Dropdown onSelect={classChange}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              플랫폼 선택
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all"> 전체</Dropdown.Item>
              <Dropdown.Item eventKey="netflix"> 넷플릭스</Dropdown.Item>
              <Dropdown.Item eventKey="watcha"> 왓챠</Dropdown.Item>
              <Dropdown.Item eventKey="tving"> 티빙</Dropdown.Item>
              <Dropdown.Item eventKey="wave"> 웨이브</Dropdown.Item>
              <Dropdown.Item eventKey="etc"> 기타</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <OttRoomListDiv> 
            {roomList && roomList.slice(0).reverse().map((room) => ( 
              <OttRoom key={room.group_id}>
                <OttRoomTitle><h3>{room.title}</h3></OttRoomTitle>
                <OttRoomContent>
                    <p>{room.classification}</p>
                    <p>{room.current_count} / {room.max_member_num}인</p>
                    <p>{moment(room.created).format('YYYY-MM-DD')}</p>
                    {room.total_money ? <p> {room.total_money} 원</p> : <p>금액 미정</p>}
                  </OttRoomContent>
                <StyledButton onClick={enterRoom} value={room.group_id}>ENTER</StyledButton>
              </OttRoom>
              ))}
          </OttRoomListDiv>
        </STabPanel>

        <STabPanel>
          {(myRoomList.length !== 0) ? 
            <MyRoomListDiv>
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
            </MyRoomListDiv> : <NoRoomListDiv>
              없습니다
          </NoRoomListDiv>}
        </STabPanel>
      </STabs>

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
          <Input type="number" pattern="[0-9]*" placeholder="maxmemnum" onChange={max_member_numChange}></Input>
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