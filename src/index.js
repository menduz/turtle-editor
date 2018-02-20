"use strict";

const rangy = require('rangy')
    , parser = require('./parser')

rangy.init();

const turtle = `
@prefix : <http://example.com/base> .

:d :e [
  :f :g ;
  :h :i
] .
`

function getNodesToHighlight(ast) {
  const replacements = []

  function walk(node) {
    switch (node.type) {
    case 'iri':
      replacements.push(node);
      return;

    default:
      node.children.map(walk);
      break;
    }
  }

  walk(ast)

  return replacements
}

const LESS_THAN = '\ufffe'
    , GREATER_THAN = '\uffff'

function loadTurtle(turtle) {
  const ast = parser.getAST(turtle)
      , toHighlight = getNodesToHighlight(ast);

  const el = document.createElement('div')

  el.style.whiteSpace = 'pre';
  el.innerHTML = turtle
    .replace(/</g, LESS_THAN)
    .replace(/>/g, GREATER_THAN)

  toHighlight.reverse().forEach(node => {
    const range = rangy.createRange()
        , [text] = el.childNodes

    range.setStart(text, node.start);
    range.setEnd(text, node.end);

    const a = document.createElement('a');
    a.href = '#';

    range.surroundContents(a);
  })


  el.innerHTML = el.innerHTML
    .replace(new RegExp(LESS_THAN, 'g'), '&lt;')
    .replace(new RegExp(GREATER_THAN, 'g'), '&gt;')

  document.body.appendChild(el);
}

loadTurtle(turtle);
