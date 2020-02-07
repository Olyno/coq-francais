<script>

    import axios from 'axios';
    import { user as currentUser } from '../stores';
    import { isEmpty, goto } from '../clientUtils';

    import Navbar from '../components/Navbar.svelte';
    import Error from '../components/Error.svelte';

    let error;

    const user = {
        username: '',
        email: '',
        password: '',
        repeatPassword: '',
        sex: '',
        birthdate: Date.now(),
        club: ''
    }

    async function signup() {
        error = undefined;
        Object.keys(user).forEach(key => {
            if (key !== 'club' && isEmpty(user[key])) {
                error = 'A field is missing: ' + key;
            }
        })
        if (!error) {
            axios.post('/api/users/signup', user)
                .then(({ data }) => {
                    Cookies.set('user', data);
                    goto('/');
                })
                .catch(err => error = 'Some informations seem incorrect, please check them');
        }
    }

</script>

<style>
    .signup-button {
        background-color: #562E8A;
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

                <form on:submit|preventDefault={signup}>
                    <div class="field">
                        <label class="label" for="username">Username</label>
                        <div class="control has-icons-right">
                            <input class="input" type="text" id="username" placeholder="Your username" bind:value={user.username} required />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="email">Email</label>
                        <div class="control has-icons-right">
                            <input class="input" type="email" id="email" placeholder="Your email" bind:value={user.email} required />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="password">Password</label>
                        <div class="control has-icons-right">
                            <input class="input" type="password" id="password" placeholder="Your password" bind:value={user.password} required />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="repeat_password">Repeat Password</label>
                        <div class="control has-icons-right">
                            <input class="input" type="password" id="repeat_password" placeholder="Repeat your password" bind:value={user.repeatPassword} required />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="sex">Sex</label>
                        <div class="control has-icons-right">
                            <input class="input" type="text" id="sex" placeholder="Your gender" bind:value={user.sex} required />
                            <span class="icon is-small is-right">
                                <img src="/icons/pencil.svg" alt="Pencil Icon">
                            </span>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label" for="birthdate">Birthdate</label>
                        <div class="control has-icons-right">
                            <input class="input" type="date" id="birthdate" placeholder="Your birthdate" bind:value={user.birthdate} required />
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
                        <button class="button signup-button" type="submit">Signup</button>
                    </div>
                </form>

            </div>
        </div>
    </Navbar>
{:else}
    {goto('/')}
{/if}