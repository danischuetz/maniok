import chokidar from 'chokidar'

export class Watcher {
    onChange: () => void = () => {}

    async watchDirectory(path: string) {
        const watcher = chokidar.watch(path, {
            ignoreInitial: true,
            awaitWriteFinish: { stabilityThreshold: 300 }
        })

        for (const signal of ['SIGTERM', 'SIGINT']) {
            process.on(signal, async () => {
                await watcher.close()
            })
        }

        watcher.on('change', (path) => this.onChange())
        watcher.on('add', (path) => this.onChange())
        watcher.on('unlink', (path) => this.onChange())

        await new Promise((resolve) => {
            watcher.on('close', resolve)
        })
    }
}
