import { Context } from "koa";
import * as bcrypt from 'bcrypt';

export function uriEncode(content: string) {
    return encodeURIComponent(content)
        .replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
}

export async function status(ctx: Context, statusNumber: number, response: any): Promise<Context> {
    if (typeof response === 'string') response = { message: response };
    ctx.status = statusNumber;
    ctx.type = 'json';
    ctx.body = response;
    return ctx;
}

export function error(message: string, ctx?: Context) {
    if (ctx) status(ctx, 500, 'Internal error');
    console.error(message);
}