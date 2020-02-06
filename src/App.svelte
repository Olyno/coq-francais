<script>

	import io from 'socket.io-client';
	import { isEmpty } from './clientUtils';
	import { user } from './stores';
	import { onMount } from 'svelte';
	import { Router } from '@sveltech/routify';
	import { routes } from '@sveltech/routify/tmp/routes';

	const socket = io();

	socket.on('connect', () => {
		console.log('Connected!');
	})

	onMount(async () => {
		if (!isEmpty($user)) {
			document.getElementsByTagName('body')[0].style.backgroundColor = '#80BB9A';
		}
	})

</script>

<Router {routes} />