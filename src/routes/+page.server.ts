import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/private'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({}) => {
    if (env.WORKSPACE_PATH) {
        redirect(307, '/local')
    }
}
