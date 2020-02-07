<script>

    export let menuIsVisible;
    export let isBackButton;

</script>

<style>
    .line {
        margin-top: -37px;
        width: 35px;
        height: 47px;
        border-bottom: 1px solid black;
    }
    .cross {
        width: 35px;
    }
</style>

{#if isBackButton}
    <div on:click={() => isBackButton = undefined}>
        <img class="chevron" src="/icons/chevron-left.svg" alt="Chevron Icon" />
    </div>
{:else}
    {#if !menuIsVisible}
        <div on:click={() => menuIsVisible = true}>
            <div class="line"></div>
            <div class="line"></div>
        </div>
    {:else}
        <div on:click={() => menuIsVisible = false}>
            <img class="cross" src="/icons/x.svg" alt="Cross of Burger">
        </div>
    {/if}
{/if}