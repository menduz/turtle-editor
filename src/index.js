"use strict";

const createEditor = require('./editor')
    , escapeBackslashes = require('./escape')
    , turtle = require('fs').readFileSync('bib.ttl')

document.body.appendChild(createEditor(escapeBackslashes(turtle)))
