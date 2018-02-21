"use strict";

const moo = require('moo')

let PN_CHARS_BASE = [
  '[a-z]',
  '[A-Z]',
  String.raw`[\u00C0-\u00D6]`,
  String.raw`[\u00D8-\u00F6]`,
  String.raw`[\u00F8-\u02FF]`,
  String.raw`[\u0370-\u037D]`,
  String.raw`[\u037F-\u1FFF]`,
  String.raw`[\u200C-\u200D]`,
  String.raw`[\u2070-\u218F]`,
  String.raw`[\u2C00-\u2FEF]`,
  String.raw`[\u3001-\uD7FF]`,
  String.raw`[\uF900-\uFDCF]`,
  String.raw`[\uFDF0-\uFFFD]`,
]

let PN_CHARS_U = PN_CHARS_BASE.concat([
  '_',
])

let PN_CHARS = PN_CHARS_U.concat([
  '-',
  '[0-9]',
  String.raw`\u00B7`,
  String.raw`[\u0300-\u036f]`,
  String.raw`[\u203f-\u2040]`,
])

let PLX = [
  '%[0-9A-Fa-f]{2}',
  "\\\\(?:[_~.!$&'()*+,;=/,#@%-])"
]

PN_CHARS_BASE = combineOptions(PN_CHARS_BASE)
PN_CHARS_U = combineOptions(PN_CHARS_U)
PN_CHARS = combineOptions(PN_CHARS)
PLX = combineOptions(PLX)

function combineOptions(options) {
  const ranges = []
      , notRanges = []

  for (const opt of options) {
    if (opt[0] === '[') {
      ranges.push(opt.slice(1,-1))
    } else {
      notRanges.push(opt)
    }
  }

  let ret = ''

  if (ranges.length) {
    ret += `[${ranges.join('')}]`
  }

  if (notRanges.length) {
    if (ret.length) ret += '|'
    ret += `${notRanges.join('|')}`
  }

  return ret
}

const pnPrefix = `${PN_CHARS_BASE}(?:(?:${PN_CHARS}|\\.)*${PN_CHARS})?`
const pnLocal = `(?:${PN_CHARS_U}|:|[0-9]|${PLX})(?:(?:${PN_CHARS}|\\.|:|${PLX})*(?:${PN_CHARS}|:|${PLX}))?`
const pnNamespace = `(?:${pnPrefix})?:`

module.exports = moo.compile({
  iri: /<(?:(?:[^ <>{}\\]|\\[uU])+)>/, // IRI with escape sequences; needs sanity check after unescaping
  unescapedIri: /<(?:[^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/, // IRI without escape sequences; no unescaping
  unescapedString: /"[^"\\]+"(?=[^"\\])/, // non-empty string without escape sequences
  singleQuotedString: /"[^"\\]*(?:\\.[^"\\]*)*"(?=[^"\\])|^'[^'\\]*(?:\\.[^'\\]*)*'(?=[^'\\])/,
  tripleQuotedString: /""(?:"[^"\\]*(?:(?:\\.|"(?!""))[^"\\]*)*")""|^''(?:'[^'\\]*(?:(?:\\.|'(?!''))[^'\\]*)*')''/,
  langcode: /^@(?:[A-Za-z]+(?:-[A-Za-z0-9]+)*)(?=[^A-Za-z0-9\-])/,
  prefixedNameName: new RegExp(`${pnNamespace}${pnLocal}`),
  prefixedNameNamespace: new RegExp(pnNamespace),
  blankNode: new RegExp(`(?:_:(?:${PN_CHARS_U}|[0-9])(?:(?:${PN_CHARS}|\\.)*${PN_CHARS})?)|\\([ \t]*\\)`),

  blankNodeObjectOpen: '[',
  blankNodeObjectClose: ']',
  collectionOpen: '(',
  collectionClose: ')',

  number: /[\-+]?(?:\d+\.?\d*(?:[eE](?:[\-\+])?\d+)|\d*\.?\d+)(?=[.,;:\s#()\[\]\{\}"'<])/,
  boolean: /(?:true|false)(?=[.,;\s#()\[\]\{\}"'<])/,
  shortPredicates: /a(?=\s+|<)/,
  newline: { match: /[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/, lineBreaks: true },
  comment: /#(?:[^\n\r]*)/,
  whitespace: /[ \t]+/,
  period: '.',
  comma: ',',
  semicolon: ';',
  datatype: '^^',
  base: /base|BASE/,
  prefix: /prefix|PREFIX/,
})
