const getType = (val: any) => {
  if (val === null) return 'null'
  if (val !== val) return 'nan'
  if (val instanceof Date) return 'date'
  if (Array.isArray(val)) return 'array'
  return typeof val
}
const compareFns: { [key: string]: (prop: string, a: any, b: any) => number } = {
  compare_string_asc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return a.localeCompare(b)
  },
  compare_string_desc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return b.localeCompare(a)
  },
  compare_number_asc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return a - b
  },
  compare_number_desc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return b - a
  },
  compare_date_asc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return a.getTime() - b.getTime()
  },
  compare_date_desc: (prop: string, a: any, b: any) => {
    if (prop) a = a[prop], b = b[prop]
    return b.getTime() - a.getTime()
  }
}


export const DefaultPipes = {
  lower(value: string) {
    return value.toLowerCase()
  },
  upper(value: string) {
    return value.toUpperCase()
  },
  title(value: string) {
    let inWord = false
    let result = ''
    for(let i=0; i < value.length; i++) {
      const ch = value.charAt(i)
      const chUpper = ch.toUpperCase()
      const chLower = ch.toLowerCase()
      if (chUpper !== chLower) {
        if (inWord) result += chLower
        else {
          inWord = true
          result += chUpper
        }
      } else {
        inWord = false
        result += ch
      }
    }
    return result
  },
  trim(value: string) {
    return value.trim()
  },
  truncate(value: string, max: number) {
    max = +max
    if (value.length <= max) return value
    return value.slice(0, max - 3) + '...'
  },
  slice(value: string, start: number, end: number) {
    start = start !== undefined ? +start : start
    end = end !== undefined ? +end : end
    return value.slice(start, end)
  },
  split(value: string, sep: string) {
    return value.split(sep)
  },

  size(value: [] | string) {
    return value.length
  },

  first(value: any[]) {
    return value[0]
  },
  last(value: []) {
    return value[value.length - 1]
  },
  join(value: [], sep: any) {
    return value.join(sep)
  },
  filter(value: any[], prop: string, val: string) {
    return value.filter(x => x[prop] = val)
  },
  sort(value: any[], prop: string, order = 'asc') {
    let type = getType(value[0])
    if (type === 'object') {
      type = getType(value[0][prop])
      if (!prop) throw Error(`Must provide an object property key when sorting array of objects.`)
    } else {
      order = prop || 'asc'
      prop = ''
    }
    if (type !== 'string' && type !== 'number' && type !== 'date') {
      throw Error(`Unable to sort arrays of '${type}'.`)
    }
    if (order !== 'asc' && order !== 'desc') {
      throw Error(`Invalid order: '${order}'. Must be either 'asc' or 'desc'.`)
    }
    const compareFn = compareFns[`compare_${type}_${order}`]
    return value.slice().sort(compareFn.bind(null, prop))
  },


  round(value: number) {
    return Math.round(+value)
  },
  floor(value: number) {
    return Math.floor(+value)
  },
  ceil(value: number) {
    return Math.ceil(+value)
  },

  fallback(value: any, fallback: any) {
    return value || fallback
  },

  date(value: any, format: string) {
    return `[NOT YET IMPLEMENTED!]`
  }
}