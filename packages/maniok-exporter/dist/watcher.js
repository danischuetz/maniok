import chokidar from 'chokidar';
export class Watcher {
    onChange = () => { };
    async watchDirectory(path) {
        const watcher = chokidar.watch(path, {
            ignoreInitial: true,
            ignored: /\.json$/,
            awaitWriteFinish: { stabilityThreshold: 300 }
        });
        for (const signal of ['SIGTERM', 'SIGINT']) {
            process.on(signal, async () => {
                await watcher.close();
            });
        }
        watcher.on('change', () => this.onChange());
        watcher.on('add', () => this.onChange());
        watcher.on('unlink', () => this.onChange());
        await new Promise((resolve) => {
            watcher.on('close', resolve);
        });
    }
}
