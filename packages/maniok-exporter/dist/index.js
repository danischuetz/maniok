import { Watcher } from './watcher';
import { spawn } from 'child_process';
import path from 'path';
const workspaceDirectory = process.env.STRUCTURIZR_WORKSPACE_PATH ?? '';
export async function exportWorkspace() {
    const dslFile = path.join(workspaceDirectory, 'workspace.dsl');
    return new Promise((resolve, reject) => {
        const child = spawn('structurizr', ['export', '-w', dslFile, '-f', 'json', '-o', workspaceDirectory], {
            stdio: ['ignore', 'pipe', 'pipe']
        });
        let stderr = '';
        let stdout = '';
        child.stdout.on('data', (d) => (stdout += d.toString()));
        child.stderr.on('data', (d) => (stderr += d.toString()));
        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout });
            }
            else {
                reject(new Error(`Structurizr export failed (${code})\n${stderr || stdout}`));
            }
        });
        child.on('error', reject);
    });
}
async function main() {
    if (!workspaceDirectory) {
        console.error('STRUCTURIZR_WORKSPACE_PATH environment variable is not set. Please set it to the path of the workspace directory.');
        process.exit(1);
    }
    const watcher = new Watcher();
    watcher.onChange = exportWorkspace;
    await watcher.watchDirectory(workspaceDirectory);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
