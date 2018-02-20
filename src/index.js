const fs = require('fs')
    , ebnf = require('ebnf')
    , grammar = fs.readFileSync('./turtle.bnf', 'utf-8')
    , parser = new ebnf.Grammars.W3C.Parser(grammar)

// The BNF is correct except for a few things:
// Both sides of prefixed names (including blank node labels) are, according
// to the standard, not allowed to contain periods as their final character.
// Something was up with the `ebnf` library that I couldn't figure out that
// didn't allow me to write lookahead rules like that. So in this parser, those
// trailing periods are allowed.

const turtle = `
@prefix a: <http://example.com/a> .

:a :b ( :d 1 ) .
`

const ast = parser.getAST(turtle)
print('')(ast)

function print(sp) {
  return node => {
    console.log(`${sp}${node.type} (${node.text.replace('\n', '\\n')})`)
    node.children.map(print(sp + '  '))
  }
}
