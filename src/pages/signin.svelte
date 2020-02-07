<script>

    import axios from 'axios';
    import { user as currentUser } from '../stores';
    import { isEmpty, goto } from '../clientUtils';

    import Navbar from '../components/Navbar.svelte';
    import Error from '../components/Error.svelte';

    let error;

    const user = {
        email: '',
        password: ''
    }

    async function signin() {
        error = undefined;
        if (!isEmpty(user.email) && !isEmpty(user.password)) {
            axios.post('/api/users/signin', user)
                .then(({ data }) => {
                    $currentUser = data;
                    goto('/');
                })
                .catch(err => error = 'Wrong email or password');
        } else {
            error = 'Be careful, a field is empty!';
        }
    }

</script>

<style>
    .signin-button {
        background-color: #80BB9A;
        color: white;
        width: 122pt;
        height: 40pt;
        transform: scale(1, 1.1);
        text-align: center;
        line-height: 0px;
        font-size: 25px;
        border-radius: 10px;
    }
</style>

{#if isEmpty($currentUser)}
    <Navbar>
        <div class="container has-text-centered">
            <img src="/images/logo_coq.svg" alt="Coq Sportif Logo">
            <div class="section">

                {#if error}
                    <Error>{error}</Error>
                {/if}

                <form on:submit|preventDefault={signin}>
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
                        <label class="label" for="password">Password</label>
                        <div class="control has-icons-right">
                            <input class="input" type="password" id="password" placeholder="Your password" bind:value={user.password} />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="section">
                        <button class="button signin-button" type="submit">Signin</button>
                    </div>
                </form>

            </div>
        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}