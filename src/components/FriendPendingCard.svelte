<script>

    import { createEventDispatcher } from 'svelte';
    import { user } from '../stores';
    import axios from 'axios';

    export let friend;

    const dispatch = createEventDispatcher();

    let modalIsVisible = false;

    async function acceptFriend() {
        modalIsVisible = false;
        axios.post('/api/users/friends/accept', { user: $user._id, friend: friend._id })
            .then(({ data }) => {
                $user.friends = data.friends;
                $user.pending_friends = data.pending_friends;
            })
            .catch(err => dispatch('error', err));
    }

    async function declineFriend() {
        modalIsVisible = false;
        axios.post('/api/users/friends/decline', { user: $user._id, friend: friend._id })
            .then(({ data }) => {
                $user.friends = data.friends;
                $user.pending_friends = data.pending_friends;
            })
            .catch(err => dispatch('error', err));
    }

</script>

<style>
    .separator {
        border-top-color: grey;
        width: 1px;
    }
</style>

<div class="container is-fullhd separator"></div>

<div class="level is-mobile">
    <div class="level-left">
        <div class="level-item">
            <img class="avatar" src="{friend.avatar}" alt="Friend avatar">
        </div>
        <div class="level-item">
            <div>
                <h1 class="subtitle">{friend.username}</h1>
                <div class="level is-mobile">
                    <div class="level-left">
                        <button on:click={acceptFriend} class="button is-success is-rounded is-outlined level-item">Accept</button>
                        <button on:click={declineFriend} class="button is-danger is-rounded is-outlined level-item">Decline</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>