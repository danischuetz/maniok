import type { SelectableModel } from '$lib/model/selectable'
import { type Writable, writable } from 'svelte/store'
import { goto, onNavigate } from '$app/navigation'
import { page } from '$app/state'

export const examples: SelectableModel[] = [
    {
        id: 'bitcoin',
        title: 'Bitcoin',
        value: 'https://github.com/bitcoin/bitcoin'
    },
    {
        id: 'linux',
        title: 'Linux Kernel',
        value: 'https://github.com/torvalds/linux'
    },
    {
        id: 'paperless-ngx',
        title: 'Paperless-ngx',
        value: 'https://github.com/paperless-ngx/paperless-ngx'
    },
    {
        id: 'vscode',
        title: 'Visual Studio Code',
        value: 'https://github.com/microsoft/vscode'
    }
]

export const selectedExample: Writable<SelectableModel | undefined> = writable(undefined)

selectedExample.subscribe((example) => {
    if (!example) return
    if (example.id !== page.params.id) {
        goto(`/examples/${example.id}`, { replaceState: true })
    }
})

export function selectFromId(id: string) {
    const example = examples.find((e) => e.id === id)
    if (example) {
        selectedExample.set(example)
    } else {
        selectedExample.set(undefined)
    }
}
