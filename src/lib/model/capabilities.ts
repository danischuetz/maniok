export type Capabilities = {
    urlSelection: boolean
    likeButton: boolean
    workspaceWatcher: boolean
}

export const defaultCapabilities: Capabilities = {
    urlSelection: true,
    likeButton: true,
    workspaceWatcher: true
}
