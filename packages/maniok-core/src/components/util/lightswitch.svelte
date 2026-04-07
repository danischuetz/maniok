<script lang="ts">
    import { Sun, Moon } from 'lucide-svelte'

    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    let isLight = $state(false)

    $effect(() => {
        const mode =
            localStorage.getItem('mode') ??
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
        isLight = mode === 'light'
        document.documentElement.setAttribute('data-mode', mode)
    })

    function toggle() {
        isLight = !isLight
        const mode = isLight ? 'light' : 'dark'
        document.documentElement.setAttribute('data-mode', mode)
        localStorage.setItem('mode', mode)
    }
</script>

<button onclick={toggle}>
    {#if isLight}
        <Moon class={className} />
    {:else}
        <Sun class={className} />
    {/if}
</button>
