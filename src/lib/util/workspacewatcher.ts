import { invalidate } from '$app/navigation'

export class WorkspaceWatcher {
    private interval: ReturnType<typeof setInterval> | undefined = undefined

    destructor() {
        this.stopWatching()
    }

    public startWatching() {
        this.interval = setInterval(async () => {
            const res = await fetch('/api/watcher')
            const { hasChanged } = await res.json()
            if (hasChanged) {
                await invalidate('workspace:reload')
            }
        }, 200)
    }

    public stopWatching() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined
        }
    }
}
