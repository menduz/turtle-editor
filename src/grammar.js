// Generated automatically by nearley, version 2.11.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["statement", "ws"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1", "main$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "main", "symbols": ["ws", "main$ebnf$1"], "postprocess": d => [].concat(...d[1].map(x => x[0]))},
    {"name": "statement", "symbols": ["directive"], "postprocess": id},
    {"name": "statement", "symbols": ["triples", {"literal":"."}], "postprocess": id},
    {"name": "directive", "symbols": ["prefix"], "postprocess": id},
    {"name": "directive", "symbols": ["base"], "postprocess": id},
    {"name": "prefix", "symbols": [{"literal":"@prefix"}, "ws", (lexer.has("prefixedNameNS") ? {type: "prefixedNameNS"} : prefixedNameNS), "ws", "iri", "ws", {"literal":"."}], "postprocess":  ([directive, _, ns, __, iri]) => ({
          [TYPE]: 'directive',
          ns: ns.value.slice(0,-1),
          iri: iri.value.slice(1,-1),
          [TOKENS]: [directive, ns, iri]
        }) },
    {"name": "base", "symbols": [{"literal":"@base"}, "ws", "iri", "ws", {"literal":"."}], "postprocess":  ([directive, _, iri]) => ({
          [TYPE]: 'directive',
          iri: iri.value.slice(1,-1),
          [TOKENS]: [directive, iri]
        }) },
    {"name": "triples$subexpression$1", "symbols": ["subject", "ws", "predicateObjectList"]},
    {"name": "triples", "symbols": ["triples$subexpression$1"], "postprocess": ([[subj, _, preds]]) => [].concat(subj, preds)},
    {"name": "predicateObjectList$ebnf$1$subexpression$1", "symbols": [{"literal":";"}, "ws", "predicateObjectList"]},
    {"name": "predicateObjectList$ebnf$1", "symbols": ["predicateObjectList$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "predicateObjectList$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "predicateObjectList", "symbols": ["verb", "ws", "objectList", "predicateObjectList$ebnf$1"], "postprocess": ([verb, _, objs, tail]) => [].concat(verb, objs, tail ? tail[2] : [])},
    {"name": "objectList$ebnf$1$subexpression$1", "symbols": [{"literal":","}, "ws", "objectList"]},
    {"name": "objectList$ebnf$1", "symbols": ["objectList$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "objectList$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "objectList", "symbols": ["object", "ws", "objectList$ebnf$1"], "postprocess": ([obj, _, tail]) => [].concat(obj, tail ? tail[2] : [])},
    {"name": "subject$subexpression$1", "symbols": ["iri"]},
    {"name": "subject$subexpression$1", "symbols": ["blank"]},
    {"name": "subject", "symbols": ["subject$subexpression$1"], "postprocess": ([[d]]) => Array.isArray(d) ? d : withType('subject')(d)},
    {"name": "verb", "symbols": ["iri"], "postprocess": firstTokenWithType('predicate')},
    {"name": "verb", "symbols": [{"literal":"a"}], "postprocess": firstTokenWithType('predicate')},
    {"name": "verb", "symbols": ["blank"], "postprocess": ([d]) => Array.isArray(d) ? d : withType('predicate')(d)},
    {"name": "object", "symbols": ["iri"], "postprocess": firstTokenWithType('object')},
    {"name": "object", "symbols": ["blankNodePropertyList"], "postprocess": id},
    {"name": "object$subexpression$1", "symbols": [{"literal":"("}, "ws", {"literal":")"}]},
    {"name": "object", "symbols": ["object$subexpression$1"], "postprocess": ([[open, _, close]]) => withType('nil')([open, close])},
    {"name": "object", "symbols": ["blank"], "postprocess": ([d]) => Array.isArray(d) ? d : withType('object')(d)},
    {"name": "object", "symbols": ["literal"], "postprocess": firstTokenWithType('object')},
    {"name": "blank", "symbols": [(lexer.has("blankNode") ? {type: "blankNode"} : blankNode)], "postprocess": id},
    {"name": "blank$subexpression$1$ebnf$1$subexpression$1", "symbols": ["object", "ws"]},
    {"name": "blank$subexpression$1$ebnf$1", "symbols": ["blank$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "blank$subexpression$1$ebnf$1$subexpression$2", "symbols": ["object", "ws"]},
    {"name": "blank$subexpression$1$ebnf$1", "symbols": ["blank$subexpression$1$ebnf$1", "blank$subexpression$1$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "blank$subexpression$1", "symbols": [{"literal":"("}, "ws", "blank$subexpression$1$ebnf$1", {"literal":")"}]},
    {"name": "blank", "symbols": ["blank$subexpression$1"], "postprocess":  ([[open, _, objs, close]]) => [].concat(
          withType('listOpen')(open),
          objs.map(([obj]) => Object.assign(obj, { [TYPE]: 'listMember' })),
          withType('listClose')(close)
        ) },
    {"name": "blankNodePropertyList$subexpression$1", "symbols": [{"literal":"["}, "ws", "predicateObjectList", {"literal":"]"}]},
    {"name": "blankNodePropertyList", "symbols": ["blankNodePropertyList$subexpression$1"], "postprocess":  ([[open, _, preds, close]]) => [].concat(
          withType('openBlankNodePropertyList')(open),
          preds,
          withType('closeBlankNodePropertyList')(close),
        ) },
    {"name": "literal$subexpression$1$ebnf$1$subexpression$1", "symbols": [(lexer.has("langcode") ? {type: "langcode"} : langcode)]},
    {"name": "literal$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":"^^"}, "iri"]},
    {"name": "literal$subexpression$1$ebnf$1", "symbols": ["literal$subexpression$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "literal$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "literal$subexpression$1", "symbols": ["string", "literal$subexpression$1$ebnf$1"]},
    {"name": "literal", "symbols": ["literal$subexpression$1"], "postprocess": ([[string, rest]]) => [].concat(string, ...(rest || []))},
    {"name": "literal", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": id},
    {"name": "literal$subexpression$2", "symbols": [{"literal":"true"}]},
    {"name": "literal$subexpression$2", "symbols": [{"literal":"false"}]},
    {"name": "literal", "symbols": ["literal$subexpression$2"], "postprocess": d => d[0][0]},
    {"name": "string$subexpression$1", "symbols": [(lexer.has("unescapedString") ? {type: "unescapedString"} : unescapedString)]},
    {"name": "string$subexpression$1", "symbols": [(lexer.has("singleQuotedString") ? {type: "singleQuotedString"} : singleQuotedString)]},
    {"name": "string$subexpression$1", "symbols": [(lexer.has("tripleQuotedString") ? {type: "tripleQuotedString"} : tripleQuotedString)]},
    {"name": "string", "symbols": ["string$subexpression$1"], "postprocess": d => d[0][0]},
    {"name": "iriref", "symbols": [(lexer.has("iri") ? {type: "iri"} : iri)], "postprocess": id},
    {"name": "iriref", "symbols": [(lexer.has("unescapedIri") ? {type: "unescapedIri"} : unescapedIri)], "postprocess": id},
    {"name": "iri", "symbols": ["iriref"], "postprocess": id},
    {"name": "iri", "symbols": [(lexer.has("prefixedName") ? {type: "prefixedName"} : prefixedName)], "postprocess": id},
    {"name": "ws$ebnf$1", "symbols": []},
    {"name": "ws$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "ws$ebnf$1$subexpression$1", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "ws$ebnf$1$subexpression$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)]},
    {"name": "ws$ebnf$1", "symbols": ["ws$ebnf$1", "ws$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ws", "symbols": ["ws$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
