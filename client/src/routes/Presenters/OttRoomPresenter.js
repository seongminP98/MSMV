import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Modal} from "react-bootstrap";
import moment from "moment";
import store from '../../store';

const OttPage = styled.div`
  min-height: 900px;
  ;
`

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

const StyledButton = styled.button`
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

const OttRoomPresenter = ( {groupDetail, remittances, detailTitleChange, noticeChange, accountChange, ott_idChange, ott_pwdChange, termChange, start_dateChange, newMoneyChange, patchDetail, checkMemberRemittance, sendRemittanceDone, setMemberRemittance} ) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }
  const handleConfirm = () => {
    patchDetail();
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
  }

  const [remittanceModalShow, setRemittanceModalShow] = useState(false);
  const remittanceClose = () => {
    setRemittanceModalShow(false);
  }

  const remittanceShow = () => {
    setRemittanceModalShow(true);
    checkMemberRemittance();
  }

  return (
    <OttPage>
      {groupDetail ? <div>
        ADMIN : {groupDetail.ADMIN[0].nickname}({groupDetail.ADMIN[0].user_id})<br/><br/>
        group id : {groupDetail.id} //not shown <br/>
        title : {groupDetail.title} <br/>
        created : {moment(groupDetail.created).format('YYYY-MM-DD')} <br/>
        notice : {groupDetail.notice} <br/>
        classification : {groupDetail.classification} <br/>
        <br/>
        current member num : {groupDetail.members.length} <br/> {/*as member count*/}
        max member num : {groupDetail.max_member_num} <br/>
        <br/>
        start_date : {moment(groupDetail.start_date).format('YYYY-MM-DD')} <br/>
        term : {groupDetail.term} <br/>
        end_date : {moment(groupDetail.end_date).format('YYYY-MM-DD')} <br/>
        account : {groupDetail.account} <br/>
        total_money : {groupDetail.total_money} <br/>
        div_money : {groupDetail.div_money} <br/>
        
        {Object.keys(groupDetail).includes('ott_id') ? "Classified" : "Not-Classified"}
        <hr/>
        <div>
          {groupDetail.members.map((member) => (
            <div key={member.user_id}>
              nickname : {member.nickname} <br/>
              user_id : {member.user_id} <br/>
              authority : {member.authority} <br/>
              remittance: {member.remittance} <br/>
              {(store.getState().user.id === member.user_id) ? <div>its me! <br/>
              </div> : <div>not me.
                
                {(store.getState().user.id === groupDetail.ADMIN[0].user_id) ? <div>
                  "I'm admin!"<br/>
                </div>: <div>
                  "I'm no Admin."<br/>
                </div>}</div>}
              <hr/>
            </div>
          ))}

        </div>
        {(store.getState().user.id === groupDetail.ADMIN[0].user_id) ? <>
        <StyledButton onClick={handleShow}>수정하기</StyledButton>
        <StyledButton onClick={remittanceShow}>송금 요청 확인</StyledButton>
        </> : <>
        <StyledButton onClick={sendRemittanceDone}>요청 전송</StyledButton></>}
          
        <StyledLink to="/Ott">돌아가기</StyledLink>
        
      </div> : <div> No GroupDetail available.</div>}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>내용 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <h2>수정 내용 입력</h2>
          <Input placeholder="title" onChange={detailTitleChange}></Input>
          <Input placeholder="notice" onChange={noticeChange}></Input>
          <Input placeholder="account" onChange={accountChange}></Input>
          <Input placeholder="money" onChange={newMoneyChange}></Input>
          <Input placeholder="start_date" onChange={start_dateChange}></Input>
          <Input placeholder="term" onChange={termChange}></Input>
          <Input placeholder="ott_id" onChange={ott_idChange}></Input>
          <Input placeholder="ott_pwd" onChange={ott_pwdChange}></Input>
        </Modal.Body>
        <Modal.Footer>
          <StyledButton variant="secondary" onClick={handleClose}>
            취소
          </StyledButton>
          <StyledButton variant="primary" onClick={handleConfirm}>
            완료
          </StyledButton>
        </Modal.Footer>
      </Modal>

      <Modal show={remittanceModalShow} onHide={remittanceClose}>
        <Modal.Header closeButton>
          <Modal.Title>요청 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          {remittances && remittances.length ? (remittances.map((remittance) => ( 
          <div key={remittance.remittanceCheck_id}>
            <p>{remittance.remittanceCheck_id}</p>
              <p>{remittance.user_id}</p>
              <p>{remittance.nickname}</p>
              <p>{remittance.group_id}</p>
              <StyledButton onClick={setMemberRemittance} value={remittance.user_id} name={remittance.remittanceCheck_id}>요청 확인</StyledButton>
          </div>) 
          )): <div>리미턴스 요청 없음</div>}
        </Modal.Body>
      </Modal>

    </OttPage>
  )
}

export default OttRoomPresenter;