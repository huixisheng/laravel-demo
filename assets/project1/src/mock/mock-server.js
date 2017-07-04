/*
The MIT License (MIT)

Copyright (c) 2017 peakchen90

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// https://github.com/peakchen90/mock-dev-server/blob/master/src/init.js
/* eslint no-throw-literal: 'off',  no-shadow: 'off' */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk'); // eslint-disable-line
// const deleteComments = require('./util').deleteComments

// 所有router信息
let base;
let router;

function init(mock, _base) {
  if (!/^\//.test(_base)) {
    throw chalk.bgRed.black(' ERROR ') + chalk.red(' 根目录必须以 / 开始');
  }
  base = _base;
  router = [];
  const dir = path.resolve(mock);
  if (fs.existsSync(dir)) {
    eachDir(dir);
  } else {
    throw chalk.bgRed.black(' ERROR ') + chalk.red(` ${dir} not exist`);
  }
}

/**
 * 递归遍历文件夹下的json文件，并将api配置保存到apis数组
 * @param {string} dir 目录路径
 * @param {string} [parent='/'] 父路径
 * @return {array} 返回目录文件
 */
function eachDir(dir, parent = '/') {
  // 读取并遍历mock目录
  fs.readdirSync(dir).forEach((file) => {
    // 获取完整的路径
    const f = path.resolve(dir, file);
    // 读取文件信息
    const stat = fs.statSync(f);

    // 判断是否是json文件
    if (stat.isFile && /^(.+)\.json$/i.test(file)) {
      // 文件名
      const filename = RegExp.$1;
      // 解析路由
      parseMock(f, filename, parent);

      // 如果是目录，递归
      // @TODO .DS_Store 是目录？
    } else if (stat.isDirectory()) {
      // console.log(file);
      eachDir(f, `${parent}/${file}`);
    }
  });
}

/**
 * 解析数据
 * @param {string} f 文件路径
 * @param {string} filename
 * @param {string} parent
 */
function parseMock(f, filename, parent) {
  let data = fs.readFileSync(f, 'utf8');
  try {
    // data = deleteComments(data)
    data = JSON.parse(data);
    let path = `${base}/${parent}/${filename}`;
    // 移除多余的斜杠
    path = path.replace(/\/{2,}/g, '/');
    // push
    router.push({
      path,
      data,
    });
  } catch (e) {
    console.error(chalk.bgRed.black(' ERROR ') + chalk.red(` JSON ERROR on: ${f}`));
    console.error(chalk.red(e.stack));
  }
}

module.exports = function (mock, base) {
  init(mock, base);
  return router;
};
