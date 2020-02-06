import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

export const user = writable(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {});

user.subscribe(u => Cookies.set('user', u));