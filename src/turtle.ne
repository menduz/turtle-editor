@{%
const lexer = require('./lexer')

const TYPE = '_type'
const TOKEN = '_token'
const TOKENS = '_tokens'

function idWithType(type) {
  return d => ({
    [TYPE]: type,
    [TOKEN]: d[0]
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
    ("@prefix" | "@base") ws %prefixedNameNS ws iri ws "."
      {% ([[directive], _, ns, __, iri]) => ({
        [TYPE]: 'directive',
        [TOKENS]: [directive, ns, iri]
      }) %}

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
