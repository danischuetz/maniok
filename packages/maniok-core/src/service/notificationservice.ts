import { toaster } from '../state/toaster'

export class NotificationService {
    static getToasterInstance(): typeof toaster {
        return toaster
    }

    static notifyError({ title, description }: { title: string; description?: string }) {
        toaster.error({
            title,
            description
        })
    }
}
