"use strict";

const parser = require('./parser')

module.exports = function createEditor(turtle) {
  const p = parser()
      , range = document.createRange()
      , el = document.createElement('div')
      , statements = []

  el.classList.add('turtle-editor')
  el.textContent = turtle

  const extractTextForToken = makeExtractor(el);

  p.feed(turtle)

  let curStatement = null

  for (const val of p.results[0]) {
    switch (val._type) {
    case 'subject':
      if (!curStatement) {
        curStatement = []
        statements.push(curStatement)
      }
      curStatement.push(extractTextForToken(val));
      break;
    case 'predicate':
      curStatement.push(extractTextForToken(val));
      break;
    case 'object':
      curStatement.push(extractTextForToken(val));
      break;
    case 'period':
      curStatement.push(extractTextForToken(val));
      curStatement = null;
      break;
    default:
      break;
    }
  }

  wrap(range, statements);

  return el;
}

function makeExtractor(el) {
  let pos = 0
    , remainingText = el.lastChild

  return function extractTextForToken({ _type, _tokens }) {
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
}

function wrap(range, statements) {
  statements.forEach(s => {
    if (!s) {
      return
    }

    s.filter(s => s.textNode).forEach(s => {
      const span = document.createElement('span')
      range.selectNode(s.textNode);
      range.surroundContents(span);

      span.classList.add(s._type);

      s.el = span;
    })

    const div = document.createElement('div')

    div.classList.add('statement')
    div.setAttribute('id', s[0]._tokens[0].text)

    range.setStartBefore(s[0].el);
    range.setEndAfter(s[s.length - 1].el);

    range.surroundContents(div);
  })
}
