import { Schema, model } from 'mongoose';

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
    points: {
        type: Number,
        default: 0
    }
})

const UserModel = model('User', UserSchema);

export { UserSchema, UserModel };