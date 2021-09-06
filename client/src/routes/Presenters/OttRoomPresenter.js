import React, {useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {Modal} from "react-bootstrap";
import {Comment, Tooltip} from 'antd';
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

const TitleDiv = styled.h2`
  margin: auto;
  margin-top: 20px;
  margin-bottom: 10px;
`

const ContentTitle = styled(TitleDiv)`
  font-size : 36px;
  border-bottom: 1px solid gray;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 5px;
  overflow: visible;
`

const OttDiv = styled.div`
  width : 1150px;
  height : 600px;
  display: grid;
  grid-template-columns: 2fr 4fr 1fr; 
  margin: auto;
`

const MembersDiv = styled.div`
  font-family : "Jua";
  display: block;
  border-style: solid;
  border-width : 0 0 3px 0;
  border-radius : 14px 14px;
  border-color: #595959;
  background: #6b66ff;

`

const MemberDiv = styled.div`
  background : white;
  font-size: 28px;
  text-align: left;

  width: 80%;
  height: 20%;

  display: grid;
  grid-templates-rows: 1fr 1fr;

  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;

  padding-bottom: 10px;
  padding-top: 15px;
  padding-left: 20px;
  padding-right: 20px;

  border-style: solid;
  border-width : 1px 0px 3px 0;
  border-radius : 7px;
  border-color: #595959;
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

const ClassIcon = styled.img`
  margin-right : 10px;
  position: relative;
  bottom: 4px;
`

const ContentDiv = styled.div`
  white-space: pre-line;
  font-family: "Jua";
  border-style: solid;
  border-width : 1px 0px 3px 0;
  border-radius : 14px 14px;
  border-color: #595959;
  margin-right: 10px;
  margin-left: 10px;
`

const ContentLine1 = styled.div`
  font-size: 20px;
  display: grid;
  grid-template-columns : 1fr 1fr;
`;

const ContentElement1 = styled.div`
  margin-top: 5px;
  margin-left: 13px;
  margin-right: 13px;

  border-width: 0 0 1px 0;
  border-style : solid;
  border-color : gray;
  border-radius: 8px;
`

const ContentLine2 = styled.div`
  margin-top: 10px;
  font-size: 25px;
`;

const ContentElement2 = styled.div`
  font-size: 14px;
  font-family: 맑은고딕;
  
  min-height: 60px;

  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;

  margin: auto;
  margin-left: 13px;
  margin-right: 13px;

  border-width: 0 0 1px 0;
  border-style : solid;
  border-color : gray;
  border-radius: 8px;

  text-align: center;  
`


const ContentLine3 = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns : 1fr 1fr;
`;

const ContentElement3 = styled(ContentElement1)`
  border-width: 0 0 1px 0;
  border-style : solid;
  border-color : gray;
  border-radius: 8px;
  font-size: 16px;
  text-align: left;
  padding-left : 25px;
  padding-bottom: 10px;
`

const ContentTitle3 = styled.div`
  text-align: center;
  font-size: 25px;
  position: relative;
  right: 20px;
`

const ContentLine4 = styled.div`
  margin-top: 20px;
  font-size: 25px;
`;

const ContentElement4 = styled.div`
  font-size: 18px;
  text-align: left;
  padding-left: 235px;
`

const ContentElement4_2 = styled.div`
  font-size: 18px;
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

  border-style: solid;
  border-width : 1px 0px 3px 0;
  border-radius : 7px;
  border-color: #595959;
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

const OttRoomPresenter = ( {groupDetail, exitRoom, translationPlatform, remittances, detailTitleChange, noticeChange, accountChange, ott_idChange, ott_pwdChange, termChange, start_dateChange, newMoneyChange, commentsChange, patchDetail, checkMemberRemittance, sendRemittanceDone, setMemberRemittance, writeOnClick, deleteOnClick} ) => {
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
          <TitleDiv>참여 멤버 ({groupDetail.members.length} / {groupDetail.max_member_num})</TitleDiv>
          {groupDetail.members.map((member) => (
            <MemberDiv key={member.user_id}>
              <MemberUpperDiv>
                {member.nickname} 
                {(member.authority === "ADMIN") ? <Tooltip title="그룹장"><Icon src="./crown.png" alt="admin"/></Tooltip> : <></>}
                {(member.user_id === store.getState().user.id) ? <Tooltip title="본인"><Icon src="./avatar.png" alt="avatar"/></Tooltip> : <></>}
              </MemberUpperDiv>
              <MemberLowerDiv>
                
                {(member.authority === "ADMIN") ? <div> 계정주 </div> : <div>
                  {(member.remittance === 1) ?  "계정 공유중" : <></>} </div>}
              </MemberLowerDiv>
            </MemberDiv>
          ))}
        </MembersDiv>

        <ContentDiv>
          <ContentTitle>{groupDetail.title}</ContentTitle>
          <div>
            <ContentLine1>
              <ContentElement1>
                <ClassIcon height="30px" src={`./${groupDetail.classification}.png`}/>{translationPlatform(groupDetail.classification)}
              </ContentElement1>
              <ContentElement1>{moment(groupDetail.created).format('YYYY년 MM월 DD일')} 생성</ContentElement1>
            </ContentLine1>
            
            <ContentLine2>
              공지사항
              <ContentElement2>
                {groupDetail.notice ? <>{groupDetail.notice}</> : <>공지사항이 없습니다.</>}
              </ContentElement2>
            </ContentLine2>
            
            <ContentLine3>
              <ContentElement3>
                <ContentTitle3>기간 정보</ContentTitle3>
                {groupDetail.start_date ? <>
                  예상 공유 시작일 : {moment(groupDetail.start_date).format('YYYY년 MM월 DD일')} <br/>
                  기간 : {groupDetail.term}일 <br/>
                  예상 공유 종료일 : {moment(groupDetail.end_date).format('YYYY년 MM월 DD일')} <br/>
                </> : <>
                  기간 정보가 없습니다.
                </>}
                
              </ContentElement3>
              <ContentElement3>
                <ContentTitle3>계좌 정보</ContentTitle3>
                {groupDetail.account ? <>
                  송금 계좌 : {groupDetail.account} <br/>
                 총 결제 금액 : {groupDetail.total_money}원 <br/>
                  멤버별 결제 금액 : {groupDetail.div_money}원 <br/>
                </> : <>
                  계좌 정보가 없습니다.
                </>}
              </ContentElement3>
            </ContentLine3>
          
            <ContentLine4>
            <h3>계정 공유란</h3>
              {Object.keys(groupDetail).includes('ott_id') ? <ContentElement4>
                {groupDetail.ott_id ? <>
                  공유 ID : {groupDetail.ott_id} <br/>
                  공유 PW : {groupDetail.ott_pwd}
                </> : <>
                  계정 정보가 없습니다.
                </>}
              </ContentElement4> : <ContentElement4_2>
                아직 계정이 공유되지 않습니다. 그룹장의 송금 확인이 필요합니다.
              </ContentElement4_2>}
            </ContentLine4>
            
          </div>
        </ContentDiv>
        
        
        <MenuDiv>
          <TitleDiv>메뉴</TitleDiv>
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
                  <UnitInput required={true} type="number" defaultValue={groupDetail.total_money} onChange={newMoneyChange}/> <UnitLabel>원</UnitLabel>
                </UnitDiv>
              </InputDiv>
              <hr/>
              
              <InputTitle>기간 정보</InputTitle>
              <InputDiv>
                <div>
                  <InputLabel>예상 서비스 시작일</InputLabel>
                  <HalfInput required={true} type="date" defaultValue={moment(groupDetail.start_date).format('YYYY-MM-DD')} onChange={start_dateChange}/>
                </div>
                <div>
                <InputLabel>예상 서비스 이용 기간</InputLabel>
                  <UnitDiv>
                    <UnitInput required={true} type="number" defaultValue={groupDetail.term} onChange={termChange}/> <UnitLabel>일</UnitLabel>
                  </UnitDiv>
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