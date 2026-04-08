import { type Repository } from '../model/repository/repository'

export class RepositoryService {
    static toHash(repository: Repository): string {
        return btoa(this.stringify(repository))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }

    static toRepository(repositoryHash: string): Repository {
        const raw = atob(repositoryHash.replace(/-/g, '+').replace(/_/g, '/'))
        return this.parse(raw)
    }

    static async loadResource(repository: Repository, path: string): Promise<string> {
        if (repository.provider === 'github') {
            const url = `https://raw.githubusercontent.com/${repository.url}/${path}`
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

    private static stringify(repository: Repository): string {
        return `${repository.provider}:${repository.url}`
    }

    private static parse(repositoryString: string): Repository {
        const [provider, url] = repositoryString.split(':')
        return { provider, url }
    }
}
