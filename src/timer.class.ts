import chalk = require("chalk")


export class Timer {
  timers: { [key: string]: [number, number] } = {}
  constructor() { }

  start(label: string) {
    return this.timers[label] = process.hrtime()
  }

  end(label: string) : [number, number] {
    const start = this.timers[label]
    return process.hrtime(start)
  }

  log(label: string) {
    const start = this.timers[label]
    const [s, ms] = process.hrtime(start)
    const l = label + ':'
    const t = ('' + (s + (ms / 1000000)))
    console.log(`[${chalk.cyan(l)} ${chalk.magenta(t + ' ms')}]`)
  }
}