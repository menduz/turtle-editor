@{%
const lexer = require('./lexer')

const TYPE = '_type'
const TOKENS = '_tokens'

function withType(type) {
  return d => ({
    [TYPE]: type,
    [TOKENS]: Array.isArray(d) ? d : [d]
  })
}

function firstTokenWithType(type) {
  return d => withType(type)(d[0])
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
    (subject ws predicateObjectList)
      {% ([[subj, _, preds]]) => [].concat(subj, preds) %}

predicateObjectList ->
    verb ws objectList ( ";" ws predicateObjectList ):?
      {% ([verb, _, objs, tail]) => [].concat(verb, objs, tail ? tail[2] : []) %}

objectList ->
  object ws ("," ws objectList):?
    {% ([obj, _, tail]) => [].concat(obj, tail ? tail[2] : []) %}

subject ->
    (iri | blank)
      {% ([[d]]) => Array.isArray(d) ? d : withType('subject')(d) %}

verb ->
    iri {% firstTokenWithType('predicate') %}
  | "a" {% firstTokenWithType('predicate') %}
  | blank {% ([d]) => Array.isArray(d) ? d : withType('predicate')(d) %}

object ->
    iri {% firstTokenWithType('object') %}
  | blankNodePropertyList {% id %}
  | ("(" ws ")") {% ([[open, _, close]]) => withType('nil')([open, close]) %}
  | blank {% ([d]) => Array.isArray(d) ? d : withType('object')(d) %}

blank ->
    %blankNode {% id %}
  | ("(" ws (object ws):+ ")")
      {% ([[open, _, objs, close]]) => [].concat(
        withType('listOpen')(open),
        objs.map(([obj]) => Object.assign(obj, { [TYPE]: 'listMember' })),
        withType('listClose')(close)
      ) %}

blankNodePropertyList ->
    ("[" ws predicateObjectList "]")
      {% ([[open, _, preds, close]]) => [].concat(
        withType('openBlankNodePropertyList')(open),
        preds,
        withType('closeBlankNodePropertyList')(close),
      ) %}

iriref ->
    %iri {% id %}
  | %unescapedIri {% id %}

iri ->
    iriref {% id %}
  | %prefixedName {% id %}

ws ->
    (%ws | %newline | %comment):* {% () => null %}
