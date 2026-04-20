import { Watcher } from 'maniok-exporter'

const watcher: Watcher = new Watcher()
let hasChanged: boolean = false
watcher.onChange = async () => {
    hasChanged = true
}
if (process.env.WORKSPACE_PATH) {
    watcher.watchDirectory(process.env.WORKSPACE_PATH)
} else {
    console.warn('WORKSPACE_PATH environment variable is not set, nothing to watch.')
}

export function GET() {
    const changed: boolean = hasChanged
    hasChanged = false
    return new Response(JSON.stringify({ hasChanged: changed }), {
        headers: { 'content-type': 'application/json' }
    })
}
