import { Schema, model } from 'mongoose';
import { ChallengeSchema } from './Challenge';

const ChallengeCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    color: {
        type: String,
        default: 'black'
    },
    challenges: {
        type: [ChallengeSchema],
        default: []
    }
})

const ChallengeCategoryModel = model('ChallengeCategory', ChallengeCategorySchema);

export { ChallengeCategorySchema, ChallengeCategoryModel };