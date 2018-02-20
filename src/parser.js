"use strict";

const fs = require('fs')
    , ebnf = require('ebnf')
    , grammar = fs.readFileSync(__dirname + '/../turtle.bnf', 'utf-8')
    , parser = new ebnf.Grammars.W3C.Parser(String.raw({ raw: grammar }))

// The BNF is correct except for a few things:
// Both sides of prefixed names (including blank node labels) are, according
// to the standard, not allowed to contain periods as their final character.
// Something was up with the `ebnf` library that I couldn't figure out that
// didn't allow me to write lookahead rules like that. So in this parser, those
// trailing periods are allowed.

module.exports = parser;
