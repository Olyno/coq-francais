import { connect } from 'mongoose';
import { uriEncode } from '../../utils';

import { BadgeModel as Badges } from './schemas/Badge';
import { ChallengeModel as Challenges } from './schemas/Challenge';

import badgesList from './data/badges';
import challengesList from './data/challenges';

export async function login(user, password, url) {
    const currentUrl = url.replace(/<username>/g, user).replace(/<password>/g, uriEncode(password));
    connect(currentUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => {
            for (const badge of badgesList) {
                Badges.findOne({ name: badge.name })
                    .then((badgeFound) => {
                        if (!badgeFound) {
                            Badges.create(badge);
                        }
                    })
            }
            for (const challenge of challengesList) {
                Challenges.findOne({ name: challenge.name })
                    .then((challengeFound) => {
                        if (!challengeFound) {
                            Challenges.create(challenge);
                        }
                    })
            }
            console.log('> Connected to the database')
        })
        .catch(err => console.error('> Can\'t login to the database: ' + err))
}