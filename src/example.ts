import { Generator } from "."
import { Timer } from "./timer.class"

const pages: { [key: string]: string } = {
  'layout': `---
title: Layout Title
---
<!doctype html>
<html>
  <head>
    <title>{{ title | title }}</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">home</a>
        <a href="/one">one</a>
        <a href="/two">two</a>
      </nav>
    </header>
    <main #slot></main>
  </body>
</html>`,
  'marked': `---
markdown: true
---
# Header 1

A simple little paragraph

 - one
 - two
 - three

> Blockquote!
`,
  'index': `---
layout: layout
title: I am the title.
name: World
items:
  - apple
  - banana
  - cherry
data:
  enums: enums
---
<div>
  <div>
    {{ items | sort: 'desc' | join: ', ' }}
  </div>
  <ul>
    <li #foreach="item of items"
          #if="item !== 'banana'">
      Hello {{ item }}
    </li>
  </ul>
  # Header!
  <div #foreach="item of data.enums.colors">
    <h1>{{ item }}</h1>
  </div>
</div>`
}

const data: { [key: string]: Object } = {
  enums: {
    colors: ['red', 'green', 'blue'],
    fruit: ['apple', 'banana', 'cherry']
  }
}

const generator = new Generator({
  getPage(path: string) {
    return {
      path,
      content: pages[path]
    }
  },
  getData(path: string) {
    return data[path]
  },
  pipes: {

  }
})

const exec = async () => {
  const timer = new Timer()
  timer.start('Example')
  const output = await generator.render('index')
  require('fs').writeFileSync('index.html', output)
  timer.log('Example')
}

exec()