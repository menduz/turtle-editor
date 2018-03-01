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

function createEditor(turtle) {
  const el = document.createElement('div')

  Object.assign(el.style, {
    whiteSpace: 'pre-wrap',
    fontSize: '16px',
    fontFamily: 'monospace',
  })

  el.textContent = turtle

  const p = parser()

  p.feed(turtle)

  const statements = []

  let curStatement = null

  let pos = 0
    , remainingText = el.lastChild

  const splitNodeText = ({ _type, _tokens }) => {
    const firstTok = _tokens[0]
        , lastTok = _tokens[_tokens.length - 1]
        , start = firstTok.offset - pos
        , end = (lastTok.offset - pos) + lastTok.text.length
        , len = end - start
        , nodeText = remainingText.splitText(start)

    remainingText = nodeText.splitText(len)

    pos = pos + start + len;

    return { _type, _tokens, textNode: nodeText };
  }

  for (const val of p.results[0]) {
    switch (val._type) {
    case 'subject':
      if (!curStatement) {
        curStatement = []
        statements.push(curStatement)
      }
      curStatement.push(splitNodeText(val));
      break;
    case 'predicate':
      curStatement.push(splitNodeText(val));
      break;
    case 'object':
      curStatement.push(splitNodeText(val));
      break;
    case 'period':
      curStatement.push(splitNodeText(val));
      curStatement = null;
      break;
    default:
      break;
    }
  }

  return { el, statements };
}

const { el, statements } = createEditor(escapeBackslashes(turtle));

document.body.appendChild(el);

const range = document.createRange()

function w(statements) {
  const s = statements.shift()
  if (!s) {
    return
  }

  s.filter(s => s.textNode).forEach(s => {
    const span = document.createElement('span')
    range.selectNode(s.textNode);
    range.surroundContents(span);

    span.classList.add(s._type);
    span.style.backgroundColor = '#ccc'

    s.el = span;
  })

  /*
  range.selectNode(s[s.length - 1].el);
  range.setStart(s[0].el, 0);
  */

  setTimeout(() => {
    w(statements);
  }, 0)
}

w(statements);
