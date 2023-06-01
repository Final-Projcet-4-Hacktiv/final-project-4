const {User, Photo, Comment} = require('../models')

class commentController {
    //get all comments include user and photo
    static async getAllComments(req, res, next) {
        try {
            const comments = await Comment.findAll({include : [User, Photo]});
            const mapComment = comments.map((comment) => {
                return {
                    id: comment.id,
                    comment: comment.comment,
                    UserId: comment.UserId,
                    PhotoId: comment.PhotoId,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    Photo: {
                        id: comment.Photo.id,
                        title: comment.Photo.title,
                        caption: comment.Photo.caption,
                        poster_image_url: comment.Photo.poster_image_url,
                        UserId: comment.Photo.UserId,
                        createdAt: comment.Photo.createdAt,
                        updatedAt: comment.Photo.updatedAt,
                    },
                    User: {
                        id: comment.User.id,
                        username: comment.User.username,
                        profile_img_url: comment.User.profile_img_url,
                    }
                   
                }
            })
            res.status(200).json({
                comments: mapComment,
            });
        } catch (err) {
            // console.log(err);
            next(err);
        }
    }

    //create comments
    static async createComment(req, res) {
        try {
            const { comment, PhotoId } = req.body;
            let data = {
                comment,
                PhotoId,
            };
            //jika photoId tidak ada dalam database
            const photo = await Photo.findOne({ where: { id: PhotoId } });
            if (!photo) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'Photo not found',
                });
            }
            
            const newComment = await Comment.create(data, { returning: true });
            if (newComment) {
                res.status(201).json({
                    comment: newComment,
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }

    //update comments
    static async updateComment(req, res) {
        try {
            const { comment, PhotoId } = req.body;
            const id = req.params.id;
            let data = {
                comment,
            };

            const updateComment = await Comment.update(data, { where: { id }, returning: true });
            if (updateComment) {
                res.status(201).json({
                    comment: updateComment[1],
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }

    //delete comments
    static async deleteComment(req, res) {
        try {
            const id = req.params.id;
            const deleteComment = await Comment.destroy({ where: { id } });
            if (deleteComment) {
                res.status(200).json({
                    status : 'success',
                    message: 'Your Comment has been successfully deleted',
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }
}

module.exports = commentController