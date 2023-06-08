const request = require('supertest');
const app = require('../app');
const { User} = require('../models');
const { Photo } = require('../models');
const { Comment } = require('../models');

let auth_token

const login = {
    email: 'user1@mail.com',
    password: '123456',
}

const comment = {
    comment: 'test',
    PhotoId: 1
}

const createUser = async () => {
    const result = await User.create({
        id : 1,
        full_name: 'user1',
        email: 'user1@mail.com',
        password: '123456',
        username: 'user1',
        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        age: 20,
        phone_number: '62873647'
    })
    return result
}

const createUser2 = async () => {
    const result = await User.create({
        id : 2,
        full_name: 'user2',
        email: 'user2@mail.com',
        password: '123456',
        username: 'user2',
        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        age: 20,
        phone_number: '62873647'
    })
    return result
}

const createComment = async () => {
    const result = await Comment.create({
        id : 1,
        comment: 'test',
        PhotoId: 1,
        UserId: 1
    })
    return result
}

const createComment2 = async () => {
    const result = await Comment.create(    {
        id : 2,
        comment: 'test',
        PhotoId: 1,
        UserId: 2
    })
    return result
}

const createPhoto = async () => {
    const result = await Photo.create({
        id : 1,
        title: 'test',
        caption: 'test',
        poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        UserId: 1
    },
    {
        id : 2,
        title: 'test',
        caption: 'test',
        poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        UserId: 2
    })
}


//post comment
describe('POST /comments', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
            await createPhoto()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 201 status code', async () => {
        const response = await request(app)
            .post('/users/login')
            .send(login)
        const { access_token } = response.body
        auth_token = access_token
        console.log(auth_token);
        const res = await request(app)
            .post('/comments')
            .set('token', auth_token)
            .send(comment)
        expect(res.statusCode).toEqual(201)
        expect(typeof res.body).toEqual('object')
        expect(res.body.comment).toHaveProperty('id')
        expect(res.body.comment).toHaveProperty('comment')
        expect(res.body.comment).toHaveProperty('PhotoId')
        expect(res.body.comment).toHaveProperty('UserId')
    })
    //error response (not token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .post('/comments')
            .send(comment)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('comment')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
    //error response (photoId not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .post('/comments')
            .set('token', auth_token)
            .send({
                comment: 'test',
                PhotoId: 100
            })
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message', 'Photo not found')
        expect(res.body).toHaveProperty('status', 'failed')
        expect(res.body).not.toHaveProperty('comment')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
})

//get comment
describe('GET /comments', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
            await createPhoto()
            await createComment()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const res = await request(app)
            .get('/comments')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body.comments[0]).toHaveProperty('id')
        expect(res.body.comments[0]).toHaveProperty('comment')
        expect(res.body.comments[0]).toHaveProperty('PhotoId')
        expect(res.body.comments[0]).toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
    //error response
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .get('/comments')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('comments')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
})

describe('PUT /comments/:id', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
            await createUser2()
            await createPhoto()
            await createComment()
            await createComment2()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const res = await request(app)
            .put('/comments/1')
            .set('token', auth_token)
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(201)
        expect(typeof res.body).toEqual('object')
        expect(res.body.comment).toHaveProperty('id')
        expect(res.body.comment).toHaveProperty('comment')
        expect(res.body.comment).toHaveProperty('PhotoId')
        expect(res.body.comment).toHaveProperty('UserId')
    })
    //error response (no token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/comments/1')
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('comment')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })

    //error response (not authorized)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/comments/2')
            .set('token', auth_token)
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'User not authorized')
        expect(res.body).toHaveProperty("devMessage", "User with id 1 not authorized to id 2")
        expect(res.body).not.toHaveProperty('comment')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')

    })
    //error response (comment not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .put('/comments/100')
            .set('token', auth_token)
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message', 'Comment not found')
        expect(res.body).toHaveProperty("devMessage", "Comment with id 100 not found")
        expect(res.body).not.toHaveProperty('comment')
        expect(res.body).not.toHaveProperty('id')
        expect(res.body).not.toHaveProperty('PhotoId')
        expect(res.body).not.toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
})

//delete comment
describe('DELETE /comments/:id', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
            await Comment.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
            await createUser2()
            await createPhoto()
            await createComment()
            await createComment2()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const res = await request(app)
            .delete('/comments/1')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('status', 'success')
        expect(res.body).toHaveProperty('message', 'Your Comment has been successfully deleted')
    })
    //error response (no token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .delete('/comments/1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
    })

    //error response (not authorized)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .delete('/comments/2')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'User not authorized')
        expect(res.body).toHaveProperty("devMessage", "User with id 1 not authorized to id 2")
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('status', 'success')
        expect(res.body).not.toHaveProperty('message', 'Your Comment has been successfully deleted')
    })
    //error response (comment not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .delete('/comments/100')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message', 'Comment not found')
        expect(res.body).toHaveProperty("devMessage", "Comment with id 100 not found")
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('status', 'success')
        expect(res.body).not.toHaveProperty('message', 'Your Comment has been successfully deleted')
    })
})