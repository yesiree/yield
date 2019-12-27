const { plats } = require('../dist/index')


plats({
  src: './src',
  dest: './dest'
}).pipe(

).subscribe({
  next(e) {
    console.dir(e)
  },
  error(e) {
    console.error(e)
  },
  complete() {
    console.log('complete')
  }
})