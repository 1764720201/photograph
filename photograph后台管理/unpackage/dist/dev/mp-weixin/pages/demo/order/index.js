"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const db = common_vendor.ws.database();
    const orderList = common_vendor.ref([]);
    const waitNum = common_vendor.ref(0);
    const getNum = (state) => {
      db.collection("subscribe").where(`state==${state}`).count().then((res) => {
        switch (state) {
          case 0:
            waitNum.value = res.result.total;
            break;
        }
      });
    };
    common_vendor.onShow(() => {
      db.collection("subscribe").get().then((res) => {
        orderList.value = res.result.data;
      });
      getNum(0);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(waitNum.value),
        b: common_vendor.f(orderList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.time),
            b: common_vendor.t(item.types.map((item2) => {
              return item2.name;
            }).join("\u3001")),
            c: item._id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4a3a4a6"], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/demo/order/index.vue"]]);
wx.createPage(MiniProgramPage);
