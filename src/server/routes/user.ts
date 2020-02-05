import * as bcrypt from 'bcrypt';
import * as Router from '@koa/router';
import { Document } from 'mongoose';
import { UserModel as Users } from '../database/schemas/User';
import { BadgeModel as Badges } from '../database/schemas/Badge';
import { TournamentModel as Tournaments } from '../database/schemas/Tournament';
import { ChallengeModel as Challenges } from '../database/schemas/Challenge';
import { ChatRoomModel as Rooms } from '../database/schemas/chat/ChatRoom';
import { status, error } from '../../utils';
import { IPublicUser } from '../types';

const router = new Router()

async function signin(ctx: any, next) {
    const { user: userId, password } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
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
                                    id: user.get('_id'),
                                    login: user.get('login'),
                                    author: user.get('author'),
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
                            Users.create({
                                login,
                                email,
                                password: encryptedPassword,
                                public: {
                                    login,
                                    username: login
                                }
                            })
                                .then((newUser) => {
                                    ctx.status = 200;
                                    ctx.body = {
                                        id: newUser.get('_id'),
                                        login: newUser.get('login'),
                                        public: newUser.get('public'),
                                        email: newUser.get('email')
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
    const { user: userId, email, avatar, username } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    user
                        .set('email', email)
                        .set('avatar', avatar)
                        .set('username', username)
                        .save()
                        .then((newUser: Document) => {
                            ctx.status = 200;
                            ctx.body = {
                                login: newUser.get('login'),
                                public: newUser.get('public'),
                                email: newUser.get('email')
                            };
                            resolve();
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
                    status(ctx, 404, 'This user is not in any room.');
                    rejects();
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
                    status(ctx, 404, 'This user is not in any room.');
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
                    status(ctx, 401, 'This login is incorrect.');
                    rejects();
                }
            })
            .catch(rejects);
    })
    .catch(err => err && error(err.message || err, ctx));

    return next();

}

