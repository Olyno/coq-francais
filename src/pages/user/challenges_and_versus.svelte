<script>

    import { isEmpty, goto } from '../../clientUtils';
    import { user } from '../../stores';
    import axios from 'axios';

    import Navbar from '../../components/Navbar.svelte';
    import Error from '../../components/Error.svelte';

    let error,
        success,
        section = 'challenges';

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

            

        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}