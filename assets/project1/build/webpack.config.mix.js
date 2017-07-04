/* global Config, Mix */
const path = require('path')
let config = require('./webpack.base.conf')
const WebpackShellPlugin = require('webpack-shell-plugin')
const webpack = require('webpack')
const { deployAssets, gitPush } = require('./laravel-mix/deploy')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

class DoneCallbackPlugin {
  /**
   * Create a new plugin instance.
   *
   * @param {Function} callback
   */
  constructor (callback) {
    this.callback = callback
  }

  /**
   * Apply the plugin.
   *
   * @param {Object} compiler
   */
  apply (compiler) {
    compiler.plugin('done', this.callback)
  }
}

module.exports = function (mix, platformUrl) {
  const rootPath = Mix.paths.rootPath
  mix.setPublicPath('public/dist/project1/')
  mix.js('assets/project1/src/main.js', './')
      .version()
      .then((stats) => {
        // console.log('rootPath:%s', rootPath)

      })

  let plugins = []
  if (process.env.NODE_ENV === 'production') {
    // plugins.push(new WebpackShellPlugin({
    //   onBuildStart: ['echo "WebpackShellPlugin onBuildStart"']
    //   // onBuildEnd: ['node build/deploy-cqc.js']
    // }))
  }
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV
    })
  )
  plugins.push(
    new DoneCallbackPlugin((stats) => {
      if (process.env.NODE_ENV === 'production') {
        let srcResource = path.join(rootPath, 'public/dist/project1')
        let distCdnAssets = path.join(path.dirname(rootPath), 'cdnAssets/s/admin-lavavel/')
        deployAssets(srcResource, distCdnAssets)
        console.log(Object.keys(stats))
      }
    })
  )

  mix.webpackConfig({
    output: {
      hashDigestLength: 6
    },
    resolve: config.resolve,
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          exclude: /(node_modules|vendors)/,
          include: [resolve('src'), resolve('test')],
          options: {
            formatter: require('eslint-friendly-formatter'),
            quiet: true,
            emitError: true
          }
        }
      ]
    },
    plugins: plugins
  })

  if (process.env.NODE_ENV === 'development') {
    // mix.browserSync('a.cqc.cosmeapp.net');
    mix.browserSync({
      // host: "192.168.10.10",
      socket: {
        domain: 'localhost:3000'
      },
      // @todo 读取.env
      proxy: getDomain(platformUrl),
      files: [
        'app/**/*.php',
        'src/***/*.vue',
        'src/***/*.css',
        'src/***/*.js',
        'Modules/**/Resources/views/**/*.php',
        'Modules/**/Resources/assets/js/**/*.js',
        'Modules/**/Resources/assets/js/**/*.vue',
        'Modules/**/Resources/assets/css/**/*.css'
      ]
    })
  }
  // console.log('Config:', Config)
  // console.log('mix:', mix)
  // console.log('Mix:', Mix);
  console.log(Mix.paths.rootPath)

  // mix.setPublicPath('public/dist/cqc/');
  // mix.js('Modules/Cqc/resources/assets/js/app.js', 'public/dist/cqc/js')
  //    .styles('Modules/Cqc/resources/assets/css/app.css', 'public/dist/cqc/css/app.css');
}

function getDomain (platformUrl) {
  const url = require('url')
  const fs = require('fs')
  const dotenv = require('dotenv')
  const path = require('path')
  const envPath = path.join(Mix.paths.rootPath, '.env')
  let envConfig = dotenv.parse(fs.readFileSync(envPath))
  if (envConfig['APP_ENV']) {
    const AppEnvPath = path.join(Mix.paths.rootPath, `.${envConfig['APP_ENV']}.env`)
    envConfig = Object.assign(envConfig, dotenv.parse(fs.readFileSync(AppEnvPath)))
  }
  const href = url.parse(envConfig[platformUrl])
  // @todo 根据platform获取各个平台的domain

  // const path = require('path')
  // const envFile = path.join(__dirname, '.local.env')
  // let envFileContent = fs.readFileSync(envFile, 'utf-8')
  // const reg = /URL_OPS_ADMIN=http\:\/\/(.*?)[\s|\/]/ig;
  // let domain = ''
  // envFileContent.replace(reg, function (match, p1) {
  //   console.log('p1', p1)
  //   domain = p1
  //   return p1
  // })
  console.log(' envConfig[platformUrl]', href.hostname)
  return href.hostname
}
