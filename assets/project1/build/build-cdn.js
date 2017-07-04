/* global cp, cd, exec */
var path = require('path')
var util = require('util')
var pkg = require('../package.json')
var config = require('../config')
var xConfig = require('x-config-deploy').getConfig()
require('shelljs/global')

function init () {
  var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
  var mapPath = path.join(config.build.assetsRoot, 'webpack-' + pkg.name + '.json')
  console.log(mapPath)
  var cdnsWebpackDir = path.join(xConfig.cndAssets, 's/webpack')

  var h5MapPath = xConfig.mapCosmeapi

  cp('-R', mapPath, h5MapPath)
  cp('-R', assetsPath, cdnsWebpackDir)

  cd(cdnsWebpackDir)
  var gitOutput = exec('git status')
  // console.log(gitOutput);
  /*
    {
    code: 0,
    output: '',
    stdout: '',
    stderr: ''
    }
  */
  if (gitOutput.code === 0 && gitOutput.stdout.indexOf('use "git add') >= 0) {
    var shellCmd = util.format('git add . && git commit -am "[%s]更新前端资源文件" && git push origin master', pkg.name)
    exec(shellCmd)
    cd(path.join(cdnsWebpackDir, '../../'))
    // console.log('\n\ncdnpath: %s\n\n', cdnpath)
    exec('npm run sync')
  }
}

exports.init = init
