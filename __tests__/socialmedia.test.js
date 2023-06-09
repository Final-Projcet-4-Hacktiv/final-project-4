const request = require('supertest')
const app = require('../app')
const { User} = require('../models');
const { SocialMedia } = require('../models');

let auth_token

const login = {
    email: 'user1@mail.com',
    password: '123456',
}

const socialmedia = {
    name: 'facebook',
    social_media_url: 'www.facebook.com',
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

const createSocialMedia = async () => {
    const result = await SocialMedia.create({
        id : 1,
        name: 'facebook',
        social_media_url: 'www.facebook.com',
        UserId: 1
    })
}

const createSocialMedia2 = async () => {
    const result = await SocialMedia.create({
        id : 2,
        name: 'facebook',
        social_media_url: 'www.facebook.com',
        UserId: 2
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
            const response = await request(app)
            .post('/users/login')
            .send(login)
                const { body: { access_token } } = response
                auth_token = access_token
                console.log(auth_token);
        }catch{
            console.log(error);
        }
    })

    //success response
    it('should send response with 201 status code', async () => {
        const res = await request(app)
            .post('/socialmedias')
            .set('token', auth_token)
            .send(socialmedia)
        expect(res.statusCode).toEqual(201)
        expect(res.body.social_media).toHaveProperty('id', expect.any(Number))
        expect(res.body.social_media).toHaveProperty('UserId', expect.any(Number))
        expect(res.body.social_media).toHaveProperty('name', socialmedia.name)
        expect(res.body.social_media).toHaveProperty('social_media_url', socialmedia.social_media_url)
    })
    //error response (no token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .post('/socialmedias')
            .send(socialmedia)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
    })

    //error response ( invalid url)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .post('/socialmedias')
            .set('token', auth_token)
            .send({
                name: 'yotube',
                social_media_url: 'youtube',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.errors[0]).toHaveProperty('message', 'Social media URL must be in URL format')
        expect(res.body.errors[0]).toHaveProperty('type', 'Validation error')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
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
            await request(app)
            .post('/socialmedias')
            .set('token', auth_token)
            .send(socialmedia)
        const res = await request(app)
            .get('/socialmedias')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body.social_medias[0]).toHaveProperty('id', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('UserId', expect.any(Number))
        expect(res.body.social_medias[0]).toHaveProperty('name', socialmedia.name)
        expect(res.body.social_medias[0]).toHaveProperty('social_media_url', socialmedia.social_media_url)
        expect(res.body.social_medias[0]).toHaveProperty('User')

    })
    //error response
    it('should send response with 401 status code', async () => {
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
            await createUser2()
            await createSocialMedia()
            await createSocialMedia2()
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
        const res = await request(app)
            .put('/socialmedias/1')
            .set('token', auth_token)
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
    //error response (no token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/socialmedias/1')
            .send(socialmedia)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
    })

    //error response (no Unauthorized)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/socialmedias/2')
            .set('token', auth_token)
            .send(socialmedia)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'User not authorized')
        expect(res.body).toHaveProperty('devMessage', 'User with id 1 not authorized to id 2')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
    })
    //error response (not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .put('/socialmedias/100')
            .set('token', auth_token)
            .send(socialmedia)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message', 'Social Media not found')
        expect(res.body).toHaveProperty('devMessage', 'Social Media with id 100 not found')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
    })

    //error response (invalid url)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/socialmedias/1')
            .set('token', auth_token)
            .send({
                name: 'facebook',
                social_media_url: 'facebook'
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body.errors[0]).toHaveProperty('message', 'Social media URL must be in URL format')
        expect(res.body.errors[0]).toHaveProperty('type', 'Validation error')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('UserId', expect.any(Number))
        expect(res.body).not.toHaveProperty('name', socialmedia.name)
        expect(res.body).not.toHaveProperty('social_media_url', socialmedia.social_media_url)
    })
})

//delete socialmedia
describe('DELETE /socialmedias/:id', () => {
    beforeAll(async () => {
        try{
            await createUser()
            await createUser2()
            await createSocialMedia()
            await createSocialMedia2()
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
        const res = await request(app)
            .delete('/socialmedias/1')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('message', 'Your social media has been successfully deleted')
        expect(res.body).toHaveProperty('status')
        expect(res.body).toHaveProperty('status', 'success')
    })
    //error response
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .delete('/socialmedias/1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('message', 'Your social media has been successfully deleted')
        expect(res.body).not.toHaveProperty('status', 'success')
    })
    
    //error response (Unauthorized)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .delete('/socialmedias/2')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message', 'User not authorized')
        expect(res.body).toHaveProperty('devMessage', 'User with id 1 not authorized to id 2')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('message', 'Your social media has been successfully deleted')
        expect(res.body).not.toHaveProperty('status', 'success')
    })

    //error response (not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .delete('/socialmedias/100')
            .set('token', auth_token)
        expect(res.statusCode).toEqual(404)
        expect(res.body).toHaveProperty('message', 'Social Media not found')
        expect(res.body).toHaveProperty('devMessage', 'Social Media with id 100 not found')
        expect(typeof res.body).toEqual('object')
        expect(res.body).not.toHaveProperty('message', 'Your social media has been successfully deleted')
        expect(res.body).not.toHaveProperty('status', 'success')
    })
})