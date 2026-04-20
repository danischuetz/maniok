<script lang="ts">
    import { Heart } from 'lucide-svelte'

    let liked = $state(false)

    $effect(() => {
        liked = localStorage.getItem('liked') === 'true'
    })

    function like() {
        if (!liked) {
            import('@plausible-analytics/tracker').then(({ track }) => {
                track('like', {})
            })
        }
        liked = true
        localStorage.setItem('liked', liked.toString())
    }
</script>

<button class="btn pr-0 flex items-center rounded-full" onclick={like}>
    <span class="text-surface-400 hidden md:block">
        {liked ? 'Thank you!' : "I'd use a production-ready version of this!"}
    </span>
    <Heart class="size-8 fill-primary-500 stroke-primary-500" />
</button>
