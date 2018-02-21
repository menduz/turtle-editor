"use strict";

const parser = require('./parser')
    , escapeBackslashes = require('./escape')

const turtle = Buffer.from(`
  :a :b :c .
        # This is a comment
  :d :e :f .
`)

const LESS_THAN = '\ufffe'
    , GREATER_THAN = '\uffff'

function getNodesToHighlight(ast) {
  const subjMap = new Map()

  const el = document.createElement('div')
  el.style.whiteSpace = 'pre';
  el.style.fontSize = '24px';

  el.textContent = ast.text
    .replace('<', LESS_THAN)
    .replace('>', GREATER_THAN)

  let pos = 0
    , remainingText = el.lastChild

  const cleanTextNode = el => {
    el.nodeValue = el.nodeValue
      .replace(LESS_THAN, '<')
      .replace(GREATER_THAN, '>')
  }

  const splitNodeText = node => {
    const start = node.start - pos
        , len = node.end - node.start
        , nodeText = remainingText.splitText(start)

    remainingText = nodeText.splitText(node.end - node.start)

    cleanTextNode(nodeText.previousSibling);
    cleanTextNode(nodeText);

    pos = pos + start + len;

    return nodeText;
  }

  let curSubj
    , curVerb

  function walk(node) {
    switch (node.type) {
    case 'subject':
      curSubj = splitNodeText(node)
      subjMap.set(curSubj, new Map())
      break;
    case 'verb':
      curVerb = splitNodeText(node)
      subjMap.get(curSubj).set(curVerb, [])
      break;
    case 'object':
      subjMap.get(curSubj).get(curVerb).push(splitNodeText(node))
      return;

    default:
      break;
    }

    node.children.map(walk);
  }

  walk(ast)

  const range = document.createRange()

  function surround(text) {
    const span = document.createElement('span')
    range.selectNode(text);
    range.surroundContents(span);

    return span;
  }

  for (const [subj, verbMap] of subjMap) {
    const span = surround(subj)
    span.style.color = 'red';
    for (const [verb, objs] of verbMap) {
      const span = surround(verb)
      span.style.color = 'blue';

      for (const obj of objs) {
        const span = surround(obj)
        span.style.color = 'green';
      }
    }
  }

  return { el }
}

function loadTurtle(turtle) {
  const ast = parser.getAST(escapeBackslashes(turtle))
      , { el }  = getNodesToHighlight(ast);

  document.body.appendChild(el);
}

loadTurtle(turtle);
