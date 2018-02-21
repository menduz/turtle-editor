"use strict";

const codeForChar = c => c.charCodeAt(0)
    , backslash = codeForChar('\\')
    , toEscape = new Set([...'utbnrf\'"\\'].map(codeForChar))

module.exports = function escapeBackslashes(buffer) {
  const backslashes = []

  buffer.forEach((b, i) => {
    if (b === backslash && toEscape.has(buffer[i + 1])) {
      backslashes.push(i)
    }
  })

  let lastPos = 0
    , outStr = ''

  while (backslashes.length) {
    const nextPos = backslashes.shift();
    outStr += buffer.toString('utf-8', lastPos, nextPos);
    outStr += '\\';
    lastPos = nextPos + 1;
  }

  outStr += buffer.toString('utf-8', lastPos);

  return outStr;
}
