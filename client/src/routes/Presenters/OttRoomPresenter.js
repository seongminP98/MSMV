import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Modal} from "react-bootstrap";
import {Comment} from 'antd';
import moment from "moment";
import store from '../../store';

const OttPage = styled.div`
  min-height: 900px;
  display: grid;
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



const CommentDeleteButton = styled.button`
  color: white;
  background-color: #6B66FF;
  border-color: #6B66FF;
`



const ComLeft = styled.div`
    font-size: 15px;
    text-align: left;
`;
const CommentContent = styled(ComLeft)`
  font-family: '나눔고딕'
`
const CommentDiv = styled.div`
;
`

const NonCommentDiv = styled.div`
  margin: 15px;
  font-family: '나눔고딕'
`

const CommentButton = styled.button`
  font-weight: 600;
  color: white;
  border: 1px solid #6799FF;
  padding: 0.5rem;
  padding-bottom: 0.4rem;
  margin-left:5px;
  cursor: pointer;
  border-radius: 4px;
  text-decoration: none;
  font-size:18px;
  transition: .2s all;
  background:#6B66FF;

  &:hover {
      background-color: white;
      color: #6799FF;
  }
`;

const OttDiv = styled.div`
  width : 75%;
  height : 600px;
  display: grid;
  grid-template-columns: 2fr 4fr 1fr; 
  background : lightgray;
  margin: auto;
`

const MembersDiv = styled.div`
  font-family : "Jua";
  display: block;
  border: 1px solid;
`

const MemberDiv = styled.div`
  background : white;
  font-size: 28px;
  border-radius : 7px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  padding-top: 15px;
  width: 80%;
  height: 20%;
  display: grid;
  grid-templates-rows: 1fr 1fr;
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
`

const MemberUpperDiv = styled.div`

`

const MemberLowerDiv = styled.div`
  font-size: 20px;
  font-weight: 100;
  text-align: right;
`

const Icon = styled.img`
  height: 24px;
  position: relative;
  bottom: 3px;
  margin-left: 5px;

`

const ContentDiv = styled.div`
  white-space: pre-line;
  font-family: "Jua";
`

const MenuDiv = styled(MembersDiv)`
  display: grid;
`

const MenuButton = styled(Link)`
  background: white;
  font-size: 17px;
  width: 120px;
  color: black;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
  margin: auto;
  position: relative;
  bottom: 60px;
  border-radius : 7px;
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

const HalfInput = styled(Input)`
  width: 95%;
`

const UnitInput = styled(Input)`
  width: 30%;
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
`

const UnitLabel = styled.label`
  font-size:20px;
  padding-left : 10px;
`

const UnitDiv = styled.div`
  text-align: right;
  padding-right: 10px;
`

const SelectButton = styled.button`
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
`
const RemittanceDiv = styled.div`
  item-align: center;
  padding: auto;
`

const Remittance = styled.div`
  margin: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: 100;
  font-family: 'Jua', sans-serif;
  
`

