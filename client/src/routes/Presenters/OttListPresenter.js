import React, {useState, optionsState} from "react";
import {Modal, Dropdown} from "react-bootstrap";
import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import styled from "styled-components";
import moment from "moment";

const STabs = styled(Tabs)`
  font-family: 'Jua', sans-serif;
`;


const STabList = styled(TabList)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  list-style-type: none;
  padding: 5px;

  width: 900px;
  margin: auto;
  margin-top: 20px;
`;

const STab = styled(Tab)`
  font-size: 30px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  background: #E2E1FF;

  padding-top: 10px;
  padding-bottom: 10px;

  border-style: solid;
  border-width : 0 0 3px 0;
  border-bottom-color: #595959;  
  border-radius : 15px 0 0 15px ;

  
  &.is-selected {
    background: #B4B1FF;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.5);
  }
  &:hover {
    box-shadow: 0 0 0 2px rgba(133, 133, 133, 0.5);
  }
  
  &active {
    background-color: #B4B1FF;
  }
`;

const STab2 = styled(STab)`
  border-radius : 0 15px 15px 0 ;
  display: block;
  padding-left: 20px;
  text-align: left;
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

const WriteButton = styled.button`
  position: fixed;
  bottom: 90px;
  right: 70px; 
  background: transparent;
  border: 0;
`

const WriteImage = styled.img`
  width: 100px;
`

const OttSelect = styled.select`
  width : 200px;
  height : 50px;
  font-size: 17px;
  margin-top : 5px;
  padding-left: 3px;
  border-radius: 3px;
  outline: none;
  &:hover,
  &:focus {
    border: 1px solid #6799ff;
  }
`;

const OttOption = styled.option`
`;

const OttPage = styled.div`
  min-height: 900px;
  width: 1000px;
  margin: auto;
`

const OttRoomListDiv = styled.div`
  width : 840px;
  margin: auto;
  padding-top: 10px;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  padding-bottom:10px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const OttRoom = styled.div`
  background : white;
  font-size: 18px;
  text-align: center;

  width: 90%;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;

  padding-bottom: 10px;
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 20px;

  border-style: solid;
  border-width : 1px 1px 3px 1px;
  border-radius : 7px;
  border-color: #595959;
`

const OttRoomTitle = styled.div`
  display: -webkit-box; 
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical; 
  word-wrap:break-word;
  font-size: 18px;
  line-height: 20px;
  height: 20px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const OttRoomContent = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
`;

const OttRoomElement = styled.div`
  border-width: 0 0 1px 0;
  border-style : solid;
  border-color : gray;
  border-radius: 8px;
  margin: 5px;
`

const MyRoomListDiv = styled(OttRoomListDiv)`
`

const MyRoom = styled(OttRoom)`
  background-color: white;
`

const NoRoomListDiv = styled(MyRoomListDiv)`
  display: flex;
  font-size: 24px;
  justify-content: center;
  padding-top : 120px;
`

const StyledDropdown = styled(Dropdown)`
  margin-right: 20px;
  position: relative;
  bottom: 4px;
`

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  background: white;
  color: black;
  border: none;
  width: 100px;

  &:hover,
  &:focus {
    background: white;
    color: black;
    box-shadow: 0 0 0 2px rgba(133, 133, 133, 0.5);
  }

  &.active {
    background: white;
    box-shadow: 0 0 0 2px rgba(133, 133, 133, 0.5);
  }
`

const ClassIcon = styled.img`
  margin-right : 10px;
  position: relative;
  bottom: 4px;
`

const InputContainer = styled.div`
  padding-left: 26px;
  padding-right: 30px;
`
const Input = styled.input`
  padding: 0px 10px;
  font-size: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid gray;
  border-radius: 3px;
  transition: border 0.1s ease-in-out;
  outline: none;
  &:hover,
  &:focus {
    border: 2px solid #6799ff;
  }
`;

const InputLabel = styled.label`
  font-size:20px;
  display: block;
`

const NoticeInput = styled.textarea`
  padding: 10px 10px;
  font-size: 15px;
  box-sizing: border-box;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid gray;
  border-radius: 3px;
  transition: border 0.1s ease-in-out;
  outline: none;
  &:hover,
  &:focus {
    border: 2px solid #6799ff;
  }
  height : 100px;
  width: 100%;
  text-overflow: auto;
`

const InputDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top : 10px;
`

const UnitInput = styled(Input)`
  width: 40%;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none; 
  }
  text-align: right;
`

const InputTitle = styled.div`
  font-size: 24px;
  margin-top: 14px;
  font-weight: 600;
  margin-bottom: 14px;
`

const UnitLabel = styled.label`
  font-size:20px;
  padding-left : 10px;
`

const UnitDiv = styled.div`
  text-align: right;
  padding-right: 10px;
