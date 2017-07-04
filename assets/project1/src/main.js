// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import axios from 'axios';
import App from './App';
import router from './routers';

if (process.env.NODE_ENV === 'development') {
  require('./mock/index'); // eslint-disable-line
}

Vue.config.productionTip = false;

// axios.post('/a', {
//   firstName: 'Fred',
//   lastName: 'Flintstone',
// }).then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
// });


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
