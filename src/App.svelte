<script>

	import io from 'socket.io-client';
	import { Router } from "@sveltech/routify";
	import { routes } from "@sveltech/routify/tmp/routes";

	const socket = io();

	socket.on('connect', () => {
		console.log('Connected!');
	})

</script>

<Router {routes} />