import { Schema, model } from 'mongoose';
import { PublicUserSchema } from './PublicUser';

const UserSchema = new Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /\S+@\S+\.\S+/gi
    },
    public: {
        type: PublicUserSchema,
        required: true
    },
    pending_friends: {
        type: [PublicUserSchema],
        default: []
    },
    asked_friends: {
        type: [PublicUserSchema],
        default: []
    },
    blocked_friends: {
        type: [PublicUserSchema],
        default: []
    },
    friends: {
        type: [PublicUserSchema],
        default: []
    }
})

const UserModel = model('User', UserSchema);

export { UserSchema, UserModel };