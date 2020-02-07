import * as Koa from 'koa';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as protect from 'koa-protect';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as logger from 'koa-logger';
import * as compress from 'koa-compress';

import { createSocketServer } from './sockets';
import { login as dbLogin } from './database';
import config from './config';
import routes from './routes';

const PORT = process.env.PORT || config.server.port || 5000;

const app: Koa = new Koa();

app.use(logger());
app.use(bodyParser());
app.use(helmet());
app.use(cors());
app.use(compress({ threshold: 0 }));
app.use(protect.koa.sqlInjection({ body: true, loggerFunction: console.error }));
app.use(protect.koa.xss({ body: true, loggerFunction: console.error }));

// Serve static assets
app.use(serve('public'));

// Serve index.html file
app.use(async (ctx, next) => {
    if (ctx.method.toUpperCase() === 'GET') {
        await send(ctx, 'index.html', { root: 'public' });
    }
    return next();
})

app.use(routes);

createSocketServer(app)
    .then(server => {
        server.listen(PORT, () => console.log('> Server listening at http://localhost:' + PORT));
    })

dbLogin(config.database.username, config.database.password, config.database.url);