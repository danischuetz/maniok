import path from 'path'
import { spawn } from 'child_process'

export class Exporter {
    async exportWorkspace(workspaceDirectory: string) {
        const dslFile = path.join(workspaceDirectory, 'workspace.dsl')

        return new Promise((resolve, reject) => {
            console.log('Exporting workspace...')

            const child = spawn(
                'java',
                [
                    '-jar',
                    '--enable-native-access=ALL-UNNAMED',
                    '/usr/local/structurizr.war',
                    'export',
                    '-w',
                    dslFile,
                    '-f',
                    'json',
                    '-o',
                    workspaceDirectory
                ],
                {
                    stdio: ['ignore', 'pipe', 'pipe']
                }
            )

            let stderr = ''
            let stdout = ''

            child.stdout.on('data', (d) => (stdout += d.toString()))
            child.stderr.on('data', (d) => (stderr += d.toString()))

            child.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout })
                } else {
                    reject(new Error(`Structurizr export failed (${code})\n${stderr || stdout}`))
                }
            })

            child.on('error', reject)
        })
    }
}
