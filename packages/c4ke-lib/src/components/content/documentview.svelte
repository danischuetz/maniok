<script lang="ts">
    import { getContext } from 'svelte'
    import { mount, unmount } from 'svelte'
    import type { DiagramModel } from '../../model/diagram/diagrammodel'
    import { ModeEnum, type NavigationContextModel } from '../../model/navigation/navigationcontext'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    import Diagram from '../internal/diagram/diagram.svelte'

    interface Props {
        class?: string
        html?: string
        diagrams?: DiagramModel[]
    }

    let { class: className, html, diagrams = [] }: Props = $props()
    let articleElement: HTMLElement | undefined = $state()

    let navigationContext: NavigationContextModel = $derived(getContext('navigationContext'))

    $effect(() => {
        html
        diagrams

        if (!articleElement || !html) return

        const mountedDiagrams: Array<ReturnType<typeof mount>> = []
        const placeholders = articleElement.querySelectorAll('diagram-embed[data-diagram-key]')

        for (const placeholder of placeholders) {
            const diagramKey = placeholder.getAttribute('data-diagram-key')
            if (!diagramKey) continue

            const diagram = diagrams.find((candidate) => candidate.id === diagramKey)
            if (!diagram) {
                placeholder.textContent = `Diagram \"${diagramKey}\" not found`
                continue
            }

            placeholder.classList.add('block', 'w-full', 'h-96', 'my-4')
            mountedDiagrams.push(
                mount(Diagram, {
                    target: placeholder,
                    props: {
                        diagram,
                        class: 'w-full h-full',
                        disableModeWrapper: true
                    }
                })
            )
        }

        return () => {
            mountedDiagrams.forEach((component) => unmount(component))
        }
    })

    $effect(() => {
        // Trigger recalculation of active heading when html changes
        html
        navigationContext.mode

        const observedHeadings: HTMLElement[] = Array.from(
            articleElement?.querySelectorAll('[id]') ?? []
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
        <article bind:this={articleElement} class="markdown-body w-full min-h-full {className}">
            {@html html}
        </article>
    {/if}
</ModeWrapper>
