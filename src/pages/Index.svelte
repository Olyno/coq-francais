<script>

    import axios from 'axios';
    import { isEmpty, goto } from '../clientUtils';
    import { user } from '../stores';

    import Navbar from '../components/Navbar.svelte';
    import Error from '../components/Error.svelte';
    import ChallengeCard from '../components/ChallengeCard.svelte';

    let error;
    let challengeToSee;

    axios.post('/api/challenges', { user: $user._id })
        .then(({ data }) => {
            $user.public.challenges = data;
        })

    async function completedChallenge() {
        axios.post('/api/users/challenges/complete', { user: $user._id, challenge: challengeToSee._id })
            .then(({ data }) => {
                $user.public.points = data.points;
                $user.public.challenges = data.challenges;
                $user.public.completed_challenges = data.completed_challenges;
                challengeToSee = undefined;
            })
            .catch(err => error = err);
    }

</script>

<style>
    .philo-sentence {
        color: #562E8A;
    }
    .started-point {
        border-radius: 50%;
        border: 10px solid #562E8A !important;
        background-color: white !important;
    }
</style>

{#if isEmpty($user)}

    <div class="container has-text-centered">

        <div class="small-section">
            <div class="small-section">
                <img src="/images/logo_coq.svg" alt="Coq Sportif Logo">
            </div>
            <img src="/images/frontpage.svg" alt="Young people">
        </div>

        <div class="small-section">
            <h1 class="title">Chall me</h1>
        </div>

        <div class="small-section">
            <div class="level is-mobile">
                <div class="level-item">
                    <p>Not yet an account ?</p>
                </div>
                <div class="level-item"></div>
            </div>
            <a href="/signup" class="button purple-background is-button">Signup</a>
        </div>

        <div class="small-section">
            <div class="level is-mobile">
                <div class="level-item">
                    <p>Already an account ?</p>
                </div>
                <div class="level-item"></div>
            </div>
            <a href="/signin" class="button green-background is-button">Signin</a>
        </div>
    </div>

{:else}

    <Navbar user={$user} bind:isBackButton={challengeToSee}>
        <div class="white-bordered-background">

            {#if error}
                <Error>{error}</Error>
            {/if}

            {#if $user.public.challenges.length > 0}
                <div class="small-section">
                    <p>Current challenges</p>
                </div>
                {#if challengeToSee}
                    <div class="section has-text-centered">
                        <ChallengeCard canStart={false} challenge={challengeToSee} />
                        <div class="section">
                            <button class="yellow-background is-button" on:click={completedChallenge}>Complete it</button>
                        </div>
                    </div>
                {:else}
                    <div class="section">
                        <div class="timeline">
                            <div class="timeline-header">
                                <span class="tag is-medium is-primary">Started</span>
                            </div>
                            {#each $user.public.challenges as challenge}
                                <div class="timeline-item">
                                    <div class="timeline-marker is-icon started-point"></div>
                                    <div class="timeline-content">
                                        <ChallengeCard on:clicked={() => challengeToSee = challenge} canStart={false} on:error={(e) => error = e.details} {challenge} />
                                    </div>
                                </div>
                            {/each}
                            <div class="timeline-header">
                                <span class="tag is-medium is-primary">End</span>
                            </div>
                        </div>
                    </div>
                {/if}
            {:else}
                {#if $user.public.challenges.length > 0}
                    <div class="small-section">
                        <p>Current challenges</p>
                    </div>
                    
                {:else}
                    <div class="section">
                        <p class="philo-sentence">"The only person to get past is who you were yesterday."</p>
                    </div>
                    <div class="section">
                        <img src="/images/Groupe_75.svg" alt="Athelete Image">
                    </div>            
                {/if}
            {/if}

        </div>
    </Navbar> 

{/if}