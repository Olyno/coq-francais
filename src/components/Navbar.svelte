<script>

    import { goto, isEmpty } from '../clientUtils';
    import { user } from '../stores';
    import Cookies from 'js-cookie';

    import Burger from './Burger.svelte';

    export let isBackButton;

    let menuIsVisible = false;

    async function logout() {
        $user = {};
        Cookies.remove('user');
        goto('/');
    }

</script>

<style>
    .chevron {
        height: 50px;
        width: 50px;
    }
    .logo {
        height: 50px;
        width: 50px;
    }
</style>

{#if !isEmpty($user)}

    <div class="section">
        <div class="level is-mobile has-text-centered">
            <div class="level-item">
                <Burger bind:menuIsVisible={menuIsVisible} bind:isBackButton={isBackButton} />
            </div>
            <div class="level-item">
                <div class="level">
                    <img class="logo level-item" src="/icons/coq.svg" alt="Coq Sportif Logo">
                    <div class="level-item">
                        <div>
                            <h1 class="subtitle">{$user.public.username}</h1>
                            <h1 class="subtitle">{$user.public.points}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level-item" on:click={() => goto('/user/profile')}>
                <img class="avatar" src="{$user.public.avatar}" alt="User avatar">
            </div>
        </div>
    </div>

    {#if menuIsVisible}
        <div class="green-background container section">

            <!-- Home -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/')}>
                    <div class="level-item">
                        <img src="/icons/burger/home.svg" alt="Home Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">Home</h1>
                    </div>
                </div>
            </div>

            <!-- Profile -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/user/profile')}>
                    <div class="level-item">
                        <img src="/icons/burger/profile.svg" alt="Profile Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">Profile</h1>
                    </div>
                </div>
            </div>

            <!-- Messages -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/user/messages')}>
                    <div class="level-item">
                        <img src="/icons/burger/message.svg" alt="Messages Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">Messages</h1>
                    </div>
                </div>
            </div>

            <!-- Friends -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/user/friends')}>
                    <div class="level-item">
                        <img src="/icons/burger/friends.svg" alt="Friends Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">Friends</h1>
                    </div>
                </div>
            </div>

            <!-- Versus -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/user/challenges_and_versus')}>
                    <div class="level-item">
                        <img src="/icons/burger/vs.svg" alt="Versus Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">VS and Challenges</h1>
                    </div>
                </div>
            </div>

            <!-- Location -->
            <div class="level is-mobile">
                <div class="level-left" on:click={() => goto('/location')}>
                    <div class="level-item">
                        <img src="/icons/burger/location.svg" alt="Location Icon">
                    </div>
                    <div class="level-item">
                        <h1 class="title is-white">Location</h1>
                    </div>
                </div>
            </div>

            <div class="is-bottom section">
                <div class="level is-mobile">
                    <div class="level-item">
                        <div class="level is-mobile" on:click={() => goto('/parameters')}>
                            <div class="level-item">
                                <img src="/icons/burger/gear.svg" alt="Parameters Icon">
                            </div>
                            <div class="level-item">
                                <h1 class="subtitle is-white">Parameters</h1>
                            </div>
                        </div>
                    </div>
                    <div class="level-item">
                        <div class="vertical-line"></div>
                    </div>
                    <div class="level-item">
                        <h1 on:click={logout} class="subtitle is-white">Logout</h1>
                    </div>
                </div>
            </div>

        </div>
    {:else}
        <slot></slot>
    {/if}

{:else}
    <div class="container">
        <div class="section">
            <div class="level is-mobile">
                <div class="level-left">
                    <div class="level-item">
                        <a href="/">
                            <img class="chevron" src="/icons/chevron-left.svg" alt="Chevron Icon">
                        </a>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">.</div>
                </div>
            </div>
        </div>
    </div>
    <slot></slot>
{/if}