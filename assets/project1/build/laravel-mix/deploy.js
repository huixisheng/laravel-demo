/* eslint-disable */
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

function deployAssets (src, dist) {
  // @todo git reset
  // @todo 文件是否存在判断
  if (!fs.existsSync(src)) {
    console.log('%s 目录不存在', src);
    process.exit(1);
  }
  var mainfest = path.join(src, 'mix-manifest.json');
  var content = fs.readFileSync(mainfest, {encoding: 'utf8'});
  var json = JSON.parse(content);
  Object.keys(json).forEach(function(value, key){
    if (json[value].indexOf('//') < 0 && json[value].indexOf('http') < 0) {
      json[value] = '//p.cosmeapp.com/s/admin-lavavel' + json[value];
    }
  });
  console.log(json);
  fs.writeFileSync(mainfest, JSON.stringify(json));
  shell.cp('-Rf', src, dist);
  // @todo mix-manifest.json修改
  gitPush(dist);
}

function gitPush (path) {
  shell.cd(path);
  var gitOutput = shell.exec('git status');
  if (gitOutput.code === 0 && gitOutput.stdout.indexOf('use "git add') >= 0) {
    console.log('git add ----');
    // shell.exec('git add . && git commit -am "自动推送-更新前端资源文件" && git push origin master');
    // cd(path.join(cdnsWebpackDir, '../../'));
    // console.log('\n\ncdnpath: %s\n\n', cdnpath)
    // shell.exec('npm run sync');
  }
}

exports.deployAssets = deployAssets;
exports.gitPush = gitPush;
