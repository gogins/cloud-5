'use strict';

const { debuglog } = require('util');
const Walker = require('node-source-walk');
const gonzales = require('gonzales-pe');

const debug = debuglog('detective-less');

/**
 * Extract the @import statements from a given less file's content
 *
 * @param  {String} fileContent
 * @return {String[]}
 */
module.exports = function detective(fileContent) {
  if (typeof fileContent === 'undefined') throw new Error('content not given');
  if (typeof fileContent !== 'string') throw new Error('content is not a string');

  let ast = {};

  try {
    debug('content: %s', fileContent);
    ast = gonzales.parse(fileContent, { syntax: 'less' });
  } catch (error) {
    debug('parse error: %s', error.message);
  }

  detective.ast = ast;

  const walker = new Walker();
  let dependencies = [];

  walker.walk(ast, node => {
    if (!isImportStatement(node)) return;

    dependencies = [...dependencies, ...extractDependencies(node)];
  });

  return dependencies;
};

function isImportStatement(node) {
  if (!node || node.type !== 'atrule') return false;
  if (node.content.length === 0 || node.content[0].type !== 'atkeyword') return false;

  const atKeyword = node.content[0];

  if (atKeyword.content.length === 0) return false;

  const importKeyword = atKeyword.content[0];

  return ['ident', 'import'].includes(importKeyword.type);
}

function extractDependencies(importStatementNode) {
  return importStatementNode.content
    .filter(innerNode => ['string', 'ident'].includes(innerNode.type))
    .map(identifierNode => identifierNode.content.replace(/["']/g, ''));
}
