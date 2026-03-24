<script lang="ts">
    import { Workflow } from 'lucide-svelte'
    import { BookOpenText } from 'lucide-svelte'

    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    interface SwitcherItem {
        label: string
        icon: any
    }

    const items: SwitcherItem[] = [
        { label: 'Diagrams', icon: Workflow },
        { label: 'Documentation', icon: BookOpenText }
    ]
</script>

<nav class="flex flex-col {className}">
    <ul>
        {#each items as item}
            <li>
                <button class="btn flex items-center justify-center" title={item.label}>
                    <item.icon class="lucide-icon-xl" />
                </button>
            </li>
        {/each}
    </ul>
</nav>
