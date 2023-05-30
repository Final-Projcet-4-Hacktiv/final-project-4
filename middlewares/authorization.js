const {User, Photo, SocialMedia, Comment} = require("../models");


//user authorization
function userAuthorization(req, res, next) {
    const id = req.params.id
    User.findOne({
        where: {
            id: id
        }
    })
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: 'User not found',
                devMessage: `User with id ${id} not found`
            })
        }
        if(data.id !== res.locals.user.id){
            return res.status(401).json({
                message: 'User not authorized',
                devMessage: `User with id ${res.locals.user.id} not authorized to id ${id}`
            })
        }
        return next();
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Internal Server Error',
            devMessage: err
        })
    })
}

function photoAuthorization(req, res, next) {
    const id = req.params.id
    Photo.findOne({
        where: {
            id: id
        }
    })
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: 'Photo not found',
                devMessage: `Photo with id ${id} not found`
            })
        }
        if(data.UserId !== res.locals.user.id){
            return res.status(401).json({
                message: 'User not authorized',
                devMessage: `User with id ${res.locals.user.id} not authorized to id ${id}`
            })
        }
        return next();
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Internal Server Error',
            devMessage: err
        })
    })
}


function socialmediaAuthorization (req, res, next) {
    const id = req.params.id
    SocialMedia.findOne({
        where: {
            id: id
        }
    })
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: 'Social Media not found',
                devMessage: `Social Media with id ${id} not found`
            })
        }
        if(data.UserId !== res.locals.user.id){
            return res.status(401).json({
                message: 'User not authorized',
                devMessage: `User with id ${res.locals.user.id} not authorized to id ${id}`
            })
        }
        return next();
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Internal Server Error',
            devMessage: err
        })
    })
}

function commentAuthorization (req, res, next) {
    const id = req.params.id
    Comment.findOne({
        where: {
            id: id
        }
    })
    .then(data => {
        if(!data){
            return res.status(404).json({
                message: 'Comment not found',
                devMessage: `Comment with id ${id} not found`
            })
        }
        if(data.UserId !== res.locals.user.id){
            return res.status(401).json({
                message: 'User not authorized',
                devMessage: `User with id ${res.locals.user.id} not authorized to id ${id}`
            })
        }
        return next();
    })
    .catch(err => {
        return res.status(500).json({
            message: 'Internal Server Error',
            devMessage: err
        })
    })
}


module.exports = {
    userAuthorization,
    photoAuthorization,
    socialmediaAuthorization,
    commentAuthorization
}