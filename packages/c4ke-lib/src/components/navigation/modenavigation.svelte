<script lang="ts">
    import { Workflow } from 'lucide-svelte'
    import { BookOpenText } from 'lucide-svelte'
    import { getContext } from 'svelte'
    import { Mode, type ModeContext } from '../../model/navigation/mode'

    interface Props {
        class?: string
    }

    let { class: className }: Props = $props()

    let modeContext: ModeContext = getContext('mode')

    const icons: Record<Mode, any> = {
        [Mode.Diagrams]: Workflow,
        [Mode.Documentation]: BookOpenText
    }

    function switchTo(newMode: Mode) {
        if (newMode !== modeContext.mode) {
            modeContext.mode = newMode
        }
    }
</script>

<ul class="flex flex-col mode-nav-container {className}">
    {#each Object.values(Mode) as mode}
        {@const Icon = icons[mode]}
        <li>
            <button
                onclick={() => switchTo(mode)}
                class="btn btn-nav flex items-center justify-center"
                title={mode}
            >
                <Icon class="lucide-icon-xl" />
            </button>
        </li>
    {/each}
</ul>
