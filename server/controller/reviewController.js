const statusCode = require('../config/statusCode');
const reviewModel = require('../model/reviewModel');

const reviewController = {
    write : async(req, res) => {
        try{
            await reviewModel.review.save(req);
            res.status(statusCode.OK).send({code: statusCode.OK, result: await reviewModel.review.findByMovieCd(req)});
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    modify : async(req, res) => {
        try{
            let thisReview = await reviewModel.review.findById(req.body.id);
            if(req.body.user_id === thisReview[0].commenter) {
                await reviewModel.review.update(req);
                res.status(statusCode.OK).send({code: statusCode.OK, result: '리뷰가 수정되었습니다.'});
            } else {
                res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, message: '내가 쓴 리뷰가 아닙니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    },

    delete : async(req, res) => {
        try{
            let thisReview = await reviewModel.review.findById(req.params.id);
            if(Number(req.user.id)===thisReview[0].commenter){
                await reviewModel.review.delete(req);
                res.status(statusCode.OK).send({code: statusCode.OK, result: '리뷰가 삭제되었습니다.'});
            } else {
                res.status(statusCode.Forbidden).send({code: statusCode.Forbidden, message: '내가 쓴 리뷰가 아닙니다.'});
            }
        } catch (err) {
            res.status(statusCode.SERVER_ERROR).send({code: statusCode.SERVER_ERROR});
        }
    }
}

module.exports = reviewController;