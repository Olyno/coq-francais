<script>

    import axios from 'axios';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '../clientUtils';
    import { user } from '../stores';

    import Error from './Error.svelte';

    export let challenge;
    export let canStart = true;

    const dispatch = createEventDispatcher();

    async function startChallenge() {
        dispatch('clicked');
        if (canStart) {
            axios.post('/api/users/challenges/start', { user: $user._id, challenge: challenge._id })
                .then(({ data }) => {
                    $user.public.challenges = data;
                    goto('/');
                })
                .catch(err => dispatch('error', 'You already started this challenge!'))
        }
    }

</script>

<style>
    .challenge-card { border: 2px solid black; border-radius: 15px; }
    .challenge-description { font-weight: bold; font-size: 21px }
</style>

<div class="small-section challenge-card" on:click={startChallenge}>
    <div class="columns is-mobile is-centered">
        <div class="column is-4">
            {#if challenge.icon}
                <img width="80px" src="{challenge.icon}" alt="Challenge Icon">
            {:else}
                <h1 class="title">{challenge.name}</h1>
            {/if}
        </div>
        <div class="column">
            <p class="challenge-description">{challenge.description}</p>
            <p class="subtitle">{challenge.points} points</p>
        </div>
    </div>
</div>