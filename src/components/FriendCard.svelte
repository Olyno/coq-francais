<script>

    import { createEventDispatcher } from 'svelte';
    import { user } from '../stores';
    import axios from 'axios';

    export let friend;

    const dispatch = createEventDispatcher();

    let modalIsVisible = false;

    async function removeFriend() {
        modalIsVisible = false;
        axios.post('/api/users/friends/remove', { user: $user._id, friend: friend._id })
            .then(({ data }) => {
                $user.friends = data;
            })
            .catch(err => dispatch('error', err));
    }

    async function blockFriend() {
        modalIsVisible = false;
        axios.post('/api/users/friends/block', { user: $user._id, friend: friend._id })
            .then(({ data }) => {
                $user.friends = data.friends;
                $user.blocked_friends = data.blocked_friends;
            })
            .catch(err => dispatch('error', err));
    }

</script>

<style>
    .separator {
        border-bottom-color: grey;
        width: 1px;
    }
</style>

<div class="level is-mobile">
    <div class="level-left">
        <div class="level-item">
            <img class="avatar" src="{friend.avatar}" alt="Friend avatar">
        </div>
        <div class="level-item">
            <div>
                <h1 class="subtitle">{friend.username}</h1>
                <p>{friend.points}</p>
            </div>
        </div>
    </div>
    <div class="level-right">
        <div class="level-item">
            <img src="/icons/vs.svg" alt="Versus Icon">
        </div>
        <div class="level-item" on:click={() => modalIsVisible = true}>
            <img class="trash" src="/icons/trash-2.svg" alt="Trash Icon">
        </div>
    </div>
</div>

<div class="container is-fullhd separator"></div>

<div class="modal is-clipped" class:is-active={modalIsVisible}>
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="card">
            <div class="card-header">
                <p class="card-header-title">Remove a friend</p>
                <button class="card-header-icon delete" on:click={() => modalIsVisible = false}></button>
            </div>
            <div class="card-content">
                <p>Are you sure to remove {friend.username} from your list of friends?</p>
            </div>
            <div class="card-footer">
                <button on:click={blockFriend} class="card-footer-item button is-danger">Block</button>
                <button on:click={removeFriend} class="card-footer-item button is-danger">Remove</button>
            </div>
        </div>
    </div>
</div>