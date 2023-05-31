const request = require('supertest');
const app = require('../app');
const { User} = require('../models');
const { Photo } = require('../models');
const { Comment } = require('../models');

const login = {
    email: 'admin@mail.com',
    password: '123456',
}

const photo = {
    title: 'test',
    caption: 'test',
    poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
    UserId: 1
}

const comment = {
    comment: 'test',
    PhotoId: 1
}

const createUser = async () => {
    const result = await User.create({
        id : 1,
        full_name: 'admin',
        email: 'admin@mail.com',
        password: '123456',
        username: 'admin',
        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        age: 20,
        phone_number: '62873647'
    })
}

const createComment = async () => {
    const result = await Comment.create({
        id : 1,
        comment: 'test',
        PhotoId: 1,
        UserId: 1
    })
}

const createPhoto = async () => {
    const result = await Photo.create({
        id : 1,
        title: 'test',
        caption: 'test',
        poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        UserId: 1
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
        console.log(access_token);
        const res = await request(app)
            .post('/comments')
            .set('token', access_token)
            .send(comment)
        expect(res.statusCode).toEqual(201)
        expect(typeof res.body).toEqual('object')
        expect(res.body.comment).toHaveProperty('id')
        expect(res.body.comment).toHaveProperty('comment')
        expect(res.body.comment).toHaveProperty('PhotoId')
        expect(res.body.comment).toHaveProperty('UserId')
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .post('/comments')
            .send(comment)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
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
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const response = await request(app)
            .post('/users/login')
            .send(login)
        const { access_token } = response.body
        console.log(access_token);
        await request(app)
            .post('/comments')
            .set('token', access_token)
            .send(comment)
        const res = await request(app)
            .get('/comments')
            .set('token', access_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body.comments[0]).toHaveProperty('id')
        expect(res.body.comments[0]).toHaveProperty('comment')
        expect(res.body.comments[0]).toHaveProperty('PhotoId')
        expect(res.body.comments[0]).toHaveProperty('UserId')
        expect(typeof res.body).toEqual('object')
    })
    //error response
    it('should send response with 400 status code', async () => {
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

//edit comment
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
            await createPhoto()
            await createComment()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const response = await request(app)
            .post('/users/login')
            .send(login)
        const { access_token } = response.body
        console.log(access_token);
        const res = await request(app)
            .put('/comments/1')
            .set('token', access_token)
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(201)
        expect(typeof res.body).toEqual('object')
        expect(res.body.comment[0]).toHaveProperty('id')
        expect(res.body.comment[0]).toHaveProperty('comment')
        expect(res.body.comment[0]).toHaveProperty('PhotoId')
        expect(res.body.comment[0]).toHaveProperty('UserId')
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .put('/comments/1')
            .send({comment: 'test'})
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
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
            await createPhoto()
            await createComment()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const response = await request(app)
            .post('/users/login')
            .send(login)
        const { access_token } = response.body
        console.log(access_token);
        const res = await request(app)
            .delete('/comments/1')
            .set('token', access_token)
        expect(res.statusCode).toEqual(200)
        expect(typeof res.body).toEqual('object')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('status', 'success')
        expect(res.body).toHaveProperty('message', 'Your Comment has been successfully deleted')
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .delete('/comments/1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
    })
})