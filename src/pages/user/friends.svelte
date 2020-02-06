<script>

    import { isEmpty, goto } from '../../clientUtils';
    import { user } from '../../stores';
    import axios from 'axios';

    import FriendCard from '../../components/FriendCard.svelte';
    import FriendPendingCard from '../../components/FriendPendingCard.svelte';
    import FriendBlockedCard from '../../components/FriendBlockedCard.svelte';
    import Navbar from '../../components/Navbar.svelte';
    import Error from '../../components/Error.svelte';

    let error,
        success,
        searchingUser = '',
        section = 'friends';

    axios.post('/api/users/friends', { user: $user._id })
        .then(({ data }) => {
            $user.friends = data;
        })
        .catch(err => error = 'You don\'t have any friend yet')

    axios.post('/api/users/friends/pending', { user: $user._id })
        .then(({ data }) => {
            $user.pending_friends = data;
        })
        .catch(err => error = 'You don\'t have any pending friend yet')

    axios.post('/api/users/friends/blocked', { user: $user._id })
        .then(({ data }) => {
            $user.blocked_friends = data;
        })
        .catch(err => error = 'You don\'t have any blocked friend yet')

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
    .global-separator {
        border-bottom: solid #562E8A !important;
        width: 5px;
        height: 3px;
    }
    .search-input {
        width: 200px !important;
        border-bottom: solid #562E8A !important;
    }
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
                            on:click={() => section = 'friends'}
                            class="section-element subtitle"
                            class:with-line={section === 'friends'}
                        >Friends</p>
                    </div>
                    <div class="level-item">
                        <p 
                            on:click={() => section = 'blocked_friends'}
                            class="section-element subtitle"
                            class:with-line={section === 'blocked_friends'}
                        >Blocked</p>
                    </div>
                </div>
            </div>

            <div class="field is-grouped is-grouped-centered">
                <img on:click={askFriend} class="control" src="/icons/search.svg" alt="Search Icon">
                <input bind:value={searchingUser} class="input control search-input" type="text" placeholder="Search a user...">
            </div>

            <div class="section">

                {#if section === 'friends'}
                    {#if $user.pending_friends && $user.pending_friends.length > 0}
                        {#each $user.pending_friends as friend}
                            <FriendPendingCard {friend} on:error={(e) => error = e.details} />
                        {/each}
                        <div class="global-separator"></div>
                    {/if}
                    {#if $user.friends && $user.friends.length > 0}
                        {#each $user.friends as friend}
                            <FriendCard {friend} on:error={(e) => error = e.details} />
                        {/each}
                    {:else}
                        <div class="has-text-centered">
                            <h1 class="title">You don't have any friend yet</h1>
                        </div>
                    {/if}
                {:else if section === 'blocked_friends'}
                    {#if $user.blocked_friends && $user.blocked_friends.length > 0}
                        {#each $user.blocked_friends as friend}
                            <FriendBlockedCard {friend} on:error={(e) => error = e.details} />
                        {/each}
                    {:else}
                        <div class="has-text-centered">
                            <h1 class="title">You don't have any blocked friend yet</h1>
                        </div>
                    {/if}
                {/if}

            </div>

        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}