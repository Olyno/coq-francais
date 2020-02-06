<script>

    import { isEmpty } from '../clientUtils';
    import { user } from '../stores';

    import Navabar from '../components/Navbar.svelte';

</script>

<style>
    .signup-button {
        width: 122pt;
        height: 40pt;
        transform: scale(1, 1.1);
        text-align: center;
        line-height: 0px;
        font-size: 25px;
        border-radius: 10px;
    }
    .signin-button {
        width: 122pt;
        height: 40pt;
        transform: scale(1, 1.1);
        text-align: center;
        line-height: 0px;
        font-size: 25px;
        border-radius: 10px;
    }
    .philo-sentence {
        color: #562E8A;
    }
</style>

{#if isEmpty($user)}

    <div class="container has-text-centered">
        <div class="section">
            <img src="" alt="Coq Sportif Logo">
        </div>

        <div class="section">
            <img src="/images/Groupe_75.svg" alt="Young people">
        </div>

        <div class="small-section">
            <div class="level is-mobile">
                <div class="level-item">
                    <p>Not yet an account ?</p>
                </div>
                <div class="level-item"></div>
            </div>
            <a href="/signup" class="button purple-background signup-button">Signup</a>
        </div>

        <div class="small-section">
            <div class="level is-mobile">
                <div class="level-item">
                    <p>Already an account ?</p>
                </div>
                <div class="level-item"></div>
            </div>
            <a href="/signin" class="button green-background signin-button">Signin</a>
        </div>
    </div>

{:else}

    <Navabar user={$user}>
        <div class="has-text-centered white-bordered-background">
            <div class="section">
                <p class="philo-sentence">"The only person to get past is who you were yesterday."</p>
            </div>
            <div class="section">
                <img src="/images/Groupe_75.svg" alt="Athelete Image">
            </div>
        </div>
    </Navabar> 

{/if}