`

const OttListPresenter = ({classChange, titleChange, classificationChange, max_member_numChange, createRoom, enterRoom, translationPlatform, roomList, myRoomList, searchClass}) => {
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
          <STab>
            <StyledDropdown onSelect={classChange}>
              <StyledDropdownToggle variant="success" id="dropdown-basic">
                {searchClass ? translationPlatform(searchClass) : "플랫폼 선택"}
              </StyledDropdownToggle>
              <StyledDropdown.Menu>
                <StyledDropdown.Item eventKey="all"> 전체</StyledDropdown.Item>
                <StyledDropdown.Item eventKey="netflix"> 넷플릭스</StyledDropdown.Item>
                <StyledDropdown.Item eventKey="watcha"> 왓챠</StyledDropdown.Item>
                <StyledDropdown.Item eventKey="tving"> 티빙</StyledDropdown.Item>
                <StyledDropdown.Item eventKey="wave"> 웨이브</StyledDropdown.Item>
                <StyledDropdown.Item eventKey="etc"> 기타</StyledDropdown.Item>
              </StyledDropdown.Menu>
            </StyledDropdown>
            참여할 수 있는 그룹 목록
          </STab>
          <STab2>참여한 그룹 목록</STab2>
        </STabList>

        <STabPanel>
        
          {(roomList.length !== 0) ? 
            <OttRoomListDiv>
              {roomList && roomList.slice(0).reverse().map((room) => ( 
              <OttRoom key={room.group_id}>
                <OttRoomTitle>{room.title}</OttRoomTitle>
                <OttRoomContent>
                  <OttRoomElement><ClassIcon height="20px" src={`./${room.classification}.png`}/> {translationPlatform(room.classification)}</OttRoomElement>
                  <OttRoomElement>{room.current_count} / {room.max_member_num}인</OttRoomElement>
                  <OttRoomElement>{moment(room.created).format('YYYY-MM-DD')}</OttRoomElement>
                  {room.total_money ? <OttRoomElement> {room.total_money} 원</OttRoomElement> : <OttRoomElement>금액 미정</OttRoomElement>}
                </OttRoomContent>
                <StyledButton onClick={enterRoom} value={room.group_id}>ENTER</StyledButton>
              </OttRoom>
              ))} 
            </OttRoomListDiv>: <NoRoomListDiv>
              현재 생성된 그룹이 없습니다.<br/><br/>새로운 그룹을 만들어보세요!
          </NoRoomListDiv>}
          
        </STabPanel>

        <STabPanel>
          {(myRoomList.length !== 0) ? 
            <MyRoomListDiv>
              {myRoomList && myRoomList.slice(0).reverse().map((room) => ( 
                <MyRoom key={room.group_id}>
                  <OttRoomTitle>{room.title}</OttRoomTitle>
                  <OttRoomContent>
                    <OttRoomElement><ClassIcon height="20px" src={`./${room.classification}.png`}/> {translationPlatform(room.classification)}</OttRoomElement>
                    <OttRoomElement>{room.current_count} / {room.max_member_num}인</OttRoomElement>
                    <OttRoomElement>{moment(room.created).format('YYYY-MM-DD')}</OttRoomElement>
                    {room.total_money ? <OttRoomElement> {room.total_money} 원</OttRoomElement> : <OttRoomElement>금액 미정</OttRoomElement>}
                  </OttRoomContent>
                  <StyledButton onClick={enterRoom} value={room.group_id}>ENTER</StyledButton>
                </MyRoom>
                ))}
            </MyRoomListDiv> : <NoRoomListDiv>
              참여한 그룹이 없습니다.<br/><br/>다른 그룹에 참여하거나, 새로운 그룹을 만들어보세요!
          </NoRoomListDiv>}
        </STabPanel>
      </STabs>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body> 
          <InputContainer>
            <InputTitle>그룹 생성</InputTitle>
            <InputLabel>그룹 제목</InputLabel>
            <Input onChange={titleChange}></Input>
            <InputDiv>
              <div>
                <InputLabel>그룹 OTT 플랫폼</InputLabel>
                <OttSelect name="ott" value={optionsState} onChange={classificationChange}>
                  <OttOption value="netflix">넷플릭스</OttOption>
                  <OttOption value="watcha"> 왓챠</OttOption>
                  <OttOption value="tving"> 티빙</OttOption>
                  <OttOption value="wave"> 웨이브</OttOption>
                  <OttOption value="etc"> 기타</OttOption>
                </OttSelect>
              </div>
              <UnitDiv>
                <InputLabel>그룹 최대 인원</InputLabel>
                <UnitInput type="number" pattern="[0-9]*" onChange={max_member_numChange}/><UnitLabel> 명</UnitLabel>
              </UnitDiv>
            </InputDiv>
            <p><br/>그룹을 만든 후, 수정을 통해 더 자세한 내용을 기입할 수 있습니다.</p>
          </InputContainer>
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
      <WriteButton>
        <WriteImage src="./write.png" onClick={handleShow}/>
      </WriteButton>

    </OttPage>
  )
}

export default OttListPresenter;