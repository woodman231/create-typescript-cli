export type IFileSystemService = {
    exists(path: string): boolean;
    readFile(path: string, encoding?: BufferEncoding): string | Buffer;
    writeFile(path: string, content: string, encoding?: BufferEncoding): void;
    createDirectory(path: string, recursive?: boolean): void;
}
