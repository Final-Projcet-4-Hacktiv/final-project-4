const request = require('supertest')
const app = require('../app')
const { User} = require('../models');
const { SocialMedia } = require('../models');

const login = {
    email: 'admin@mail.com',
    password: '123456',
}

const socialmedia = {
    name: 'facebook',
    social_media_url: 'www.facebook.com',
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

const createSocialMedia = async () => {
    const result = await SocialMedia.create({
        id : 1,
        name: 'facebook',
        social_media_url: 'www.facebook.com',
        UserId: 1
    })
}

//post socialmedia
describe('POST /socialmedias', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SocialMedia.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
        }catch{
            console.log(error);
        }
    })

    //success response
    it('should send response with 201 status code', async () => {
        const response = await request(app)
            .post('/users/login')
            .send(login)
        const { body: { access_token } } = response
        console.log(access_token);
        const res = await request(app)
            .post('/socialmedias')
            .set('token', access_token)
            .send(socialmedia)
        expect(res.statusCode).toEqual(201)
        expect(res.body.social_media).toHaveProperty('id', expect.any(Number))
        expect(res.body.social_media).toHaveProperty('UserId', expect.any(Number))
        expect(res.body.social_media).toHaveProperty('name', socialmedia.name)
        expect(res.body.social_media).toHaveProperty('social_media_url', socialmedia.social_media_url)
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .post('/socialmedias')
            .send(socialmedia)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
    })
})

//get socialmedia
describe('GET /socialmedias', () => {
    beforeAll(async () => {
        try{
            await createUser()
            // await createSocialMedia()
        }catch{
            console.log(error);
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SocialMedia.destroy({ where: {} })
        } catch (error) {
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
            .post('/socialmedias')
            .set('token', access_token)
            .send(socialmedia)
        const res = await request(app)
            .get('/socialmedias')
            .set('token', access_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body.social_medias[0]).toHaveProperty('id', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('UserId', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('name', socialmedia.name)
        expect(res.body.social_medias[0]).toHaveProperty('social_media_url', socialmedia.social_media_url)
        expect(res.body.social_medias[0]).toHaveProperty('User')

    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .get('/socialmedias')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
        expect(res.body).not.toHaveProperty('User')
    })
})

//edit socialmedia
describe('PUT /socialmedias/:id', () => {
    beforeAll(async () => {
        try{
            await createUser()
            await createSocialMedia()
        }catch{
            console.log(error);
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SocialMedia.destroy({ where: {} })
        } catch (error) {
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
            .put('/socialmedias/1')
            .set('token', access_token)
            .send({
                name: 'facebook',
                social_media_url: 'www.facebook.com'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body.social_medias[0]).toHaveProperty('id', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('UserId', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('name', socialmedia.name)
        expect(res.body.social_medias[0]).toHaveProperty('social_media_url', socialmedia.social_media_url)
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .put('/socialmedias/1')
            .send(socialmedia)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
    })
})

//delete socialmedia
describe('DELETE /socialmedias/:id', () => {
    beforeAll(async () => {
        try{
            await createUser()
            await createSocialMedia()
        }catch{
            console.log(error);
        }
    })
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await SocialMedia.destroy({ where: {} })
        } catch (error) {
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
            .delete('/socialmedias/1')
            .set('token', access_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('message', 'Your social media has been successfully deleted')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('status', 'success')
    })
    //error response
    it('should send response with 400 status code', async () => {
        const res = await request(app)
            .delete('/socialmedias/1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
    })
})