import { watch, WatchOptions } from 'chokidar'
import { Observable } from 'rxjs'
import { join, basename, extname } from 'path'
import { PlatsEvent } from './event'

export function watch$<T>(
  pattern: string | readonly string[],
  options: WatchOptions = {}
) : Observable<T> {

  const {
    cwd = process.cwd()
  } = options

  return Observable.create((observer: any) => {
    let watcher = watch(pattern, options)
    let next = (type: any) => (name: any) => {
      const path = name.replace(/\\/g, '/')
      const filename = basename(name)
      const ext = extname(filename)
      const key = join(cwd, path)
      return observer.next({
        type,
        key,
        path,
        cwd,
        filename,
        ext,
      } as PlatsEvent)
    }

    ;['add', 'change', 'unlink', 'addDir', 'unlinkDir'].forEach(type => {
      watcher.on(type, next(type))
    })

    watcher.on('error', err => {
      observer.error(err)
      watcher.close()
    })
  })
}