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
                    expect(400)
                    expect(res.body).toHaveProperty('message', 'Invalid email format');
                    done();
                })
        });
    })

// //test api login
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
                expect(res.body).toHaveProperty('status', 'login success');
                expect(res.body).toHaveProperty('access_token', expect.any(String));
                expect('access_token').toBeDefined();
                expect('access_token').not.toBeNull();
                expect('access_token').not.toBeUndefined();
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
                expect(400)
                expect(res.body).toHaveProperty('message', 'Invalid email/password');
                done();
            })
    })
})

// //test api edit user
describe('PUT /users/:id', () => {
    let access_token = '';
    let id = 0;
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
                id : 1,
                full_name: 'admin',
                email: 'admin@mail.com',
                password: '123456',
                username: 'admin',
                profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                age: 20,
                phone_number: '62873647'
            })
        } catch (error) {
            console.log(error);
        }
})
    //success response
    it('should send response with 200 status code', (done) => {
        //login first
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
                }
                const token = res.body.access_token;
                request(app)
                    .put(`/users/1`)
                    .set('token', token)
                    .send({
                        full_name: 'admin',
                        email: 'admin@mail.com',
                        password: '123456',
                        username: 'admin',
                        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                        age: 20,
                        phone_number: '62873647'
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log(res.body, 'ini res body');
                        }
                        expect(res.body).toHaveProperty('email', 'admin@mail.com');
                        expect(res.body).toHaveProperty('password', expect.any(String));
                        expect(res.body).toHaveProperty('username', 'admin');
                        expect(res.body).toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                        expect(res.body).toHaveProperty('age', 20);
                        expect(res.body).toHaveProperty('phone_number', 62873647);
                        done();
                    })
            })
        
    })

    //error response
    it('should send response with 400 status code', (done) => {
        //login first
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
                }
                const token = res.body.access_token;
                request(app)
                    .put(`/users/1`)
                    .send({
                        full_name: 'admin',
                        email: 'admin@mail.com',
                        password: '123456',
                        username: 'admin',
                        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                        age: 20,
                        phone_number: '62873647'
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    console.log(res.body, 'ini res body');
                }
                expect(res.body).toHaveProperty('name', 'JsonWebTokenError');
                expect(res.body).not.toHaveProperty('access_token', expect.any(String));
                expect(res.body).toHaveProperty('message', 'jwt must be provided');
                done();
            })
        })
    })
 })

//test api delete user
describe('DELETE /users/:id', () => {
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
                id : 1,
                full_name: 'admin',
                email: 'admin@mail.com',
                password: '123456',
                username: 'admin',
                profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                age: 20,
                phone_number: '62873647'
            })
        } catch (error) {
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', (done) => {
        //login first
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
                }
                const token = res.body.access_token;
                request(app)
                    .delete(`/users/1`)
                    .set('token', token)
                    .expect(200)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log(res.body, 'ini res body');
                        }
                        expect(200);
                        expect(res.body).toHaveProperty('message');
                        expect(res.body).toHaveProperty('message', 'your account has been successfully deleted');
                        expect(token).toEqual(expect.any(String));
                        expect(res.body).toHaveProperty('status', 'success');
                        done();
                    })
            })
    })
    //error response
    it('should send response with 400 status code', (done) => {
        //login first
        request(app)
            .post('/users/login')
            .send({
                email : 'admin@mail.com',
                password : '123456'
            })
            .expect(404)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                const token = res.body.access_token;
                request(app)
                    .delete(`/users/1`)
                    .expect(401)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        }
                        expect(res.body).toHaveProperty('name', 'JsonWebTokenError');
                        expect(res.body).not.toHaveProperty('access_token', expect.any(String));
                        expect(res.body).toHaveProperty('message', 'jwt must be provided');
                        done();
            })
        })
    })
})