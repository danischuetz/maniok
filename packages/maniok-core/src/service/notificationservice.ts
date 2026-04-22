import { toaster } from '../state/toaster'

export class NotificationService {
    static getToasterInstance(): typeof toaster {
        return toaster
    }

    static notifyError(title: string, error: unknown): void {
        toaster.error({
            title,
            description: error instanceof Error ? error.message : 'An unknown error occurred'
        })
    }

    static notifyInfo(message: string): void {
        toaster.success({
            title: message,
            duration: 10000
        })
    }
}
