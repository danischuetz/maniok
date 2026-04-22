import { type RepositoryModel } from '../model/repository/repository'

export class RepositoryService {
    static async deriveFromUrl(url: string): Promise<RepositoryModel | null> {
        const githubMatch = url.match(
            /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/|$)/
        )
        if (githubMatch) {
            // Test if this is a valid GitHub repository
            const [, org, name] = githubMatch
            const response = await fetch(`https://api.github.com/repos/${org}/${name}`)
            if (response.status !== 200) return null
            return {
                provider: 'gh',
                org: org,
                name: name
            }
        }
        return null
    }

    static toUrl(repository: RepositoryModel): string {
        switch (repository.provider) {
            case 'gh':
                return `https://github.com/${repository.org}/${repository.name}`
            default:
                throw new Error(`Unsupported repository provider: ${repository.provider}`)
        }
    }

    static async loadResource(repository: RepositoryModel, path: string): Promise<string> {
        if (repository.provider === 'gh') {
            const url = `https://raw.githubusercontent.com/${repository.org}/${repository.name}/HEAD/${path}`
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
}
