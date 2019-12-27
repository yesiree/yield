import { Observable } from 'rxjs';

const pow = (n: number) => (source: Observable<any>) =>
  new Observable(dest => {
    return source.subscribe({
      next(x) {
        dest.next(
          Math.pow(x, n)
        );
      },
      error(err) { dest.error(err) },
      complete() { dest.complete() }
    })
  })