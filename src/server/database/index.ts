import { connect } from 'mongoose';
import { uriEncode } from '../../utils';

export async function login(user, password, url) {
    const currentUrl = url.replace(/<username>/g, user).replace(/<password>/g, uriEncode(password));
    connect(currentUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('> Connected to the database'))
    .catch(err => console.error('> Can\'t login to the database: ' + err))
}