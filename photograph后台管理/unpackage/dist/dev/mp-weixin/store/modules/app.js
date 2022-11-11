"use strict";
const app = {
  namespaced: true,
  state: {
    inited: false,
    navMenu: [],
    routes: [],
    appName: process.env.VUE_APP_NAME || "uni-admin \u57FA\u7840\u6846\u67B6",
    appid: "__UNI__DBD4CF1"
  },
  mutations: {
    SET_APP_NAME: (state, appName) => {
      state.appName = appName;
    },
    SET_NAV_MENU: (state, navMenu) => {
      state.inited = true;
      state.navMenu = navMenu;
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes;
    }
  },
  actions: {
    init({
      commit,
      dispatch
    }) {
      dispatch("user/getUserInfo", null, {
        root: true
      });
    },
    setAppName({
      commit
    }, appName) {
      commit("SET_APP_NAME", appName);
    },
    setRoutes({
      commit
    }, routes) {
      commit("SET_ROUTES", routes);
    }
  }
};
exports.app = app;