const OttRoomPresenter = ( {groupDetail, exitRoom, remittances, detailTitleChange, noticeChange, accountChange, ott_idChange, ott_pwdChange, termChange, start_dateChange, newMoneyChange, commentsChange, patchDetail, checkMemberRemittance, sendRemittanceDone, setMemberRemittance, writeOnClick, deleteOnClick} ) => {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  }
  const handleConfirm = () => {
    patchDetail();
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
      {groupDetail ? 
      <OttDiv>
        <MembersDiv>
          <h2>참여 멤버 ({groupDetail.members.length} / {groupDetail.max_member_num})</h2>
          {groupDetail.members.map((member) => (
            <MemberDiv key={member.user_id}>
              <MemberUpperDiv>
                {member.nickname} 
                {(member.authority === "ADMIN") ? <Icon src="./crown.png" alt="admin"/> : <></>}
                {(member.user_id === store.getState().user.id) ? <Icon src="./avatar.png" alt="avatar"/> : <></>}
              </MemberUpperDiv>
              <MemberLowerDiv>
                
                {(member.authority === "ADMIN") ? <div> 계정주 </div> : <div>
                  {(member.remittance === 1) ?  "계정 공유중" : <></>} </div>}
              </MemberLowerDiv>
            </MemberDiv>
          ))}
        </MembersDiv>

        <ContentDiv>
          <h2>{groupDetail.title}</h2>
          <div>
            그룹장 : {groupDetail.ADMIN[0].nickname}<br/>
            그룹 생성일 : {moment(groupDetail.created).format('YYYY년 MM월 DD일')} <br/>
            OTT 플랫폼 : {groupDetail.classification} <br/>
            <br/>공지사항 <br/> {groupDetail.notice} <br/>
            <br/>
            예상 공유 시작일 : {moment(groupDetail.start_date).format('YYYY년 MM월 DD일')} <br/>
            기간 : {groupDetail.term}일 <br/>
            예상 공유 종료일 : {moment(groupDetail.end_date).format('YYYY년 MM월 DD일')} <br/>
            <br/>
            송금 계좌 : {groupDetail.account} <br/>
            총 결제 금액 : {groupDetail.total_money}원 <br/>
            멤버별 결제 금액 : {groupDetail.div_money}원 <br/>
            <br/>
            <h3>계정 공유란</h3>
              {Object.keys(groupDetail).includes('ott_id') ? <div>
                공유 ID : {groupDetail.ott_id} <br/>
                공유 PW : {groupDetail.ott_pwd}
              </div> : <div>
                아직 계정이 공유되지 않습니다.
              </div>}
          </div>
        </ContentDiv>
        
        
        <MenuDiv>
          <h2>메뉴</h2>
          {(store.getState().user.id === groupDetail.ADMIN[0].user_id) ? <>
          <MenuButton onClick={handleShow}>수정하기</MenuButton>
          <MenuButton onClick={remittanceShow}>송금 요청 확인</MenuButton>
          </> : <>
          <MenuButton onClick={sendRemittanceDone}>송금 요청 전송</MenuButton>
          <MenuButton>계정 확인</MenuButton>
          </>}
            
          <MenuButton to="/Ott">돌아가기</MenuButton>
          <MenuButton onClick={exitRoom}>퇴장</MenuButton>
        </MenuDiv>
    </OttDiv> : <div> No GroupDetail available.</div>}

    <CommentDiv>
      {groupDetail && groupDetail.comments.length > 0 ? (
        <>
          {groupDetail.comments.map((comment) => ( 
            <Comment 
              key={comment.id}
              actions={[
                <div>
                  {store.getState().user.id === comment.commenter ? (
                      <CommentDeleteButton type="button" id={comment.id} onClick={deleteOnClick} >댓글 삭제</CommentDeleteButton>
                      ) : (<p></p>)
                  }
                </div>
              ]}
              content={
                <CommentContent>
                  <div>        
                    <b>{comment.nickname}</b> &nbsp;{moment(comment.created).format("YYYY-MM-DD")} 작성<br/>
                  </div>
                  <div> 
                    {comment.contents}
                  </div>
                </CommentContent>
              }>
              <hr/>
            </Comment>
          ))}
        </>):(
          <NonCommentDiv>댓글이 없습니다.</NonCommentDiv>
        )}
      </CommentDiv>
      
      {store.getState().user ? (
        <form style={{ display: 'flex' }}>
          <textarea style={{ width: '80%', borderRadius: '2px' }}
            onChange={commentsChange} placeholder="댓글을 입력해주세요">
          </textarea>
          <CommentButton style={{ width: '20%', height: '52px' }} onClick={writeOnClick}>작성</CommentButton>
        </form>
        ):(<div>댓글을 작성하려면 로그인하세요.</div>)} 

      <Modal show={show} onHide={handleClose}>
        <Modal.Body> 
          {groupDetail ? (
            <InputContainer>
              <InputTitle>그룹 내용 수정</InputTitle>
              <InputLabel>제목</InputLabel>
              <Input required={true} type="text" defaultValue={groupDetail.title} onChange={detailTitleChange} minLength={2}/>
              <InputLabel>공지사항</InputLabel>
              <NoticeInput placeholder="그룹의 멤버들에게 공지할 사항을 입력해주세요." defaultValue={groupDetail.notice} onChange={noticeChange}/>
              <hr/>
              <InputTitle>계좌 및 금액 정보</InputTitle>
              <InputDiv>
                <div>
                  <InputLabel>계좌 정보</InputLabel>
                  <HalfInput required={true} type="text" placeholder="계좌 정보를 입력하세요." defaultValue={groupDetail.account} onChange={accountChange}/>
                </div>
                <UnitDiv>
                  <InputLabel>총 결제 금액</InputLabel>
                  <UnitInput required={true} type="number" placeholder="원" defaultValue={groupDetail.total_money} onChange={newMoneyChange}/> <UnitLabel>원</UnitLabel>
                </UnitDiv>
              </InputDiv>
              <hr/>
              
              <InputDiv>
                <InputTitle>기간 정보</InputTitle>
                <div>{/*empty for grid*/}</div>
                <div>{/*empty for grid*/}</div>
                <div>
                  <InputLabel>예상 서비스 이용 기간</InputLabel>
                </div>
                <div></div>
                <UnitDiv>
                  <UnitInput required={true} type="number" placeholder="기간" defaultValue={groupDetail.term} onChange={termChange}/> <UnitLabel>일</UnitLabel>
                </UnitDiv>
                <div>
                  <InputLabel>예상 서비스 시작일</InputLabel>
                  <HalfInput required={true} type="date" defaultValue={moment(groupDetail.start_date).format('YYYY-MM-DD')} onChange={start_dateChange}/>
                </div>
                <div>
                  <InputLabel>예상 서비스 종료일</InputLabel>
                  <HalfInput type="date" defaultValue={moment(groupDetail.end_date).format('YYYY-MM-DD')} disabled/>
                </div>
              </InputDiv>
              <hr/>
              <InputTitle>공유 계정 정보</InputTitle>
              <InputDiv>
                <div>
                  <InputLabel>공유 ID</InputLabel>
                  <HalfInput type="text" placeholder="ott_id" defaultValue={groupDetail.ott_id} onChange={ott_idChange}/>
                </div>
                <div>
                  <InputLabel>공유 비밀번호</InputLabel>
                  <HalfInput type="text" placeholder="ott_pwd" defaultValue={groupDetail.ott_pwd} onChange={ott_pwdChange}/>
                </div>
                
                
              </InputDiv>
            </InputContainer>
          ) : (<></>)}
          
        </Modal.Body>
        <Modal.Footer>
          <SelectButton variant="secondary" onClick={handleClose}>
            닫기
          </SelectButton>
          <SelectButton variant="primary" onClick={handleConfirm}>
            수정
          </SelectButton>
        </Modal.Footer>
      </Modal>

      <Modal show={remittanceModalShow} onHide={remittanceClose}>
        <Modal.Header closeButton>
          <Modal.Title>요청 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <RemittanceDiv>
            {remittances && remittances.length ? (remittances.map((remittance) => ( 
            <Remittance key={remittance.remittanceCheck_id}>
              {remittance.nickname} 님이 송금 확인을 요청하였습니다!&nbsp;&nbsp;
              <SelectButton onClick={setMemberRemittance} value={remittance.user_id} name={remittance.remittanceCheck_id}>확인</SelectButton>
            </Remittance>) 
            )): <Remittance>송금 확인 요청이 없습니다.</Remittance>}
          </RemittanceDiv>
        </Modal.Body>
      </Modal>

      

    </OttPage>
  )
}

export default OttRoomPresenter;