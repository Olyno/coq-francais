import * as koa from 'koa';
import * as send from 'koa-send';
import * as serve from 'koa-static';
import * as protect from 'koa-protect';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';

const PORT = 3000;

const app = new koa();

app.use(helmet());
app.use(cors());
app.use(protect.koa.sqlInjection({ body: true, loggerFunction: console.error }))
app.use(protect.koa.xss({ body: true, loggerFunction: console.error }))  

// Serve static assets
app.use(serve('public'));

// Serve index.html file
app.use(async (ctx, next) => {
    await send(ctx, 'index.html', { root: 'public' });
    return next();
})

app.listen(PORT, () => console.log('> Server listening at http://localhost:' + PORT))