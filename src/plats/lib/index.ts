import { watch$ } from './rxjs-watcher'
export { PlatsEvent } from './event'

export const plats = ({
  src = '',
  dest = ''
}: {
  src?: string | readonly string[],
  dest?: string
} = { }) => {

  const data = { }
  const layouts = { }
  const pages = { }

  return watch$(src)
    .pipe(
      // TODO
    )

}

/*
  directives
    *foreach
    *if
    *switch
      *case
      *default

  interpolation

    {{ expression | pipe-chain : args }}

  pipes
    plugins




  gather data from .json files
  gather layouts from .layout.html files
  gather pages from remaining .html files

  for each page
    parse front matter
    get layout for page
    get format for page
    get combined data (json files, front matter)
    if markdown format
      convert markdown
    process directives
    if layout
      get(layout)
      combine(layout, page)
    return page

  get(layout)
    get layout from hash
    if not processed
      process(layout)
    return layout

  process(layout)
    parse front matter
    get layout for layout
    get format for layout
    get combined data (json files, front matter)
    if markdown format
      convert markdown
    process directives
    if layout
      get(layout)
      combine(layout, layout)
    return layout
*/