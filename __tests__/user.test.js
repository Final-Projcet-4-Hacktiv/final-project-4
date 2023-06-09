const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

let auth_token

const login = {
    email: 'user@mail.com',
    password: '123456',
}

const createUser = async () => {
    const result = await User.create({
        id: 1,
        full_name: 'user',
        email: 'user@mail.com',
        password: '123456',
        username: 'user',
        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
        age: 20,
        phone_number: '081234567'
    })
    return result;
}

//test api register
describe('POST /users/register', () => {
    afterAll(async () => {
        //destroy data
        try {
            await User.destroy({
                where: {}
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
                    full_name: 'user',
                    email: 'user@mail.com',
                    password: '123456',
                    username: 'user',
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
                    expect(res.body.user).toHaveProperty('email', 'user@mail.com');
                    expect(res.body.user).toHaveProperty('username', 'user');
                    expect(res.body.user).toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                    expect(res.body.user).toHaveProperty('age', 20);
                    expect(res.body.user).toHaveProperty('phone_number', 62873647);
                    done();
                })
        });
        //error test (invalid email format)
        it('should send response with 400 status code', (done) => {
            request(app)
                .post('/users/register')
                .send({
                    full_name: 'user',
                    email: 'user',
                    password: '123456',
                    username: 'user',
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
                    expect(res.body).not.toHaveProperty('id', expect.any(Number));
                    expect(res.body).not.toHaveProperty('email', 'user@mail.com');
                    expect(res.body).not.toHaveProperty('password', expect.any(String));
                    expect(res.body).not.toHaveProperty('username', 'user');
                    expect(res.body).not.toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                    expect(res.body).not.toHaveProperty('age', 20);
                    expect(res.body).not.toHaveProperty('phone_number', 62873647);
                    done();
                })
        });
        //error test (email already exist)
        it('should send response with 400 status code', (done) => {
            request(app)
                .post('/users/register')
                .send({
                    id: 1,
                    full_name: 'user',
                    email: 'user@mail.com',
                    password: '123456',
                    username: 'user',
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
                    expect(res.body.errors[0]).toHaveProperty('message', 'Email already registered');
                    expect(res.body.errors[0]).toHaveProperty('type', 'unique violation')
                    expect(res.body).not.toHaveProperty('id', expect.any(Number));
                    expect(res.body).not.toHaveProperty('email', 'user@mail.com');
                    expect(res.body).not.toHaveProperty('password', expect.any(String));
                    expect(res.body).not.toHaveProperty('username', 'user');
                    expect(res.body).not.toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                    expect(res.body).not.toHaveProperty('age', 20);
                    expect(res.body).not.toHaveProperty('phone_number', 62873647);
                    done();
                }) 
        })
        //error response (invalid url)
        it('should send response with 400 status code', (done) => {
            request(app)
                .post('/users/register')
                .send({
                    full_name: 'user',
                    email: 'user@mail.com',
                    password: '123456',
                    username: 'user',
                    profile_img_url: 'hehehe',
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
                    expect(res.body.errors[0]).toHaveProperty('message', 'Profile image URL must be in URL format');
                    expect(res.body.errors[0]).toHaveProperty('type', 'Validation error');
                    expect(res.body).not.toHaveProperty('id', expect.any(Number));
                    expect(res.body).not.toHaveProperty('email', 'user@mail.com');
                    expect(res.body).not.toHaveProperty('password', expect.any(String));
                    expect(res.body).not.toHaveProperty('username', 'user');
                    expect(res.body).not.toHaveProperty('profile_img_url', 'hehehe');
                    expect(res.body).not.toHaveProperty('age', 20);
                    expect(res.body).not.toHaveProperty('phone_number', 62873647);
                    done();
                })
        })
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
            await createUser();
        } catch (error) {
            console.log(error);
        }
    });
    it('should send response with 200 status code', (done) => {
        request(app)
            .post('/users/login')
            .send(login)
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
                email : 'user@mail.com',
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
                expect(res.body).not.toHaveProperty('status', 'login success');
                expect(res.body).not.toHaveProperty('access_token');
                expect(res.body).not.toHaveProperty('status', 'login success')
                done();
            })
    })
})

