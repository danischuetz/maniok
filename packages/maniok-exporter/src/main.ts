import { Watcher } from './watcher.js'
import { Exporter } from './exporter.js'

async function main() {
    const workspaceDirectory: string = process.env.WORKSPACE_PATH ?? ''

    if (!workspaceDirectory) {
        console.error(
            'WORKSPACE_PATH environment variable is not set. Please set it to the path of the workspace directory.'
        )
        process.exit(1)
    }

    const watcher = new Watcher()
    const exporter = new Exporter()
    watcher.onChange = () =>
        exporter.exportWorkspace(workspaceDirectory).catch((err) => {
            console.error(err)
        })

    console.log('Performing initial workspace export...')
    exporter.exportWorkspace(workspaceDirectory).catch((err) => {
        console.error(err)
    })

    console.log(`Watching workspace directory: ${workspaceDirectory}`)
    await watcher.watchFileOrDirectory(workspaceDirectory, 'workspace.json')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
