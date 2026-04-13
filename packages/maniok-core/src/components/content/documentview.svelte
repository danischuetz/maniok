<script lang="ts">
    import { getContext } from 'svelte'
    import { mount, unmount } from 'svelte'
    import {
        ModeEnum,
        type DocumentationContextModel
    } from '../../model/documentation/documentationcontext'
    import ModeWrapper from '../internal/mode/modewrapper.svelte'
    import Diagram from '../internal/diagram/diagram.svelte'
    import DocumentNextPrevious from '../navigation/documentnextprevious.svelte'

    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()
    let articleElement: HTMLElement | undefined = $state()

    let documentationContext: DocumentationContextModel = $derived(
        getContext('documentationContext')
    )

    $effect(() => {
        const html: string | undefined = documentationContext.content?.html
        if (!articleElement || !html) return

        const mountedDiagrams: Array<ReturnType<typeof mount>> = []
        const placeholders = articleElement.querySelectorAll<HTMLElement>(
            'diagram-embed[data-diagram-key]'
        )

        for (const placeholder of placeholders) {
            const diagramKey = placeholder.getAttribute('data-diagram-key')
            if (!diagramKey) continue

            const diagram = documentationContext.diagrams?.find(
                (candidate) => candidate.id === diagramKey
            )
            if (!diagram) {
                placeholder.textContent = `Diagram \"${diagramKey}\" not found`
                continue
            }

            placeholder.classList.add('block', 'w-full', 'h-full')
            mountedDiagrams.push(
                mount(Diagram, {
                    target: placeholder,
                    props: {
                        diagram,
                        class: 'w-full h-full',
                        fitViewPort: true
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
        documentationContext.content
        documentationContext.mode

        const observedHeadings: HTMLElement[] = Array.from(
            articleElement?.querySelectorAll('[id]') ?? []
        ) as HTMLElement[]

        let intersectingHeadingIds: Set<string> = $state(new Set())

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) intersectingHeadingIds.add(entry.target.id)
                else intersectingHeadingIds.delete(entry.target.id)
            }

            documentationContext.activeHeadingId =
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
    {#if !documentationContext.content}
        <p>No content available.</p>
    {:else}
        <div class="flex flex-col">
            <article bind:this={articleElement} class="flex-1 markdown-body min-h-full {className}">
                {@html documentationContext.content!.html}
            </article>
            <DocumentNextPrevious />
        </div>
    {/if}
</ModeWrapper>
