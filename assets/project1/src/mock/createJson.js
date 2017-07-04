const MockServer = require('./mock-server');
const path = require('path');
const fs = require('fs');
const util = require('util');

const dirname = __dirname;
const dataPath = path.join(dirname, 'json');
const router = MockServer(dataPath, dirname);
const jsonPath = path.join(dirname, 'json.js');

router.forEach((value, key) => {
  value.path = value.path.replace(dataPath.replace('json', ''), '');
  console.log(value.path);
  console.log(dataPath);
  console.log('key:%d', key);
});

const content = `/* eslint-disable */
module.exports = %s;`;

fs.writeFileSync(jsonPath, util.format(content, JSON.stringify(router, null, '  ')));

console.log(dirname);
console.log(dataPath);
console.log(router);
