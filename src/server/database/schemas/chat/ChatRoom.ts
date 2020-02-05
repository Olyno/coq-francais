import { Schema, model } from 'mongoose';
import { ChatMessageSchema } from './ChatMessage';
import { PublicUserSchema } from '../PublicUser';

const ChatRoomSchema = new Schema({
    members: {
        type: [PublicUserSchema],
        default: [],
        required: true
    },
    messages: {
        type: [ChatMessageSchema],
        default: []
    }
})

const ChatRoomModel = model('ChatRoom', ChatRoomSchema);

export { ChatRoomSchema, ChatRoomModel };