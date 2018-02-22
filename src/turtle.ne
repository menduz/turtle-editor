@{%
const lexer = require('./lexer')

const TYPE = '_type'
const TOKENS = '_tokens'

function firstTokenWithType(type) {
  return d => ({
    [TYPE]: type,
    [TOKENS]: [d[0]]
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
        ns: ns.value.slice(0,-1),
        iri: iri.value.slice(1,-1),
        [TOKENS]: [directive, ns, iri]
      }) %}

triples ->
    subject ws predicateObjectList
      {% d => [].concat(firstTokenWithType('subject')(d), d[2]) %}

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
    iri {% firstTokenWithType('predicate') %}
  | "a" {% firstTokenWithType('predicate') %}
  | %blankNode {% firstTokenWithType('predicate') %}

object ->
    iri {% firstTokenWithType('object') %}
  | blank {% firstTokenWithType('object') %}

blank ->
    %blankNode {% id %}

iriref ->
    %iri {% id %}
  | %unescapedIri {% id %}

iri ->
    iriref {% id %}
  | %prefixedName {% id %}

ws ->
    (%ws | %newline | %comment):* {% () => null %}
