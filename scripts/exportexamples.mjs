import { mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const sourceDir = resolve(projectRoot, '.maniok')
const targetZip = resolve(projectRoot, 'examples', 'maniokdocs.zip')

await mkdir(dirname(targetZip), { recursive: true })
await rm(targetZip, { force: true })

await new Promise((resolvePromise, rejectPromise) => {
    const zip = spawn('zip', ['-r', targetZip, sourceDir], {
        cwd: projectRoot,
        stdio: 'inherit'
    })

    zip.on('error', rejectPromise)
    zip.on('close', (code) => {
        if (code === 0) {
            resolvePromise()
            return
        }

        rejectPromise(new Error(`zip exited with code ${code}`))
    })
})