async function addBadge(ctx: any, next) {
    const { user: userId, badge: badgeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Badges.findById(badgeId)
                        .then((badge: Document) => {
                            user.set('public.badge', [...user.get('public.badges'), badge.toObject()])
                                .save()
                                .then((newBadges) => {
                                    ctx.status = 200;
                                    ctx.body = newBadges.get('public.badges');
                                    resolve();
                                })
                                .catch(rejects);
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

async function removeBadge(ctx: any, next) {
    const { user: userId, badge: badgeId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    user.set('public.badge', user.get('public.badges').map(badge => badge._id !== badgeId))
                        .save()
                        .then((newBadges) => {
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

async function getAskedFriends(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    ctx.status = 200;
                    ctx.body = user.get('asked_friends');
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

async function askFriend(ctx: any, next) {
    const { user: userId, friend: friendUsername } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ friendUsername })
                        .then((friend: Document) => {
                            if (friend) {
                                const askedFriends = friend.get('asked_friends');
                                const alreadyAsked = askedFriends.filter(u => u.login !== user.get('public.login'));
                                if (!alreadyAsked) {
                                    friend.set('pending_friends', [...friend.get('pending_friends'), user.get('public')])
                                        .save()
                                        .catch(rejects);
                                    user.set('asked_friends', [...user.get('asked_friends'), friend.get('public')])
                                        .save()
                                        .then((newUser: Document) => {
                                            ctx.status = 200;
                                            ctx.body = newUser.get('asked_friends');
                                            resolve();
                                        })
                                        .catch(rejects);
                                } else {
                                    status(ctx, 403, 'You already asked this user as friend.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 404, 'This username is incorrect.');
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

async function acceptFriend(ctx: any, next) {
    const { user: userId, friend: friendUsername } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        Users.findById(userId)
            .then((user: Document) => {
                if (user) {
                    Users.findOne({ friendUsername })
                        .then((friend: Document) => {
                            if (friend) {
                                const pendingFriends = friend.get('pending_friends');
                                const alreadyFriend = pendingFriends.filter(u => u.login === user.get('public.login'));
                                if (!alreadyFriend) {
                                    friend.set('asked_friends', friend.get('asked_friends').map(u => u.login !== user.get('public.login')))
                                        .set('friends', [...friend.get('friends'), user.get('public')])
                                        .save()
                                        .catch(rejects);
                                    user.set('pending_friends', user.get('pending_friends').map(u => u.login !== friend.get('public.login')))
                                        .set('friends', user.get('pending_friends').map(u => u.login !== friend.get('public.login')))
                                        .save()
                                        .then((newUser: Document) => {
                                            ctx.status = 200;
                                            ctx.body = newUser.get('pending_friends');
                                            resolve();
                                        })
                                        .catch(rejects);
                                } else {
                                    status(ctx, 403, 'You already asked this user as friend.');
                                    rejects();
                                }
                            } else {
                                status(ctx, 404, 'This username is incorrect.');
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

async function getChallenges(ctx: any, next) {
    const { user: userId } = ctx.request.body;
    await new Promise((resolve, rejects) => {
        if (userId) {
            Users.findById(userId)
                .then((user: Document) => {
                    if (user) {
                        ctx.status = 200;
                        ctx.body = user.get('challenges');
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
                        ctx.body = challengesList;
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
                                    user.set('public.challenges', [...user.get('public.challenges'), challenge]).save()
                                        .then((newChallenges: Document) => {
                                            ctx.status = 200;
                                            ctx.body = newChallenges.toJSON();
                                            resolve();
                                        })
                                        .catch(rejects);
                                } else {
                                    status(ctx, 404, 'This challenge is incorrect.');
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
                                    user.set('public.completed_challenges', [...user.get('public.completed_challenges'), challenge]).save()
                                        .then((newChallenges: Document) => {
                                            ctx.status = 200;
                                            ctx.body = newChallenges.toJSON();
                                            resolve();
                                        })
                                        .catch(rejects);
                                } else {
                                    status(ctx, 404, 'This challenge is incorrect.');
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
                    user.set('public.challenges', user.get('public.challenges').filter(challenge => challenge._id !== challengeId)).save()
                        .then((newChallenges: Document) => {
                            ctx.status = 200;
                            ctx.body = newChallenges.toJSON();
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
                                    ctx.body = tournamentsList.map(tournament => tournament.get('members').includes(user.get('public.login')));
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
                                tournament.set('members', [...tournament.get('members'), user.get('public')])
                                    .save()
                                    .then((newTournament: Document) => {
                                        ctx.status = 200;
                                        ctx.body = newTournament.toJSON();
                                        resolve();
                                    })
                                    .catch(rejects);
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
                                tournament.set('members', tournament.get('members').filter(member => member._id !== user.get('_id')))
                                    .save()
                                    .then((newTournament: Document) => {
                                        ctx.status = 200;
                                        ctx.body = newTournament.toJSON();
                                        resolve();
                                    })
                                    .catch(rejects);
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

router.post('/api/users', getPublicUsers);
router.post('/api/users/edit', editUser);
router.post('/api/users/signin', signin);
router.post('/api/users/signup', signup);
router.post('/api/users/chats', getChats);
router.post('/api/users/badges', getBadges);
router.post('/api/users/tournaments', getTournaments);
router.post('/api/users/badges', getUserBadges);
router.post('/api/users/badges/add', addBadge);
router.post('/api/users/badges/remove', removeBadge);
router.post('/api/users/challenges', getChallenges);
router.post('/api/users/challenges/start', startChallenge);
router.post('/api/users/challenges/completed', completeChallenge);
router.post('/api/users/challenges/failed', failedChallenge);
router.post('/api/users/friends', getFriends);
router.post('/api/users/friends/asked', getAskedFriends);
router.post('/api/users/friends/pending', getPendingFriends);
router.post('/api/users/friends/ask', askFriend);
router.post('/api/users', getPublicUsers);
router.post('/api/tournaments', getTournaments);

export default router;