<script lang="ts">
    import { Popover, Portal } from '@skeletonlabs/skeleton-svelte'
    import { Ellipsis } from 'lucide-svelte'

    interface Props {
        class?: string
        repository: string
    }

    let { class: className = '', repository }: Props = $props()
</script>

<Popover positioning={{ placement: 'bottom-start' }}>
    <Popover.Trigger class="btn p-0 underline {className}">example:</Popover.Trigger>
    <Portal>
        <Popover.Positioner>
            <Popover.Content
                class="selectable-popup max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-auto p-4 flex flex-col items-start gap-4 z-41"
            >
                <span class="max-w-xs">
                    The documentation for these examples was AI-generated using the
                    <a
                        class="a underline"
                        href="https://github.com/danischuetz/maniok/blob/main/examples/maniok-architecture-prompt.md"
                        target="_blank"
                        rel="noreferrer">maniok-architecture-prompt.md</a
                    >
                    and is meant to give an example for C4 architecture documentation using Maniok.
                </span>
                <div class="flex flex-col items-start gap-1">
                    <p>Original repository URL:</p>
                    <a class="a underline" href={repository} target="_blank" rel="noreferrer"
                        >{repository}</a
                    >
                </div>
            </Popover.Content>
        </Popover.Positioner>
    </Portal>
</Popover>
