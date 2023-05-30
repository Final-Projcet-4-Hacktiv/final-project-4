const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

//test api register
describe('POST /users/register', () => {
    afterAll(async () => {
        //destroy data
        try {
            await User.destroy({
                where: {
                    
                }
            })
        } catch (err) {
            console.log(err);
        }
    })
        //success test
        it('should send response with 201 status code', (done) => {
            request(app)
                .post('/users/register')
                .send({
                    full_name: 'admin',
                    email: 'admin@mail.com',
                    password: '123456',
                    username: 'admin',
                    profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                    age: 20,
                    phone_number: '62873647'
                })
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        console.log(res.body, 'ini res body');
                    }
                    expect(res.body).toHaveProperty('id', expect.any(Number));
                    expect(res.body).toHaveProperty('email', 'admin@mail.com');
                    expect(res.body).toHaveProperty('password', expect.any(String));
                    expect(res.body).toHaveProperty('username', 'admin');
                    expect(res.body).toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                    expect(res.body).toHaveProperty('age', 20);
                    expect(res.body).toHaveProperty('phone_number', 62873647);
                    done();
                })
        });
        //error test
        it('should send response with 400 status code', (done) => {
            request(app)
                .post('/users/register')
                .send({
                    full_name: 'admin',
                    email: 'admin',
                    password: '123456',
                    username: 'admin',
                    profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                    age: 20,
                    phone_number: '081234567'
                })
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        console.log(res.body, 'ini res body');
                    }
                    expect(res.body).toHaveProperty('message', 'Invalid email format');
                    done();
                })
        });
    })

//test api login
describe('POST /users/login', () => {
    //success test
    afterAll(async () => {
        //destroy data
        try {
            await User.destroy({
                where: {}
            })
        } catch (error) {
            console.log(error);
        }
    })

    beforeAll(async () => {
        try {
            const result = await User.create({
                full_name: 'admin',
                email: 'admin@mail.com',
                password: '123456',
                username: 'admin',
                profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                age: 20,
                phone_number: '081234567'
            })
        } catch (error) {
            console.log(error);
        }
    });
    it('should send response with 200 status code', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : 'admin@mail.com',
                password : '123456'
            })
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log(res.body, 'ini res body');
                }
                expect(res.body).toHaveProperty('access_token', expect.any(String));
                done();
            })
    })
    //error test
    it('should send response with 400 status code', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : 'admin@mail.com',
                password : '1234567'
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res.body, 'ini res body');
                }
                expect(res.body).toHaveProperty('message', 'Invalid email/password');
                done();
            })
    })
})