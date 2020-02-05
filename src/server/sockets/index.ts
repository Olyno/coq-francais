import * as Koa from 'koa';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { Document } from 'mongoose';
import { error } from '../../utils';
import { ChatRoomModel as Rooms } from '../database/schemas/chat/ChatRoom';
import { IChatMessage } from '../types';

export async function createSocketServer(app: Koa): Promise<Server> {
    return new Promise((resolve, rejects) => {

        const server: Server = new Server(app.callback());
        const io = require('socket.io')(server);

        io.of('/chats').on('connection', (socket: Socket) => {
            socket.on('connectme', async (data: { login: string }) => {
                socket.join(data.login);
            })
            socket.on('message', async (chatMessage: IChatMessage) => {
                Rooms.findById(chatMessage.room)
                    .then((room: Document) => {
                        room.set('messages', [...room.get('messages'), chatMessage]).save()
                            .then(() => {
                                socket.in(chatMessage.room).emit('message', chatMessage);
                            })
                            .catch(err => err && error(err.message || err));
                    })
                    .catch(err => err && error(err.message || err));
            })
        })

        console.log('|- Socket server created');

        resolve(server);
    })
}