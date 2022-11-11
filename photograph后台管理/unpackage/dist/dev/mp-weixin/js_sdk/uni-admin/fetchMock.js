"use strict";
function fetchMock(url) {
  return Promise.resolve([]);
}
function initFetch(app) {
  app.config.globalProperties.$fetch = fetchMock;
}
exports.initFetch = initFetch;
