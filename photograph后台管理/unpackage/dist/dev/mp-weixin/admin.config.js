"use strict";
const config = {
  login: {
    url: "/uni_modules/uni-id-pages/pages/login/login-withpwd"
  },
  index: {
    url: "/pages/index/index"
  },
  error: {
    url: "/pages/error/404"
  },
  navBar: {
    logo: "/static/logo.png",
    langs: [{
      text: "\u4E2D\u6587\u7B80\u4F53",
      lang: "zh-Hans"
    }, {
      text: "\u4E2D\u6587\u7E41\u9AD4",
      lang: "zh-Hant"
    }, {
      text: "English",
      lang: "en"
    }],
    debug: {
      enable: true,
      engine: [{
        name: "\u767E\u5EA6",
        url: "https://www.baidu.com/baidu?wd=ERR_MSG"
      }, {
        name: "\u8C37\u6B4C",
        url: "https://www.google.com/search?q=ERR_MSG"
      }]
    }
  },
  sideBar: {
    staticMenu: [{
      menu_id: "demo",
      text: "\u7528\u6237",
      icon: "admin-icons-kaifashili",
      url: "",
      children: [{
        menu_id: "icons",
        text: "\u7528\u6237\u8BA2\u5355",
        icon: "admin-icons-icon",
        value: "/pages/demo/order/index"
      }]
    }]
  },
  uniStat: {
    uploadSourceMapCloudSpaceId: "",
    cloudSourceMapUrl: ""
  }
};
exports.config = config;
