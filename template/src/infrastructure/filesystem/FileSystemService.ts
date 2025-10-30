import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { IFileSystemService } from '../../core/interfaces/IFileSystemService.js';

export class FileSystemService implements IFileSystemService {
  exists(path: string): boolean {
    return existsSync(path);
  }

  readFile(path: string, encoding: BufferEncoding = 'utf8'): string | Buffer {
    return readFileSync(path, encoding);
  }

  writeFile(path: string, content: string, encoding: BufferEncoding = 'utf8'): void {
    // Ensure directory exists
    const dir = dirname(path);
    if (!this.exists(dir)) {
      this.createDirectory(dir, true);
    }
    
    writeFileSync(path, content, encoding);
  }

  createDirectory(path: string, recursive: boolean = true): void {
    mkdirSync(path, { recursive });
  }
}