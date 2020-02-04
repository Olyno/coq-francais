import * as Koa from 'koa';
import { Socket } from 'socket.io';
import { Server } from 'http';

export async function createSocketServer(app: Koa): Promise<Server> {
    return new Promise((resolve, rejects) => {
        const server: Server = new Server(app.callback());
        const io = require('socket.io')(server);

        io.on('connection', (socket: Socket) => {
            console.log('New connection!');
        })

        console.log('|- Socket server created');

        resolve(server);
    })
}