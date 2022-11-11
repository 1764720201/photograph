"use strict";
const common_vendor = require("../../../common/vendor.js");
const components_uniDataMenu_util = require("../../../components/uni-data-menu/util.js");
common_vendor.ws.database();
const dbOrderBy = "create_date asc";
const pageSize = 2e4;
const pageCurrent = 1;
const pluginMenuJsons = [];
{
  const rootModules = /* @__PURE__ */ Object.assign({});
  for (const modulePath in rootModules) {
    const json = modulePath.replace(/^..\/..\/..\//, "");
    rootModules[modulePath]().then((module) => {
      module = module.default ? module.default : module;
      module.forEach((item) => {
        item.json = json;
        pluginMenuJsons.push(item);
      });
    });
  }
  const pluginModules = /* @__PURE__ */ Object.assign({});
  for (const modulePath in pluginModules) {
    const json = modulePath.replace(/^..\/..\/..\//, "");
    pluginModules[modulePath]().then((module) => {
      module = module.default ? module.default : module;
      module.forEach((item) => {
        item.json = json;
        pluginMenuJsons.push(item);
      });
    });
  }
}
function getParents(menus, id, depth = 0) {
  menus.forEach((menu) => {
    if (menu.menu_id === id && menu.parent_id) {
      depth = depth + 1 + getParents(menus, menu.parent_id, depth);
    }
  });
  return depth;
}
function getChildren(menus, id, childrenIds = []) {
  if (menus.find((menu) => menu.parent_id === id)) {
    menus.forEach((item) => {
      if (item.parent_id === id) {
        childrenIds.push(item._id);
        getChildren(menus, item.menu_id, childrenIds);
      }
    });
  }
  return childrenIds;
}
const _sfc_main = {
  data() {
    return {
      query: "",
      where: "",
      orderby: dbOrderBy,
      options: {
        pageSize,
        pageCurrent
      },
      selectedIndexs: [],
      loading: true,
      menus: [],
      errMsg: "",
      currentTab: "menus",
      selectedPluginMenuIndexs: []
    };
  },
  computed: {
    pluginMenus() {
      const menus = [];
      if (!this.$hasRole("admin")) {
        return menus;
      }
      const dbMenus = this.menus;
      if (!dbMenus.length) {
        return menus;
      }
      pluginMenuJsons.forEach((menu) => {
        if (!dbMenus.find((item) => item.menu_id === menu.menu_id)) {
          menus.push(menu);
        }
      });
      return menus;
    }
  },
  watch: {
    pluginMenus(val) {
      if (!val.length) {
        this.currentTab = "menus";
      }
    }
  },
  methods: {
    getSortMenu(menuList) {
      menuList.map((item) => {
        if (!menuList.some((subMenuItem) => subMenuItem.parent_id === item.menu_id)) {
          item.isLeafNode = true;
        }
      });
      return components_uniDataMenu_util.buildMenus(menuList);
    },
    onqueryload(data) {
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        const depth = getParents(data, item.menu_id);
        item.name = (depth ? "\u3000".repeat(depth) + "|-" : "") + item.name;
      }
      const menuTree = this.getSortMenu(data);
      const sortMenus = [];
      this.patTree(menuTree, sortMenus);
      data.length = 0;
      data.push(...sortMenus);
      this.menus = data;
    },
    patTree(tree, sortMenus) {
      tree.forEach((item) => {
        sortMenus.push(item);
        if (item.children.length) {
          this.patTree(item.children, sortMenus);
        }
      });
      return sortMenus;
    },
    switchTab(tab) {
      this.currentTab = tab;
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadData(clear);
          }
        }
      });
    },
    confirmDelete(menu) {
      let ids = menu._id;
      let content = "\u662F\u5426\u5220\u9664\u8BE5\u83DC\u5355\uFF1F";
      const children = getChildren(this.menus, menu.menu_id);
      if (children.length)
        content = "\u662F\u5426\u5220\u9664\u8BE5\u83DC\u5355\u53CA\u5176\u5B50\u83DC\u5355\uFF1F";
      ids = [ids, ...children];
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content,
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          this.$refs.udb.remove(ids, {
            needConfirm: false
          });
        }
      });
    },
    pluginMenuSelectChange(e) {
      this.selectedPluginMenuIndexs = e.detail.index;
    },
    addPluginMenus(confirmContent) {
      if (!this.selectedPluginMenuIndexs.length) {
        return common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u9009\u62E9\u8981\u6DFB\u52A0\u7684\u83DC\u5355\uFF01",
          showCancel: false
        });
      }
      const pluginMenus = this.pluginMenus;
      const menus = [];
      this.selectedPluginMenuIndexs.forEach((i) => {
        const menu = pluginMenus[i];
        if (menu) {
          const dbMenu = JSON.parse(JSON.stringify(menu));
          delete dbMenu.json;
          menus.push(dbMenu);
        }
      });
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u60A8\u786E\u8BA4\u8981\u6DFB\u52A0\u5DF2\u9009\u4E2D\u7684\u83DC\u5355\u5417\uFF1F",
        success: (res) => {
          if (!res.confirm) {
            return;
          }
          common_vendor.index.showLoading({
            mask: true
          });
          const checkAll = menus.length === pluginMenus.length;
          common_vendor.ws.database().collection("opendb-admin-menus").add(menus).then((res2) => {
            common_vendor.index.showModal({
              title: "\u63D0\u793A",
              content: "\u6DFB\u52A0\u83DC\u5355\u6210\u529F\uFF01",
              showCancel: false,
              success: () => {
                this.$refs.pluginMenusTable.clearSelection();
                if (checkAll) {
                  this.currentTab = "menus";
                }
                this.loadData();
              }
            });
          }).catch((err) => {
            common_vendor.index.showModal({
              title: "\u63D0\u793A",
              content: err.message,
              showCancel: false
            });
          }).finally(() => {
            common_vendor.index.hideLoading();
          });
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_badge2 = common_vendor.resolveComponent("uni-badge");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_badge2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_table2 + _easycom_unicloud_db2 + _easycom_fix_window2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_badge = () => "../../../uni_modules/uni-badge/components/uni-badge/uni-badge.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_badge + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_table + _easycom_unicloud_db + _easycom_fix_window)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("menu.text.menuManager")),
    b: common_vendor.o(($event) => $options.switchTab("menus")),
    c: $data.currentTab === "menus" ? 1 : "",
    d: $options.pluginMenus.length
  }, $options.pluginMenus.length ? {
    e: common_vendor.t(_ctx.$t("menu.text.additiveMenu")),
    f: common_vendor.p({
      text: $options.pluginMenus.length,
      type: "error"
    }),
    g: common_vendor.o(($event) => $options.switchTab("pluginMenus")),
    h: $data.currentTab === "pluginMenus" ? 1 : ""
  } : {}, {
    i: common_vendor.t(_ctx.$t("menu.button.addFirstLevelMenu")),
    j: common_vendor.o(($event) => $options.navigateTo("./add")),
    k: common_vendor.w(({
      data,
      pagination,
      loading,
      error
    }, s0, i0) => {
      return {
        a: "c04fc332-5-" + i0 + "," + ("c04fc332-4-" + i0),
        b: "c04fc332-6-" + i0 + "," + ("c04fc332-4-" + i0),
        c: "c04fc332-7-" + i0 + "," + ("c04fc332-4-" + i0),
        d: "c04fc332-8-" + i0 + "," + ("c04fc332-4-" + i0),
        e: "c04fc332-9-" + i0 + "," + ("c04fc332-4-" + i0),
        f: "c04fc332-10-" + i0 + "," + ("c04fc332-4-" + i0),
        g: "c04fc332-4-" + i0 + "," + ("c04fc332-3-" + i0),
        h: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item.sort),
            b: "c04fc332-12-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            c: common_vendor.t(item.name),
            d: "c04fc332-13-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            e: common_vendor.t(item.menu_id),
            f: "c04fc332-14-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            g: common_vendor.t(item.url),
            h: "c04fc332-15-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            i: common_vendor.t(item.enable ? "\u5DF2\u542F\u7528" : "\u672A\u542F\u7528"),
            j: !item.enable ? 1 : "",
            k: "c04fc332-16-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            l: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false)),
            m: item.menu_id !== "system_menu" && item.menu_id !== "system_management"
          }, item.menu_id !== "system_menu" && item.menu_id !== "system_management" ? {
            n: common_vendor.t(_ctx.$t("common.button.delete")),
            o: common_vendor.o(($event) => $options.confirmDelete(item))
          } : {}, {
            p: !item.url
          }, !item.url ? {
            q: common_vendor.t(_ctx.$t("menu.button.addChildMenu")),
            r: common_vendor.o(($event) => $options.navigateTo("./add?parent_id=" + item.menu_id, false))
          } : {}, {
            s: "c04fc332-17-" + i0 + "-" + i1 + "," + ("c04fc332-11-" + i0 + "-" + i1),
            t: index,
            v: "c04fc332-11-" + i0 + "-" + i1 + "," + ("c04fc332-3-" + i0)
          });
        }),
        i: "c04fc332-3-" + i0 + ",c04fc332-2",
        j: common_vendor.p({
          loading,
          emptyText: $data.errMsg || _ctx.$t("common.empty"),
          border: true,
          stripe: true
        }),
        k: i0,
        l: s0
      };
    }, {
      name: "d",
      path: "k",
      vueId: "c04fc332-2"
    }),
    l: common_vendor.p({
      align: "center"
    }),
    m: common_vendor.p({
      width: "200",
      align: "center"
    }),
    n: common_vendor.p({
      align: "center"
    }),
    o: common_vendor.p({
      align: "center"
    }),
    p: common_vendor.p({
      width: "100",
      align: "center"
    }),
    q: common_vendor.p({
      align: "center"
    }),
    r: common_vendor.p({
      align: "center"
    }),
    s: common_vendor.p({
      align: "center"
    }),
    t: common_vendor.t(_ctx.$t("common.button.edit")),
    v: common_vendor.p({
      align: "center"
    }),
    w: common_vendor.sr("udb", "c04fc332-2"),
    x: common_vendor.o($options.onqueryload),
    y: common_vendor.p({
      collection: "opendb-admin-menus",
      options: $data.options,
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent
    }),
    z: $data.currentTab === "menus",
    A: common_vendor.o((...args) => $options.addPluginMenus && $options.addPluginMenus(...args)),
    B: common_vendor.p({
      align: "center"
    }),
    C: common_vendor.p({
      align: "center"
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.f($options.pluginMenus, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.menu_id),
        c: "c04fc332-24-" + i0 + "," + ("c04fc332-23-" + i0),
        d: common_vendor.t(item.url),
        e: "c04fc332-25-" + i0 + "," + ("c04fc332-23-" + i0),
        f: common_vendor.t(item.json),
        g: "c04fc332-26-" + i0 + "," + ("c04fc332-23-" + i0),
        h: index,
        i: "c04fc332-23-" + i0 + ",c04fc332-18"
      };
    }),
    F: common_vendor.sr("pluginMenusTable", "c04fc332-18"),
    G: common_vendor.o($options.pluginMenuSelectChange),
    H: common_vendor.p({
      type: "selection",
      border: true,
      stripe: true
    }),
    I: $data.currentTab === "pluginMenus"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/menu/list.vue"]]);
wx.createPage(MiniProgramPage);
