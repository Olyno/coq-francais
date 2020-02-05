import { Schema, model } from 'mongoose';

const ChallengeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    }
})

const ChallengeModel = model('Challenge', ChallengeSchema);

export { ChallengeSchema, ChallengeModel };