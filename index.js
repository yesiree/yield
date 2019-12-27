const html2 = require('htmlparser2')
const compile = require('expression-eval').compile

// if="expression"
// switch="expression"
// switchCase="expression"
// switchDefault

const template = `
  <# foreach="item of items">
    Hello {{ item }}
  </#>
`


const expr = (code, context) => {
  return compile(code)(context)
}

const process = (template, contexxt) => {
  const $ = html2.parseDOM(template)
  html2.DomUtils
    .findAll(el => el.tagName === '#' && el.attribs['foreach'], $)
    .forEach((el) => {
      const nodes = []
      const [itemKey, , arrKey] = el.attribs['foreach'].split(/\s/)
      context[arrKey].forEach((item) => {
        const childContext = Object.assign({}, context, { [itemKey]: item })
        const itemNodes = process(html2.DomUtils.getInnerHTML(el), childContext)
        console.log(html2.DomUtils.getOuterHTML(itemNodes))
        itemNodes.forEach(x => nodes.push(x))
      })
      html2.DomUtils.removeElement(el)
      // let c = el
      // nodes.forEach(n => {
      //   html2.DomUtils.append(c, n)
      //   c = n
      // })
      // html2.DomUtils.removeElement(el)
      // html2.DomUtils.replaceElement(el, nodes)
    })
  return $
}

const context = {
  items: [
    'apple',
    'banana',
    'cherry'
  ]
}


const out = process(template, context)


console.log(
  html2.DomUtils.getOuterHTML(out)
)

// console.log(
//   expr('1 + a', { a: 5 })
// )