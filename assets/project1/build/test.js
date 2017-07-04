var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var glob = require('glob')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var entry = utils.getEntries('./src/pages/*/*.js')
console.log(entry)

console.log(glob.sync('./src/pages/*/*.js'))
