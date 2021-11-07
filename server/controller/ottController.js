const ottModel = require('../model/ottModel')
const statusCode = require('../config/statusCode');

const ottController = {
    getGroupList : async(req, res) => {
        try{
            res.status(statusCode.OK).send({code: statusCode.OK, result: await ottModel.ottGroup.findAll()});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    searchGroupsByClass : async(req, res) => {
        try{
            res.status(statusCode.OK).send({code: statusCode.OK, result : await ottModel.ottGroup.findByClass(req)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    listOfParticipatingGroups : async(req, res, next) => {
        try{
            res.status(statusCode.OK).send({code: statusCode.OK, result : await ottModel.ottGroup.findAllParticipating(req)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    create : async(req, res) => {
        if(req.body.title === undefined) {
            return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '제목을 적어주세요.'});
        } else if(req.body.classification === undefined) {
            return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '플랫폼을 적어주세요.'});
        } else if(req.body.max_member_num === undefined) {
            return res.status(statusCode.CLIENT_ERROR).send({code: statusCode.CLIENT_ERROR, result : '입장 가능한 인원 수를 적어주세요.'});
        }

        try{
            let groupId = await ottModel.ottGroup.save(req);
            await ottModel.ottGroup.saveUserRelationOfAdmin(req, groupId);
            res.status(statusCode.OK).send({code: statusCode.OK, result : await ottModel.ottGroup.findById(groupId)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    participation : async(req, res) => {
        try {
            let alreayParticipation = await ottModel.ottGroup.findByIdAndUserId(req, req.params.groupId);
            if(alreayParticipation.length>0) {
                return res.status(statusCode.OK).send({code: statusCode.OK-1, result : '이미 참여 중 입니다.'});
            }
            let maxMemberNum = await ottModel.ottGroup.findMaxMemberNumById(req);
            let currentMemberNum = await ottModel.ottGroup.findMemberCountById(req);
    
            if(maxMemberNum <= currentMemberNum) {
                return res.status(statusCode.OK).send({code: statusCode.OK-2, result : '자리가 없어 입장할 수 없습니다.'})
            }
    
            await ottModel.ottGroup.saveUserRelationOfGeneralUser(req);
            res.status(statusCode.OK).send({code: statusCode.OK, result : await ottModel.ottGroup.findById(req.params.groupId)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    getGroup : async(req, res) => {
        try{
            let remittanceCheck = await ottModel.ottGroup.findByIdAndUserId(req, req.params.groupId);
            let resultGroup;
            if(remittanceCheck[0].remittance === 1) {
                resultGroup = await ottModel.ottGroup.findById(req.params.groupId);
            } else {
                resultGroup = await ottModel.ottGroup.findByIdNotRemittance(req.params.groupId);
            }

            resultGroup[0].members = await ottModel.ottGroup.findMembersById(req);
            resultGroup[0].ADMIN = await ottModel.ottGroup.findMasterById(req);
            resultGroup[0].comments = await ottModel.ottGroup.findCommentById(req);
            res.status(statusCode.OK).send({code: statusCode.OK, result : resultGroup[0]});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    remittance : async(req, res) => {
        try{
            let remittanceAndAuthority = await ottModel.ottGroup.findByIdAndUserId(req, req.body.groupId);
            if (remittanceAndAuthority.length === 0) {
                return res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result : '이용할 수 없습니다.'}); //그룹에 속해있지 않음.
            } else if(remittanceAndAuthority[0].authority === 'ADMIN') {
                return res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result : '그룹장은 이용할 수 없습니다.'}); //그룹장이 요청
            } else if(remittanceAndAuthority[0].remittance === 1) {
                return res.status(statusCode.OK).send({code: 290, result : '이미 송금 확인이 완료된 상태입니다.'}); //이미 송금요청 완료된 사람이 요청.
            }

            let remittanceCheck = await ottModel.remittanceCheck.findByGroupIdAndUserId(req);
            if(remittanceCheck.length > 0) {
                return res.status(statusCode.OK).send({code: 291, result : '이미 확인 요청을 보냈습니다.'});
            }

            let findAdmin = await ottModel.ottGroup.findAdminByGroupIdAndAuthority(req);
            await ottModel.remittanceCheck.save(req, findAdmin[0].admin);
            res.status(statusCode.OK).send({code: statusCode.OK, result : '송금했다는 요청을 보냈습니다.'});

        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    getRemittanceList : async(req, res) => {
        try{
            res.status(statusCode.OK).send({code:statusCode.OK, result : await ottModel.remittanceCheck.findListOfUsersByGroupId(req)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    remittanceConfirm : async(req, res) => {
        try{
            await ottModel.ottGroup.updateRemittanceById(req);
            await ottModel.remittanceCheck.deleteById(req);
            res.status(statusCode.OK).send({code: statusCode.OK, result : '확인되었습니다.'});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    modify : async(req, res) => {
        try{
            let maxMemberNum = await ottModel.ottGroup.findMaxMemberNumById(req);
            let divMoney = Math.ceil(req.body.money/maxMemberNum);
            if(req.body.money === undefined || maxMemberNum === null) {
                divMoney = null;
            }
            await ottModel.ottGroup.updateAll(req, divMoney);
            res.status(statusCode.OK).send({code: statusCode.OK, result : '수정되었습니다.'})
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    out : async(req, res) => {
        try{
            let currentGroup = await ottModel.ottGroup.findByIdAndUserId(req. req.params.groupId);
            if(currentGroup.length > 0) {
                if(currentGroup[0].authority === 'ADMIN') {
                    await ottModel.ottGroup.deleteById(req);
                    res.status(statusCode.OK).send({code: statusCode.OK, result : '그룹에서 나갔습니다.'})
                } else {
                    await ottModel.ottGroup.deleteUserGroupById(req);
                    await ottModel.remittanceCheck.deleteByGroupIdAndUserId(req);
                    res.status(statusCode.OK).send({code:statusCode.OK, result : '그룹에서 나갔습니다.'})
                }
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    writeComment : async(req, res) => {
        try{
            let id = await ottModel.comment.save(req);
            res.status(statusCode.OK).send({code:statusCode.OK, result: await ottModel.comment.findAllById(id)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    removeComment : async(req, res) => {
        try{
            let comment = await ottModel.comment.findByIdAndCommenter(req);
            if(comment.length > 0){
                await ottModel.comment.deleteById(req);
                res.status(statusCode.OK).send({code: statusCode.OK, result : '삭제되었습니다.'})
            } else {
                res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, result : '내가 작성한 댓글이 아닙니다.'})
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    }
}

module.exports = ottController;