// //test api edit user
describe('PUT /users/:id', () => {
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
            await createUser();
        } catch (error) {
            console.log(error);
        }
})
    //success response
    it('should send response with 200 status code', (done) => {
        //login first
        request(app)
            .post('/users/login')
            .send(login)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                const token = res.body.access_token;
                auth_token = token;
                request(app)
                    .put(`/users/1`)
                    .set('token', auth_token)
                    .send({
                        full_name: 'user',
                        email: 'user@mail.com',
                        password: '123456',
                        username: 'user',
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
                        expect(res.body.user).toHaveProperty('email', 'user@mail.com');
                        expect(res.body.user).toHaveProperty('username', 'user');
                        expect(res.body.user).toHaveProperty('profile_img_url', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.');
                        expect(res.body.user).toHaveProperty('age', 20);
                        expect(res.body.user).toHaveProperty('phone_number', 62873647);
                        done();
                    })
            })
        
    })

    //error response (no token)
    it('should send response with 400 status code', (done) => {
        //login first
        request(app)
            .post('/users/login')
            .send(login)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                const token = res.body.access_token;
                request(app)
                    .put(`/users/1`)
                    .send({
                        full_name: 'user',
                        email: 'user@mail.com',
                        password: '123456',
                        username: 'user',
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
                expect(res.body).not.toHaveProperty('id');
                expect(res.body).not.toHaveProperty('email');
                expect(res.body).not.toHaveProperty('password');
                expect(res.body).not.toHaveProperty('username');
                expect(res.body).not.toHaveProperty('profile_img_url');
                expect(res.body).not.toHaveProperty('age');
                expect(res.body).not.toHaveProperty('phone_number');
                done();
            })
        })
    })
    //error response user not found
    it('should send response with 404 status code', (done) => {
                request(app)
                    .put(`/users/2`)
                    .set('token', auth_token)
                    .send({
                        full_name: 'user',
                        email: 'user@mail.com',
                        password: '123456',
                        username: 'user',
                        profile_img_url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.',
                        age: 20,
                        phone_number: '62873647'
                    })
                    .expect(404)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log(res.body, 'ini res body');
                        }
                        expect(res.body).toHaveProperty('message', 'User not found');
                        expect(res.body).not.toHaveProperty('access_token', expect.any(String));
                        expect(res.body).not.toHaveProperty('id');
                        expect(res.body).not.toHaveProperty('email');
                        expect(res.body).not.toHaveProperty('password');
                        expect(res.body).not.toHaveProperty('username');
                        expect(res.body).not.toHaveProperty('profile_img_url');
                        expect(res.body).not.toHaveProperty('age');
                        expect(res.body).not.toHaveProperty('phone_number');
                        done();
                    })
                })
    //error response (invalid url)
    it('should send response with 400 status code', (done) => {
                request(app)
                    .put(`/users/1`)
                    .set('token', auth_token)
                    .send({
                        full_name: 'user',
                        email: 'user@mail.com',
                        password: '123456',
                        username: 'user',
                        profile_img_url: 'hehehe',
                        age: 20,
                        phone_number: '62873647'
                    })
                    .expect(400)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                        } else {
                            console.log(res.body, 'ini res body');
                        }
                        expect(res.body.errors[0]).toHaveProperty('message', 'Profile image URL must be in URL format');
                        expect(res.body.errors[0]).toHaveProperty('type', 'Validation error');
                        expect(res.body).not.toHaveProperty('access_token', expect.any(String));
                        expect(res.body).not.toHaveProperty('id');
                        expect(res.body).not.toHaveProperty('email');
                        expect(res.body).not.toHaveProperty('password');
                        expect(res.body).not.toHaveProperty('username');
                        expect(res.body).not.toHaveProperty('profile_img_url');
                        expect(res.body).not.toHaveProperty('age');
                        expect(res.body).not.toHaveProperty('phone_number');
                        done();
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
            await createUser();
        } catch (error) {
            console.log(error);
        }
    })
    //success response
    it('should send response with 200 status code', (done) => {
                request(app)
                    .delete(`/users/1`)
                    .set('token', auth_token)
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
                        expect(auth_token).toEqual(expect.any(String));
                        expect(res.body).toHaveProperty('status', 'success');
                        done();
                    })
    })
    //error response (no token)
    it('should send response with 400 status code', (done) => {
        request(app)
            .delete(`/users/1`)
            .expect(401)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(401)
                expect(res.body).toHaveProperty('name', 'JsonWebTokenError');
                expect(res.body).not.toHaveProperty('access_token', expect.any(String));
                expect(res.body).toHaveProperty('message', 'jwt must be provided');
                expect(res.body).not.toHaveProperty('status', 'success');
                done();
        })
    })
    
    //error response user not found
    it('should send response with 404 status code', async () => {
        await createUser();
         const response = await request(app)
                .delete(`/users/10`)
                .set('token', auth_token)
                .expect(404)
                expect(response.body).toHaveProperty('message', 'User not found');
                expect(response.body).not.toHaveProperty('status', 'success');
                expect(response.body).not.toHaveProperty('message', 'your account has been successfully deleted');
                expect(response.body).not.toHaveProperty('message', 'jwt must be provided');
    })
})