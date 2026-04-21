import chokidar from 'chokidar'

export class Watcher {
    onChange: () => void = () => {}

    async watchFileOrDirectory(path: string, fileToIgnore: string = '') {
        const watcher = chokidar.watch(path, {
            ignoreInitial: true,
            ignored: (path, stats) => {
                if (!fileToIgnore) return false
                return path.includes(fileToIgnore)
            }
        })

        for (const signal of ['SIGTERM', 'SIGINT']) {
            process.on(signal, async () => {
                await watcher.close()
            })
        }

        watcher.on('change', () => this.onChange())
        watcher.on('add', () => this.onChange())
        watcher.on('unlink', () => this.onChange())

        await new Promise((resolve) => {
            watcher.on('close', resolve)
        })
    }
}
