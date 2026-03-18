<script lang="ts">
    import {
        DiagramProvider,
        Diagram,
        type SzrWorkspace,
        DiagramParser,
        type DiagramModel,
    } from "c4ke-lib"
    import { WorkspaceParser } from "c4ke-lib"
    import type { LayoutProps } from "./$types"

    let { data, children }: LayoutProps = $props()

    let workspace: SzrWorkspace = $derived(
        WorkspaceParser.parse(data.workspaceJson),
    )

    let diagrams: DiagramModel[] = $derived(DiagramParser.parse(workspace))
</script>

<DiagramProvider {diagrams}>
    <Diagram class="w-screen h-screen" />
</DiagramProvider>

<!-- {@render children()} -->
