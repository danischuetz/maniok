import { type RepositoryModel } from '../model/repository/repository'

export class RepositoryService {
    static async deriveFromUrl(url: string): Promise<RepositoryModel | null> {
        const githubMatch = url.match(
            /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/
        )
        if (githubMatch) {
            // Test if this is a valid GitHub repository
            const [, owner, repo] = githubMatch
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
            if (response.status !== 200) return null
            return {
                provider: 'github',
                url: `${owner}/${repo}`
            }
        }
        return null
    }

    static toUrl(repository: RepositoryModel): string {
        switch (repository.provider) {
            case 'github':
                return `https://github.com/${repository.url}`
            default:
                throw new Error(`Unsupported repository provider: ${repository.provider}`)
        }
    }

    static encode(repository: RepositoryModel): string {
        return btoa(this.stringify(repository))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }

    static decode(encoded: string): RepositoryModel {
        const raw = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'))
        return this.parse(raw)
    }

    static async loadResource(repository: RepositoryModel, path: string): Promise<string> {
        if (repository.provider === 'github') {
            const url = `https://raw.githubusercontent.com/${repository.url}/HEAD/${path}`
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error(`Failed to load resource from ${url}: ${res.statusText}`)
            }
            return res.text()
        } else {
            return Promise.reject(
                new Error(`Unsupported repository provider: ${repository.provider}`)
            )
        }
    }

    private static stringify(repository: RepositoryModel): string {
        return `${repository.provider}:${repository.url}`
    }

    private static parse(repositoryString: string): RepositoryModel {
        const [provider, url] = repositoryString.split(':')
        return { provider, url }
    }
}
