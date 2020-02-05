import { Schema, model } from 'mongoose';
import { PublicUserSchema } from './PublicUser';

const TournamentSchema = new Schema({
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
    members: {
        type: [PublicUserSchema],
        default: []
    }
})

const TournamentModel = model('Tournament', TournamentSchema);

export { TournamentSchema, TournamentModel };