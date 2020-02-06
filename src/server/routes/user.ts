import * as bcrypt from 'bcrypt';
import * as Router from '@koa/router';
import { Document } from 'mongoose';
import { UserModel as Users } from '../database/schemas/User';
import { BadgeModel as Badges } from '../database/schemas/Badge';
import { TournamentModel as Tournaments } from '../database/schemas/Tournament';
import { ChallengeModel as Challenges } from '../database/schemas/Challenge';
import { ChatRoomModel as Rooms } from '../database/schemas/chat/ChatRoom';
import { status, error } from '../../utils';
import { IPublicUser, IBadge } from '../types';

const router = new Router();

async function signin(ctx: any, next) {
    const { email, password } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findOne({ email })
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
                                    _id: user.get('_id'),
                                    login: user.get('login'),
                                    public: user.get('public'),
                                    email: user.get('email')
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
    const { username, email, password, repeatPassword, birthdate, sex, club } = ctx.request.body;
    if (password !== repeatPassword) {
        status(ctx, 401, 'Both password are not the same');
        return next();
    }
    await new Promise((resolve, rejects) => {
        Users.findOne({ 'public.username': username, email })
            .then((user: Document) => {
                if (!user) {
                    bcrypt.hash(password, 10)
                        .then((encryptedPassword: string) => {
                            Users.create({
                                email,
                                birthdate,
                                club,
                                password: encryptedPassword,
                                sexe: sex,
                                public: {
                                    username
                                }
                            })
                                .then((newUser) => {
                                    ctx.status = 200;
                                    ctx.body = {
                                        _id: newUser.get('_id'),
                                        public: newUser.get('public'),
                                        email: newUser.get('email'),
                                        sexe: newUser.get('sexe'),
                                        club: newUser.get('club'),
                                        birthdate: newUser.get('birthdate')
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

async function editUser(ctx: any, next) {
    const { user: userId, email, avatar, username, birthdate, sexe } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ username })
                        .then((alreadyExist: Document) => {
                            if (!alreadyExist) {
                                Users.findByIdAndUpdate(userId, {
                                    email: email || user.get('email'),
                                    birthdate: birthdate || user.get('birthdate'),
                                    sexe: sexe || user.get('sexe'),
                                    'public.avatar': avatar || user.get('public.avatar'),
                                    'public.username': username || user.get('public.username')
                                }, { new: true }, (err, newUser) => {
                                    if (err) rejects(err);
                                    ctx.status = 200;
                                    ctx.body = {
                                        _id: newUser.get('_id'),
                                        public: newUser.get('public'),
                                        email: newUser.get('email'),
                                        sexe: newUser.get('sexe'),
                                        club: newUser.get('club'),
                                        birthdate: newUser.get('birthdate')
                                    };
                                    console.log('new USer', newUser)
                                    resolve();
                                })
                            } else {
                                status(ctx, 403, 'This username already exist. Please change it.');
                                rejects();
                            }
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

async function getChats(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Rooms.find({})
            .then((rooms: Document[]) => {
                const userRooms = rooms.filter(room => {
                    return room.get('members').filter((member: IPublicUser) => {
                        return member.user === userId;
                    }).length > 0;
                })
                if (userRooms.length > 0) {
                    ctx.status = 200;
                    ctx.body = userRooms.map(room => room.toJSON());
                    resolve();
                } else {
                    ctx.status = 200;
                    ctx.body = [];
                    resolve();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getPublicUsers(ctx: any, next) {
    await new Promise((resolve, rejects) => {
        Users.find({})
            .then((users: Document[]) => {
                if (users.length > 0) {
                    ctx.status = 200;
                    ctx.body = users.map(user => user.get('public'));
                    resolve();
                } else {
                    status(ctx, 404, 'There are no any user for the moment :(');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getUserBadges(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    ctx.status = 200;
                    ctx.body = user.get('public.badges');
                    resolve();
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getBadges(ctx: any, next) {
    await new Promise((resolve, rejects) => {
        Badges.find({})
            .then((badges: Document[]) => {
                if (badges.length > 0) {
                    ctx.status = 200;
                    ctx.body = badges.map(badge => badge.toJSON());
                    resolve();
                } else {
                    status(ctx, 404, 'This user has not any badge.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function addUserBadge(ctx: any, next) {
    const { user: userId, badge: badgeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Badges.findById(badgeId)
                        .then((badge: Document) => {
                            if (badge) {
                                Users.findByIdAndUpdate(userId, {
                                    'public.badges': [...user.get('public.badges'), badge.toObject()]
                                }, { new: true }, (err, newBadges) => {
                                    if (err) rejects(err);
                                    ctx.status = 200;
                                    ctx.body = newBadges.get('public.badges');
                                    resolve();
                                })
                            } else {
                                status(ctx, 401, 'This badge is incorrect.');
                                rejects();
                            }
                        })
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function removeUserBadge(ctx: any, next) {
    const { user: userId, badge: badgeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findByIdAndUpdate(userId, {
                        'public.badges': user.get('public.badges').filter((badge: IBadge) => badge._id.toString() !== badgeId)
                    }, { new: true }, (err, newBadges) => {
                        if (err) rejects(err);
                        ctx.status = 200;
                        ctx.body = newBadges.get('public.badges');
                        resolve();
                    })
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getFriends(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    ctx.status = 200;
                    ctx.body = user.get('friends');
                    resolve();
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getPendingFriends(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    ctx.status = 200;
                    ctx.body = user.get('pending_friends');
                    resolve();
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getBlockedFriends(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    ctx.status = 200;
                    ctx.body = user.get('blocked_friends');
                    resolve();
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getAskedFriends(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                Users.find({})
                    .then((users: Document[]) => {
                        if (users.length > 0) {
                            ctx.status = 200;
                            ctx.body = users.filter(u => u.get('pending_friends').filter(u => u.get('_id').toString() === user.get('public._id').toString()).length > 0);
                            resolve();
                        } else {
                            status(ctx, 401, 'There are no any user.');
                            rejects();
                        }
                    })
                    .catch(rejects);
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function askFriend(ctx: any, next) {
    const { user: userId, friend: friendUsername } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    if (user.get('public.username') !== friendUsername) {
                        if (user.get('friends').filter((f: Document) => f.get('username') === friendUsername).length === 0) {
                            Users.findOne({ 'public.username': friendUsername })
                                .then((friend: Document) => {
                                    if (friend) {
                                        const alreadyAsked = friend.get('pending_friends').filter((f: Document) => f.get('_id').toString() === user.get('public._id').toString()).length > 0;
                                        if (!alreadyAsked) {
                                            Users.findByIdAndUpdate(friend.get('_id').toString(), { 
                                                pending_friends: [...friend.get('pending_friends'), user.get('public')]
                                            }, { new: true }, (err, newUser) => {
                                                if (err) rejects(err);
                                                ctx.status = 200;
                                                resolve();
                                            });
                                        } else {
                                            status(ctx, 403, 'You already asked this user as friend.');
                                            rejects();
                                        }
                                    } else {
                                        status(ctx, 401, 'This friend id is incorrect.');
                                        rejects();
                                    }
                                })
                                .catch(rejects);
                        } else {
                            status(ctx, 403, 'You already have this user in your friends list');
                            rejects();
                        }  
                    } else {
                        status(ctx, 403, 'You can\'t add yourself!');
                        rejects();
                    }
                } else {
                    status(ctx, 401, 'This user id is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function cancelAskFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const alreadyAsked = friend.get('pending_friends').filter((f: Document) => f.get('_id').toString() === user.get('public._id').toString()).length > 0;
                                if (alreadyAsked) {
                                    Users.findByIdAndUpdate(friend.get('_id').toString(), {
                                        pending_friends: friend.get('pending_friends').filter((f: Document) => f.get('_id').toString() !== user.get('public._id').toString())
                                    }, { new: true }, (err, newUser) => {
                                        if (err) rejects(err);
                                        ctx.status = 200;
                                        resolve();
                                    })
                                } else {
                                    status(ctx, 403, 'You never asked this user as friend.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This friend id is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This user id is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function acceptFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const alreadyFriend = user.get('friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                const isPending = user.get('pending_friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                if (isPending) {
                                    if (!alreadyFriend) {
                                        Users.findByIdAndUpdate(friend.get('_id').toString(), {
                                            pending_friends: friend.get('pending_friends').filter((f: Document) => f.get('_id').toString() !== user.get('public._id').toString()),
                                            friends: [...friend.get('friends'), user.get('public')]
                                        }, { new: true }, (err) => {
                                            if (err) rejects(err);
                                            Users.findByIdAndUpdate(userId, {
                                                pending_friends: user.get('pending_friends').filter((f: Document) => f.get('_id').toString() !== friend.get('public._id').toString()),
                                                friends: [...user.get('friends'), friend.get('public')]
                                            }, { new: true }, (err, newUser) => {
                                                if (err) rejects(err);
                                                ctx.status = 200;
                                                ctx.body = {
                                                    friends: newUser.get('friends'),
                                                    pending_friends: newUser.get('pending_friends')
                                                };
                                                resolve();
                                            })
                                        })
                                    } else {
                                        status(ctx, 403, 'You are already the friend of this user.');
                                        rejects();
                                    }
                                } else {
                                    status(ctx, 403, 'You never asked this user as friend.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This friend id is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This user id is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function declineFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const isPending = user.get('pending_friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                if (isPending) {
                                    Users.findByIdAndUpdate(userId, {
                                        pending_friends: user.get('pending_friends').filter((f: Document) => f.get('_id').toString() !== friend.get('public._id').toString())
                                    }, { new: true }, (err, newUser) => {
                                        if (err) rejects(err);
                                        ctx.status = 200;
                                        ctx.body = newUser.get('pending_friends');
                                        resolve();
                                    })
                                } else {
                                    status(ctx, 403, 'You already asked this user as friend.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This friend id is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This user id is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function removeFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const isFriend = user.get('friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                if (isFriend) {
                                    Users.findByIdAndUpdate(userId, {
                                        friends: friend.get('friends').filter((f: Document) => f.get('_id').toString() !== user.get('public._id').toString())
                                    }, { new: true }, (err, doc) => {
                                        if (err) rejects(err);
                                        Users.findOneAndUpdate({ 'public._id': friendId }, {
                                            friends: user.get('friends').filter((f: Document) => f.get('_id').toString() !== friend.get('public._id').toString())
                                        }, { new: true }, (err, newUser) => {
                                            if (err) rejects(err);
                                            ctx.status = 200;
                                            ctx.body = newUser.get('friends');
                                            resolve();
                                        })
                                    })
                                } else {
                                    status(ctx, 403, 'You are not friend with this user.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This friend id is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This user id is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function blockFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const isFriend = user.get('friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                if (isFriend) {
                                    Users.findByIdAndUpdate(userId, {
                                        friends: user.get('friends').filter((f: Document) => f.get('_id').toString() !== friend.get('public._id').toString()),
                                        blocked_friends: [...user.get('blocked_friends'), friend.get('public')]
                                    }, { new: true }, (err, newUser) => {
                                        if (err) rejects(err);
                                        ctx.status = 200;
                                        ctx.body = {
                                            friends: newUser.get('friends'),
                                            blocked_friends: newUser.get('blocked_friends')
                                        };
                                        resolve();
                                    });
                                } else {
                                    status(ctx, 403, 'You are not friend with this user.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This username is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function unblockFriend(ctx: any, next) {
    const { user: userId, friend: friendId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ 'public._id': friendId })
                        .then((friend: Document) => {
                            if (friend) {
                                const isBlocked = user.get('blocked_friends').filter((f: Document) => f.get('_id').toString() === friend.get('public._id').toString()).length > 0;
                                if (isBlocked) {
                                    Users.findByIdAndUpdate(userId, {
                                        friends: [...user.get('friends'), friend.get('public')],
                                        blocked_friends: user.get('blocked_friends').filter((f: Document) => f.get('_id').toString() !== friend.get('public._id').toString())
                                    }, { new: true }, (err, newUser) => {
                                        if (err) rejects(err);
                                        ctx.status = 200;
                                        ctx.body = {
                                            friends: newUser.get('friends'),
                                            blocked_friends: newUser.get('blocked_friends')
                                        };
                                        resolve();
                                    });
                                } else {
                                    status(ctx, 403, 'You are not friend with this user.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 401, 'This username is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getUserChallenges(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        if (userId) {
            Users.findById(userId)
                .then((user: Document) => {
                    if (user) {
                        ctx.status = 200;
                        ctx.body = user.get('public.challenges');
                        resolve();
                    } else {
                        status(ctx, 401, 'This login is incorrect.');
                        rejects();
                    }
                })
                .catch(rejects);
        } else {
            Challenges.find({})
                .then((challengesList: Document[]) => {
                    if (challengesList.length > 0) {
                        ctx.status = 200;
                        ctx.body = challengesList.map(challenge => challenge.toJSON());
                        resolve();
                    } else {
                        status(ctx, 401, 'This login is incorrect.');
                        rejects();
                    }
                })
                .catch(rejects);
        }
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function startChallenge(ctx: any, next) {
    const { user: userId, challenge: challengeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    if (challengeId) {
                        Challenges.findById(challengeId)
                            .then((challenge: Document) => {
                                if (challenge) {
                                    const alreadyStarted = user.get('public.challenges').filter((c: Document) => c.get('_id').toString() === challengeId).length > 0;
                                    if (!alreadyStarted) {
                                        Users.findByIdAndUpdate(userId, {
                                            'public.challenges': [...user.get('public.challenges'), challenge]
                                        }, { new: true }, (err, newChallenges) => {
                                            if (err) rejects(err);
                                            ctx.status = 200;
                                            ctx.body = newChallenges.toJSON();
                                            resolve();
                                        });
                                    } else {
                                        status(ctx, 401, 'This challenge has already been started.');
                                        rejects();
                                    }
                                } else {
                                    status(ctx, 401, 'This challenge is incorrect.');
                                    rejects();
                                }
                            })
                    } else {
                        ctx.status = 200;
                        ctx.body = user.get('public.completed_challenges');
                        resolve();
                    }
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function completeChallenge(ctx: any, next) {
    const { user: userId, challenge: challengeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    if (challengeId) {
                        Challenges.findById(challengeId)
                            .then((challenge: Document) => {
                                if (challenge) {
                                    Users.findByIdAndUpdate(userId, {
                                        'public.completed_challenges': [...user.get('public.completed_challenges'), challenge]
                                    }, { new: true }, (err, newChallenges) => {
                                        if (err) rejects(err);
                                        ctx.status = 200;
                                        ctx.body = newChallenges.toJSON();
                                        resolve();
                                    });
                                } else {
                                    status(ctx, 401, 'This challenge is incorrect.');
                                    rejects();
                                }
                            })
                    } else {
                        ctx.status = 200;
                        ctx.body = user.get('public.completed_challenges');
                        resolve();
                    }
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function failedChallenge(ctx: any, next) {
    const { user: userId, challenge: challengeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findByIdAndUpdate(userId, {
                        'public.challenges': user.get('public.challenges').filter(challenge => challenge._id !== challengeId)
                    }, { new: true }, (err, newChallenges) => {
                        if (err) rejects(err);
                        ctx.status = 200;
                        ctx.body = newChallenges.toJSON();
                        resolve();
                    });
                } else {
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function getTournaments(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Tournaments.find({})
            .then((tournamentsList: Document[]) => {
                if (tournamentsList.length > 0) {
                    if (userId) {
                        Users.findById(userId)
                            .then((user: Document) => {
                                if (user) {
                                    ctx.status = 200;
                                    ctx.body = tournamentsList.filter(tournament => tournament.get('members').includes(user.get('public.login')));
                                    resolve();
                                } else {
                                    status(ctx, 401, 'This login is incorrect.');
                                    rejects();
                                }
                            })
                            .catch(rejects);
                    } else {
                        ctx.status = 200;
                        ctx.body = tournamentsList.map(tournament => tournament.toJSON());
                        resolve();
                    }
                } else {
                    status(ctx, 404, 'There are no tournaments');
                    rejects();
                }
            })
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function joinTournament(ctx: any, next) {
    const { user: userId, tournament: tournamentId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Tournaments.findById(tournamentId)
            .then((tournament: Document) => {
                if (tournament) {
                    Users.findById(userId)
                        .then((user: Document) => {
                            if (user) {
                                Tournaments.findByIdAndUpdate(tournamentId, {
                                    members: [...tournament.get('members'), user.get('public')]
                                }, { new: true }, (err, newTournament) => {
                                    if (err) rejects(err);
                                    ctx.status = 200;
                                    ctx.body = newTournament.toJSON();
                                    resolve();
                                });
                            } else {
                                status(ctx, 401, 'This login is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);   
                }
        })
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function leaveTournament(ctx: any, next) {
    const { user: userId, tournament: tournamentId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Tournaments.findById(tournamentId)
            .then((tournament: Document) => {
                if (tournament) {
                    Users.findById(userId)
                        .then((user: Document) => {
                            if (user) {
                                Tournaments.findByIdAndUpdate(tournamentId, {
                                    members: tournament.get('members').filter(member => member._id !== user.get('_id'))
                                }, { new: true }, (err, newTournament) => {
                                    if (err) rejects(err);
                                    ctx.status = 200;
                                    ctx.body = newTournament.toJSON();
                                    resolve();
                                });
                            } else {
                                status(ctx, 401, 'This login is incorrect.');
                                rejects();
                            }
                        })
                        .catch(rejects);   
                }
        })
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

router.post('/api/users', getPublicUsers); // Tested
router.post('/api/users/edit', editUser); // Tested
router.post('/api/users/signin', signin); // Tested
router.post('/api/users/signup', signup); // Tested
router.post('/api/users/chats', getChats); // Tested
router.post('/api/users/badges', getUserBadges); // Tested
router.post('/api/users/badges/add', addUserBadge); // Tested
router.post('/api/users/badges/remove', removeUserBadge); // Tested
router.post('/api/users/challenges', getUserChallenges); // Tested
router.post('/api/users/challenges/start', startChallenge); // Tested
router.post('/api/users/challenges/completed', completeChallenge); // Tested
router.post('/api/users/challenges/failed', failedChallenge); // Tested
router.post('/api/users/friends', getFriends); // Tested
router.post('/api/users/friends/pending', getPendingFriends); // Tested
router.post('/api/users/friends/blocked', getBlockedFriends); // Tested
router.post('/api/users/friends/ask', askFriend); // Tested
router.post('/api/users/friends/asked', getAskedFriends);
router.post('/api/users/friends/ask/cancel', cancelAskFriend); // Tested
router.post('/api/users/friends/accept', acceptFriend); // Tested
router.post('/api/users/friends/decline', declineFriend); // Tested
router.post('/api/users/friends/block', blockFriend); // Tested
router.post('/api/users/friends/unblock', unblockFriend); // Tested
router.post('/api/users/friends/remove', removeFriend); // Tested
router.post('/api/badges', getBadges); // Tested (returns wrong code => 401)
router.post('/api/tournaments', getTournaments); // Tested
router.post('/api/tournaments/join', joinTournament); // Tested
router.post('/api/tournaments/leave', leaveTournament); // Tested

export default router;