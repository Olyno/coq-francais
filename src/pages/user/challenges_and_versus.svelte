<script>

    import { isEmpty, goto } from '../../clientUtils';
    import { user } from '../../stores';
    import axios from 'axios';

    import Navbar from '../../components/Navbar.svelte';
    import Error from '../../components/Error.svelte';

    let error,
        success,
        section = 'challenges';

    const challengesRequest = axios.post('/api/challenges/categories').then(({ data }) => data);

    async function askFriend() {
        error = undefined;
        if (!isEmpty(searchingUser)) {
            if (searchingUser !== $user.public.username) {
                if ($user.friends.filter(f => f.username === searchingUser).length === 0) {
                    axios.post('/api/users/friends/ask', { user: $user._id, friend: searchingUser })
                        .then(() => {
                            success = 'Friend request sent!';
                            searchingUser = '';
                        })
                        .catch(err => error = 'This user doesn\'t exist or you already asked this user')
                } else {
                    error = 'You already have this user in your friends list';
                }
            } else {
                error = 'You can\'t add yourself as friend!';
            }
        }
    }

</script>

<style>
    .category { border-radius: 15px; }
    .tournament { background-color: #CDCDFF; height: 90px; }
</style>

{#if !isEmpty($user)}
    <Navbar user={$user}>
        <div class="white-bordered-background">

            <div class="section has-text-centered">

                {#if error}
                    <Error>{error}</Error>
                {/if}

                {#if success}
                    <div class="section">
                        <p style="color: green">{success}</p>
                    </div>
                {/if}

                <div class="level is-mobile">
                    <div class="level-item">
                        <p 
                            on:click={() => section = 'challenges'}
                            class="section-element subtitle"
                            class:with-line={section === 'challenges'}
                        >Challenges</p>
                    </div>
                    <div class="level-item">
                        <p 
                            on:click={() => section = 'vs'}
                            class="section-element subtitle"
                            class:with-line={section === 'vs'}
                        >VS</p>
                    </div>
                </div>
            </div>

            {#if section === 'challenges'}
                {#await challengesRequest}
                    <h1 class="title has-text-centered">Serching existing challenges...</h1>
                {:then categories}
                    {#if categories.length > 0}
                        <div class="has-text-centered small-section">
                            <div class="section">
                                <div class="columns wrap is-mobile is-centered">
                                    <div class="column is-10 category tournament">
                                        <div class="level is-mobile">
                                            <div class="level-item">
                                                <img src="/icons/badges/attribute.svg" alt="Tournament Icon">
                                            </div>
                                            <div class="level-item">
                                                <h1 class="subtitle">Tournaments</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column is-10">
                                        <h1 class="subtitle"><b>Come earn prizes!</b></h1>
                                    </div>
                                </div>
                            </div>
                            <div class="columns is-mobile wrap is-centered">
                                {#each categories as category}
                                    <div class="column is-5" on:click={() => goto('/challenges/' + category.name)}>
                                        <div class="category" style="background-color: {category.color}">
                                            {#if category.icon}
                                                <img width="100px" src="{category.icon}" alt="Category Icon">
                                            {:else}
                                                <h1 class="subtitle">{category.name}</h1>
                                            {/if}
                                        </div>
                                        <h1 class="subtitle"><b>{category.name}</b></h1>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {:else}
                        <h1 class="title">There are no challenges yet :(</h1>
                    {/if}
                {:catch e}
                    <Error>Something wrong happened when we tried to get challenges. Retry later.</Error> 
                {/await}
            {/if}

        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}