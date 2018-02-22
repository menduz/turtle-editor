"use strict";

const nearley = require('nearley')
    , grammar = require('./grammar')

module.exports = function createParser() {
  return new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
}
