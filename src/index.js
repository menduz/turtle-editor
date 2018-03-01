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
    .replace('<', LESS_THAN)
    .replace('>', GREATER_THAN)

  const p = parser()

  p.feed(turtle)

  const tokens = p.results[0]

  const textEl = el.childNodes[0]

  for (const { _type, _tokens } of tokens.reverse()) {
    switch (_type) {
    case 'subject':
      surround(textEl, 's', _tokens);
      break;
    case 'predicate':
      surround(textEl, 'p', _tokens);
      break;
    case 'object':
      surround(textEl, 'o', _tokens);
      break;

    default:
      break;
    }
  }

  el.innerHTML = el.innerHTML
    .replace(LESS_THAN, '&lt;')
    .replace(GREATER_THAN, '&gt;')

  return el;
}

const range = document.createRange()

function surround(el, type, [t]) {
  const start = t.offset
      , end = t.offset + t.text.length

  range.setStart(el, start);
  range.setEnd(el, end);

  const span = document.createElement('span')
  span.classList.add(type)
  range.surroundContents(span);

  return range;
}

document.body.appendChild(createEditor(escapeBackslashes(turtle)));
