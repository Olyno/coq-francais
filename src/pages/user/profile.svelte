<script>

    import { isEmpty, goto } from '../../clientUtils';
    import { user as currentUser } from '../../stores';
    import axios from 'axios';

    import FriendCard from '../../components/FriendCard.svelte';
    import FriendPendingCard from '../../components/FriendPendingCard.svelte';
    import FriendBlockedCard from '../../components/FriendBlockedCard.svelte';
    import Navbar from '../../components/Navbar.svelte';
    import Error from '../../components/Error.svelte';

    let error,
        success,
        searchingUser = '',
        section = 'informations';
    
    const user = {
        username: $currentUser.public.username,
        email: $currentUser.email,
        sexe: $currentUser.sexe,
        birthdate: $currentUser.birthdate,
        club: $currentUser.club,
        avatar: $currentUser.public.avatar
    }

    async function editInformations() {
        error = undefined;
        axios.post('/api/users/edit', { user: $currentUser._id, ...user })
            .then(({ data }) => {
                $currentUser = data;
            })
            .catch(err => error = 'An informations seems wrong. Please have a look in!')
    }

</script>

<style>
    .signin-button {
        background-color: #80BB9A;
        color: white;
        width: 160pt;
        height: 40pt;
        transform: scale(1, 1.1);
        text-align: center;
        line-height: 0px;
        font-size: 25px;
        border-radius: 10px;
    }
</style>

{#if !isEmpty($currentUser)}
    <Navbar user={$currentUser}>
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
                            on:click={() => section = 'informations'}
                            class="section-element subtitle"
                            class:with-line={section === 'informations'}
                        >Informations</p>
                    </div>
                    <div class="level-item">
                        <p 
                            on:click={() => section = 'stats'}
                            class="section-element subtitle"
                            class:with-line={section === 'stats'}
                        >Stats</p>
                    </div>
                    <div class="level-item">
                        <p 
                            on:click={() => section = 'success'}
                            class="section-element subtitle"
                            class:with-line={section === 'success'}
                        >Success</p>
                    </div>
                </div>
            </div>

            <div class="small-section has-text-centered">

                {#if section === 'informations'}
                    <form on:submit|preventDefault={editInformations}>
                        <div class="field">
                            <label class="label" for="username">Username</label>
                            <div class="control has-icons-right">
                                <input class="input" type="text" id="username" placeholder="Your username" bind:value={user.username} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="email">Email</label>
                            <div class="control has-icons-right">
                                <input class="input" type="email" id="email" placeholder="Your email" bind:value={user.email} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="avatar">Avatar</label>
                            <div class="control has-icons-right">
                                <input class="input" type="text" id="avatar" placeholder="Your avatar" bind:value={user.avatar} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="sex">Sex</label>
                            <div class="control has-icons-right">
                                <input class="input" type="text" id="sex" placeholder="Your gender" bind:value={user.sexe} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="birthdate">Birthdate</label>
                            <div class="control has-icons-right">
                                <input class="input" type="date" id="birthdate" placeholder="Your birthdate" bind:value={user.birthdate} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="club">Club (optionnal)</label>
                            <div class="control has-icons-right">
                                <input class="input" type="text" id="club" placeholder="If you are in a sportive club" bind:value={user.club} />
                                <span class="icon is-small is-right">
                                    <img src="/icons/pencil.svg" alt="Pencil Icon">
                                </span>
                            </div>
                        </div>
                        <div class="section">
                            <button class="button signin-button" type="submit">Edit informations</button>
                        </div>
                    </form>
                {:else if section === 'success'}
                    {#if $currentUser.public.badges.length > 0}
                        <div class="columns wrap has-text-centered">
							{#each $currentUser.public.badges as badge}
								<div class="column is-3">
									<img src="{badge.icon}" alt="{badge.icon} Icon">
								</div>
							{/each}
                        </div>
                    {:else}
                        <div class="has-text-centered">
                            <h1 class="title">You don't have any badge yet</h1>
                        </div>
                    {/if}
                {/if}

            </div>

        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}