const request = require('supertest');
const app = require('../app');
const { User} = require('../models');
const { Photo } = require('../models');

let auth_token

const body = {
    email: 'user1@mail.com',
    password: '123456',
}

const photo = {
    title: 'test',
    caption: 'test',
    poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
    UserId: 1
}

const createUser =  async () => {
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
const createUser2 =  async () => {
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

const createPhoto = async () => {
    const result = await Photo.create({
        id : 1,
        title: 'test',
        caption: 'test',
        poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        UserId: 1
    })
    return result
}

const createPhoto2 = async () => {
    const result = await Photo.create({
        id : 2,
        title: 'test',
        caption: 'test',
        poster_image_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        UserId: 2
    })
}

//post photo
describe('POST /photos', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
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
            .send(body)
        const { access_token } = response.body
        console.log(access_token);
        auth_token = access_token
        const res = await request(app)
            .post('/photos')
            .set('token', auth_token)
            .send(photo)
        expect(res.status).toBe(201)
        expect(res.body.photo).toHaveProperty('id', expect.any(Number))
        expect(res.body.photo).toHaveProperty('title', photo.title)
        expect(res.body.photo).toHaveProperty('caption', photo.caption)
        expect(res.body.photo).toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body.photo).toHaveProperty('UserId', photo.UserId)
        // done()
    })

    //error response
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .post('/photos')
            .send(photo)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('title', photo.title)
        expect(res.body).not.toHaveProperty('caption', photo.caption)
        expect(res.body).not.toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body).not.toHaveProperty('UserId', photo.UserId)
    })
})
//get all photos
describe('GET /photos', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
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
            const res = await request(app)
                .get('/photos')
                .set('token', auth_token)
            expect(res.status).toBe(200)
            expect(res.body.photos[0]).toHaveProperty('id', expect.any(Number))
            expect(res.body.photos[0]).toHaveProperty('title', photo.title)
            expect(res.body.photos[0]).toHaveProperty('caption', photo.caption)
            expect(res.body.photos[0]).toHaveProperty('poster_image_url', photo.poster_image_url)
            expect(res.body.photos[0]).toHaveProperty('UserId', photo.UserId)
    })
    //error response
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .get('/photos')
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('title', photo.title)
        expect(res.body).not.toHaveProperty('caption', photo.caption)
        expect(res.body).not.toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body).not.toHaveProperty('UserId', photo.UserId)
    })
})

//edit photo
describe('PUT /photos/:id', () => {
    afterAll(async () => {
        try {
            await User.destroy({ where: {} })
            await Photo.destroy({ where: {} })
        } catch (error) {
            console.log(error);
        }
    })
    beforeAll(async () => {
        try{
            await createUser()
            await createUser2()
            await createPhoto()
            await createPhoto2()
        }catch{
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', async () => {
        const res = await request(app)
            .put('/photos/1')
            .set('token', auth_token)
            .send(photo)
        expect(res.status).toBe(200)
        expect(res.body.photo).toHaveProperty('id', expect.any(Number))
        expect(res.body.photo).toHaveProperty('title', photo.title)
        expect(res.body.photo).toHaveProperty('caption', photo.caption)
        expect(res.body.photo).toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body.photo).toHaveProperty('UserId', photo.UserId)
        })
    //error response (no token)
    it('should send response with 401 status code', async () => {
        const res = await request(app)
            .put('/photos/1')
            .send(photo)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'jwt must be provided')
        expect(res.body).toHaveProperty('name', 'JsonWebTokenError')
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('title', photo.title)
        expect(res.body).not.toHaveProperty('caption', photo.caption)
        expect(res.body).not.toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body).not.toHaveProperty('UserId', photo.UserId)
    })
    //error response (not authorized)
    it('should send response with 401 status code', async () => {
        
        const res = await request(app)
            .put('/photos/2')
            .set('token', auth_token)
            .send(photo)
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message', 'User not authorized')
        expect(res.body).toHaveProperty('devMessage', `User with id 1 not authorized to id 2`)
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('title', photo.title)
        expect(res.body).not.toHaveProperty('caption', photo.caption)
        expect(res.body).not.toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body).not.toHaveProperty('UserId', photo.UserId)
        
    })
    //error response (not found)
    it('should send response with 404 status code', async () => {
        const res = await request(app)
            .put('/photos/100')
            .set('token', auth_token)
            .send(photo)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('message', 'Photo not found')
        expect(res.body).toHaveProperty('devMessage', `Photo with id 100 not found`)
        expect(res.body).not.toHaveProperty('id', expect.any(Number))
        expect(res.body).not.toHaveProperty('title', photo.title)
        expect(res.body).not.toHaveProperty('caption', photo.caption)
        expect(res.body).not.toHaveProperty('poster_image_url', photo.poster_image_url)
        expect(res.body).not.toHaveProperty('UserId', photo.UserId)
    })

})