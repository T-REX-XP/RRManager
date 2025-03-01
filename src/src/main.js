import Vue from 'vue';
import App from './App.vue';

SYNO.namespace('SYNOCOMMUNITY.RRManager');

// @require SYNOCOMMUNITY.RRManager.ModalWindow
SYNOCOMMUNITY.RRManager.AppInstance = Vue.extend({
  components: { App },
  template: '<App/>',
});
