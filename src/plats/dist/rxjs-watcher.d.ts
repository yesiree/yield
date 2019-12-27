import { WatchOptions } from 'chokidar';
import { Observable } from 'rxjs';
export interface Event {
    type: string;
    key: string;
    path: string;
    cwd: string;
    filename: string;
    ext: string;
    content?: string;
}
export declare function watch$<T>(pattern: string | readonly string[], options?: WatchOptions): Observable<T>;
