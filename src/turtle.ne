@{%
const lexer = require('./lexer')

const identity = x => x

function firstNonList(d) {
  return Array.isArray(d[0])
    ? firstNonList(d[0])
    : d[0]
}

const TYPE = '_type'
const CHILDREN = '_children'
%}

@lexer lexer

main -> statement:* {% firstNonList %}

statement -> (directive | triples ".") {% firstNonList %}

directive -> prefixID

prefixID -> "@prefix" %prefixedNameNS iri "."


triples -> subject ws predicateObjectList {%
d => ({
  [TYPE]: 'triple',
  [CHILDREN]: [d[0]].concat(d[2]),
})
%}

subject -> (iri | %blankNode) {%
d => ({
  [TYPE]: 'subject',
  [CHILDREN]: d[0]
})
%}

predicateObjectList -> verb ws objectList ( ";" ws predicateObjectList ):? {%
d => [d[0]].concat(d[2])
%}

verb -> (iri | %blankNode) {%
([[pred]]) => ({ type: 'predicate', token: pred })
%}

objectList -> object ws ("," ws objectList):? {%
d => d[0]
%}

object -> (iri | %blankNode) {%
([[obj]]) => ({ type: 'object', token: obj })
%}

iriref -> (%iri | %unescapedIri) {% firstNonList %}

iri -> (iriref | %prefixedName) {% firstNonList %}

ws -> %ws:* {% () => null %}
