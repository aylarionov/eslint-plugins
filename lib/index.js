/**
 * @fileoverview plugin for pet project
 * @author anton
 */
"use strict";

const fs = require('fs');
const path = require('path');

const allRules = Object.fromEntries(
  fs
    .readdirSync(`${__dirname}/rules`)
    .filter((fileName) => fileName.endsWith('.js') && /^[^._]/.test(fileName))
    .map((fileName) => fileName.replace(/\.js$/, ''))
    .map((ruleName) => [
      ruleName,
      require(path.join(__dirname, 'rules', ruleName)),
    ])
);

module.exports.rules = allRules;
