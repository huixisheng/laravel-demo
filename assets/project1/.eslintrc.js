module.exports = {
  root: true,
  // parser: 'babel-eslint',
  // parserOptions: {
  //   sourceType: 'module'
  // },
  extends: 'style-guide',
  // extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [

  ],
  env: {
    browser: true,
  },
  globals: {

  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  rules: {

  },
};
