import * as bcrypt from 'bcrypt';
import * as Router from '@koa/router';
import { Document } from 'mongoose';
import { UserModel as Users } from '../database/schemas/User';
import { status, error } from '../../utils';

const router = new Router()

async function signin(ctx: any, next) {
    const { login, password } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findOne({ login })
            .then((user: Document) => {
                if (user) {
                    bcrypt.compare(password, user.get('password'))
                        .then(isSamePassword => {
                            if (!isSamePassword) {
                                status(ctx, 401, 'Wrong login or password');
                                rejects();
                            } else {
                                ctx.status = 200;
                                ctx.body = {
                                    login: user.get('login'),
                                    email: user.get('email'),
                                    points: user.get('points')
                                };
                                resolve();
                            }
                        })
                        .catch(() => {
                            status(ctx, 401, 'Wrong login or password');
                            rejects();
                        });
                } else {
                    status(ctx, 401, 'Wrong login or password');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function signup(ctx: any, next) {
    const { login, email, password, repeatPassword } = ctx.request.body;
    if (password !== repeatPassword) {
        status(ctx, 401, 'Both password are not the same');
        return next();
    }
    await new Promise((resolve, rejects) => {
        Users.findOne({ login, email })
            .then((user: Document) => {
                if (!user) {
                    bcrypt.hash(password, 10)
                        .then((encryptedPassword: string) => {
                            Users.create({ login, email, password: encryptedPassword })
                                .then(newUser => {
                                    ctx.status = 200;
                                    ctx.body = {
                                        login: newUser.get('login'),
                                        email: newUser.get('email'),
                                        points: newUser.get('points')
                                    };
                                    resolve();
                                })
                                .catch(rejects);
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This login or email already exist. Please change it.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

router.post('/signin', signin);
router.post('/signup', signup);

export default router;