import { Schema, model } from 'mongoose';
import { BadgeSchema } from './Badge';
import { ChallengeSchema } from './Challenge';

const PublicUserSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png'
    },
    points: {
        type: Number,
        default: 0
    },
    badge: {
        type: [BadgeSchema],
        default: []
    },
    challenges: {
        type: [ChallengeSchema],
        default: []
    },
    completed_challenges: {
        type: [ChallengeSchema],
        default: []
    }
})

const PublicUserModel = model('PublicUser', PublicUserSchema);

export { PublicUserSchema, PublicUserModel };