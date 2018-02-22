@{%
const lexer = require('./lexer')

const TYPE = '_type'
const VALUE = '_value'

function idWithType(type) {
  return d => ({
    [TYPE]: type,
    [VALUE]: d[0]
  })
}

%}

@lexer lexer

main ->
    ws (statement ws):* {% d => [].concat(...d[1].map(x => x[0])) %}

statement ->
    directive {% id %}
  | triples "." {% id %}

directive ->
    prefixID

prefixID ->
    "@prefix" %prefixedNameNS iri "."

triples ->
    subject ws predicateObjectList
      {% d => [].concat(idWithType('subject')(d), d[2]) %}

predicateObjectList ->
    verb ws objectList ( ";" ws predicateObjectList ):?
      {% ([verb, _, objs, tail]) => [].concat(verb, objs, tail ? tail[2] : []) %}

objectList ->
  object ws ("," ws objectList):?
    {% ([obj, _, tail]) => [].concat(obj, tail ? tail[2] : []) %}

subject ->
    iri {% id %}
  | %blankNode {% id %}

verb ->
    iri {% idWithType('predicate') %}
  | %blankNode {% idWithType('predicate') %}

object ->
    iri {% idWithType('object') %}
  | %blankNode {% idWithType('object') %}

iriref ->
    %iri {% id %}
  | %unescapedIri {% id %}

iri ->
    iriref {% id %}
  | %prefixedName {% id %}

ws ->
    (%ws | %newline | %comment):* {% () => null %}
