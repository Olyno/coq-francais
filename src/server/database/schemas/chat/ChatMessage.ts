import { Schema, model } from 'mongoose';
import { PublicUserSchema } from '../PublicUser';

const ChatMessageSchema = new Schema({
    room: {
        type: String,
        required: true
    },
    author: {
        type: PublicUserSchema,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const ChatMessageModel = model('ChatMessage', ChatMessageSchema);

export { ChatMessageSchema, ChatMessageModel };