import { connect } from 'mongoose';
import { uriEncode } from '../../utils';

import { BadgeModel as Badges } from './schemas/Badge';
import { ChallengeCategoryModel as ChallengesCategoy } from './schemas/ChallengeCategory';

import badgesList from './data/badges';
import challengeCategorysList from './data/challengesCategory';

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
            for (const category of challengeCategorysList) {
                ChallengesCategoy.findOne({ name: category.name })
                    .then((categoryFound) => {
                        if (!categoryFound) {
                            ChallengesCategoy.create(category);
                        }
                    })
            }
            console.log('> Connected to the database')
        })
        .catch(err => console.error('> Can\'t login to the database: ' + err))
}