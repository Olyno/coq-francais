<script>

    import axios from 'axios';
    import { isEmpty, goto } from '../../clientUtils';
    import { user } from '../../stores';

    import Navbar from '../../components/Navbar.svelte';
    import ChallengeCard from '../../components/ChallengeCard.svelte';
    import Error from '../../components/Error.svelte';

    export let categoryName;

    let error,
        success

    const challengesRequest = axios.post('/api/challenges', { category: categoryName.replace(/%20/g, ' ') }).then(({ data }) => data);

</script>

{#if !isEmpty($user)}
    <Navbar user={$user}>
        <div class="white-bordered-background">

           <div class="has-text-centered section">
                <div class="columns is-mobile is-centered">
                    <div class="column is-3">
                        <a href="/user/challenges_and_versus">
                            <img class="chevron" src="/icons/chevron-left.svg" alt="Chevron Icon">
                        </a>
                    </div>
                    <div class="column">
                        <h1 class="title">{categoryName.replace(/%20/g, ' ')}</h1>
                    </div>
                </div>
           </div>

           <div class="section">
                {#await challengesRequest}
                    <h1 class="title has-text-centered">Serching existing challenges...</h1>
                {:then challenges}
                    {#if challenges.length > 0}
                        {#each challenges as challenge}
                            <div class="small-section">
                                <ChallengeCard on:error={(e) => error = e.details} {challenge} />
                            </div>
                        {/each}
                    {:else}
                        <h1 class="title has-text-centered">There are no challenge in this category yet</h1>
                    {/if}
                {/await}
           </div>

        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}