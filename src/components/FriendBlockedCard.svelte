<script>

    import { createEventDispatcher } from 'svelte';
    import { user } from '../stores';
    import axios from 'axios';

    export let friend;

    const dispatch = createEventDispatcher();

    let modalIsVisible = false;

    async function unblockFriend() {
        modalIsVisible = false;
        axios.post('/api/users/friends/unblock', { user: $user._id, friend: friend._id })
            .then(({ data }) => {
                $user.friends = data.friends;
                $user.blocked_friends = data.blocked_friends;
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
            </div>
        </div>
    </div>
    <div class="level-right">
        <button on:click={unblockFriend} class="button is-rounded is-outlined level-item">Unblock</button>
    </div>
</div>