"use strict";

const path = require('path');
const {isPathRelative} = require('../helpers');

module.exports = {
  meta: {
    type: null,
    docs: {
      description: "feature sliced relative path checker",
      category: "Fill me in",
      recommended: false,
      url: null,
    },
    messages: {
      errorMessage: 'В рамках одного слайса все пути должны быть относительными',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: 'errorMessage',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
                  .slice(0, -1)
                  .join('/');
              let relativePath = path.relative(normalizedPath, `/${importTo}`)
                  .split(/\\|\//)
                  .join('/');

              if(!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          })
        }
      }
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function getNormalizedCurrentFilePath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split('src')[1];
  return projectFrom.split(/\\|\//);
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }


  const toArray = to.split(/\\|\//);
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const fromArray = getNormalizedCurrentFilePath(from);

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if(!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }


  return fromSlice === toSlice && toLayer === fromLayer;
}