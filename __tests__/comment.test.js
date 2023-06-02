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