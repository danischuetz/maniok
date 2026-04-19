export declare class Watcher {
    onChange: () => void;
    watchDirectory(path: string): Promise<void>;
}
