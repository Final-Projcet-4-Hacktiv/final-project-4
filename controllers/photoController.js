const {Photo, User, Comment} = require('../models');

class photoController {
    //get all photos
    static async getAllPhotos(req, res, next) {
        try {
            const photos = await Photo.findAll({include : [User, Comment]});
            //ambil comment berdasarkan user id
            const comments = await Comment.findAll({where : {PhotoId : res.locals.user.id}});
            const mapPhoto = photos.map((photo) => {
                return {
                    id: photo.id,
                    title: photo.title,
                    caption: photo.caption,
                    poster_image_url: photo.poster_image_url,
                    UserId: photo.UserId,
                    createdAt: photo.createdAt,
                    updatedAt: photo.updatedAt,
                    Comment: {
                        comments: comments.map((comment) => {
                            return {
                                id: comment.UserId,
                                comment: comment.comment,
                                }
                            }),
                    
                        User: {
                            username : photo.User.username,
                        }
                    },
                    User: {
                        id: photo.User.id,
                        username: photo.User.username,
                        profile_img_url: photo.User.profile_img_url,
                    }

                }
            })
            res.status(200).json({
                photos: mapPhoto,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
            next(err);
            
        }
    }

    //create photos
    static async createPhoto(req, res) {
        try {
            const UserId = res.locals.user.id;
            const { title, caption, poster_image_url } = req.body;
            let data = {
                UserId,
                title,
                caption,
                poster_image_url,
            };

            const newPhoto = await Photo.create(data, { returning: true });
            if (newPhoto) {
                res.status(201).json({
                    photo: newPhoto,
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }

    //update photos
    static async updatePhoto(req, res) {
        try {
            const id = req.params.id;
            const { title, caption, poster_image_url } = req.body;
            let data = {
                title,
                caption,
                poster_image_url,
            };
            const photo = await Photo.update(data, {
                where: {
                    id,
                },
                returning: true,
            });
            if (photo) {
                res.status(200).json({
                    photo: photo[1][0],
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }

    //delete photos
    static async deletePhoto(req, res) {
        try {
            const id = req.params.id;
            const photo = await Photo.destroy({
                where: {
                    id,
                },
            });
            if (photo) {
                res.status(200).json({
                    message: "Your Photo has been successfully deleted",
                });
            }
        } catch (err) {
            // console.log(err);
            return res.status(401).json(err);
        }
    }
}

module.exports = photoController;