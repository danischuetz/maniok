<script lang="ts">
    import { getContext } from 'svelte'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'

    interface Props {
        class?: string
        html?: string
    }

    let { class: className, html }: Props = $props()

    let navigationContext: NavigationContextModel = $derived(getContext('navigationContext'))

    $effect(() => {
        // Trigger recalculation of active heading when html changes
        html
        navigationContext.mode

        const observedHeadings: HTMLElement[] = Array.from(
            document.querySelectorAll('[id]')
        ) as HTMLElement[]

        let intersectingHeadingIds: Set<string> = $state(new Set())

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) intersectingHeadingIds.add(entry.target.id)
                else intersectingHeadingIds.delete(entry.target.id)
            }

            navigationContext.activeHeadingId =
                intersectingHeadingIds.size > 0
                    ? observedHeadings
                          .map((el) => el.id)
                          .find((id) => intersectingHeadingIds.has(id))
                    : undefined
        })

        observedHeadings.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    })
</script>

<ModeWrapper mode={ModeEnum.Documentation}>
    {#if !html}
        <p>No content available.</p>
    {:else}
        <article class="markdown-body w-full min-h-full overflow-y-auto {className}">
            {@html html}
        </article>
    {/if}
</ModeWrapper>
