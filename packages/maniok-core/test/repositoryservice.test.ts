import { describe, expect, it } from 'vitest'
import { RepositoryService } from '../src/service/repositoryservice'

describe('RepositoryService', () => {
    it('encoded repository should be decodable', () => {
        const repository = {
            provider: 'github',
            url: 'example/repo'
        }

        const hash = RepositoryService.encode(repository)
        console.log('Hash:', hash)

        const decoded = RepositoryService.decode(hash)
        expect(decoded).toEqual(repository)
    })
})
