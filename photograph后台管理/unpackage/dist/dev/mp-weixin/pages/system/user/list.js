"use strict";
const common_vendor = require("../../../common/vendor.js");
const js_sdk_validator_uniIdUsers = require("../../../js_sdk/validator/uni-id-users.js");
const db = common_vendor.ws.database();
const dbOrderBy = "last_login_date desc";
const dbSearchFields = ["username", "role.role_name", "mobile", "email"];
const pageSize = 20;
const pageCurrent = 1;
const orderByMapping = {
  "ascending": "asc",
  "descending": "desc"
};
const _sfc_main = {
  data() {
    return {
      query: "",
      where: "",
      orderby: dbOrderBy,
      orderByFieldName: "",
      selectedIndexs: [],
      pageSizeIndex: 0,
      pageSizeOption: [20, 50, 100, 500],
      tags: {},
      managerTags: [],
      queryTagid: "",
      options: {
        pageSize,
        pageCurrent,
        filterData: {
          "status_localdata": [
            {
              "text": "\u6B63\u5E38",
              "value": 0,
              "checked": true
            },
            {
              "text": "\u7981\u7528",
              "value": 1
            },
            {
              "text": "\u5BA1\u6838\u4E2D",
              "value": 2
            },
            {
              "text": "\u5BA1\u6838\u62D2\u7EDD",
              "value": 3
            }
          ]
        },
        ...js_sdk_validator_uniIdUsers.enumConverter
      },
      imageStyles: {
        width: 64,
        height: 64
      },
      exportExcel: {
        "filename": "uni-id-users.xls",
        "type": "xls",
        "fields": {
          "\u7528\u6237\u540D": "username",
          "\u624B\u673A\u53F7\u7801": "mobile",
          "\u7528\u6237\u72B6\u6001": "status",
          "\u90AE\u7BB1": "email",
          "\u89D2\u8272": "role",
          "last_login_date": "last_login_date"
        }
      },
      exportExcelData: [],
      noAppidWhatShouldIDoLink: "https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=makeup-dcloud-appid"
    };
  },
  onLoad(e) {
    this._filter = {};
    const tagid = e.tagid;
    if (tagid) {
      this.queryTagid = tagid;
      const options = {
        filterType: "select",
        filter: [tagid]
      };
      this.filterChange(options, "tags");
    }
  },
  onReady() {
    this.loadTags();
    if (!this.queryTagid) {
      this.$refs.udb.loadData();
    }
  },
  computed: {
    tagsData() {
      const dynamic_data = [];
      for (const key in this.tags) {
        const tag = {
          value: key,
          text: this.tags[key]
        };
        if (key === this.queryTagid) {
          tag.checked = true;
        }
        dynamic_data.push(tag);
      }
      return dynamic_data;
    },
    smsReceiver() {
      if (this.selectedIndexs.length) {
        var dataList = this.$refs.udb.dataList;
        return this.selectedIndexs.map((i) => dataList[i]._id);
      }
    }
  },
  methods: {
    onqueryload(data) {
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        const roleArr = item.role.map((item2) => item2.role_name);
        item.role = roleArr.join("\u3001");
        const tagsArr = item.tags && item.tags.map((item2) => this.tags[item2]);
        item.tags = tagsArr;
        if (Array.isArray(item.dcloud_appid)) {
          item.dcloud_appid = item.dcloud_appid.join("\u3001");
        }
        item.last_login_date = this.$formatDate(item.last_login_date);
      }
      this.exportExcelData = data;
    },
    changeSize(pageSize2) {
      this.options.pageSize = pageSize2;
      this.options.pageCurrent = 1;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    openTagsPopup() {
      this.$refs.tagsPopup.open();
    },
    closeTagsPopup() {
      this.$refs.tagsPopup.close();
    },
    getWhere() {
      const query = this.query.trim();
      if (!query) {
        return "";
      }
      const queryRe = new RegExp(query, "i");
      return dbSearchFields.map((name) => queryRe + ".test(" + name + ")").join(" || ");
    },
    search() {
      const newWhere = this.getWhere();
      this.where = newWhere;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    loadData(clear = true) {
      this.$refs.udb.loadData({
        clear
      });
    },
    onPageChanged(e) {
      this.selectedIndexs.length = 0;
      this.$refs.table.clearSelection();
      this.$refs.udb.loadData({
        current: e.current
      });
    },
    navigateTo(url, clear) {
      common_vendor.index.navigateTo({
        url,
        events: {
          refreshData: () => {
            this.loadTags();
            this.loadData(clear);
          }
        }
      });
    },
    selectedItems() {
      var dataList = this.$refs.udb.dataList;
      return this.selectedIndexs.map((i) => dataList[i]._id);
    },
    delTable() {
      this.$refs.udb.remove(this.selectedItems(), {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    selectionChange(e) {
      this.selectedIndexs = e.detail.index;
    },
    confirmDelete(id) {
      this.$refs.udb.remove(id, {
        success: (res) => {
          this.$refs.table.clearSelection();
        }
      });
    },
    sortChange(e, name) {
      this.orderByFieldName = name;
      if (e.order) {
        this.orderby = name + " " + orderByMapping[e.order];
      } else {
        this.orderby = "";
      }
      this.$refs.table.clearSelection();
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    filterChange(e, name) {
      this._filter[name] = {
        type: e.filterType,
        value: e.filter
      };
      let newWhere = js_sdk_validator_uniIdUsers.filterToWhere(this._filter, db.command);
      if (Object.keys(newWhere).length) {
        this.where = newWhere;
      } else {
        this.where = "";
      }
      this.$nextTick(() => {
        this.$refs.udb.loadData();
      });
    },
    loadTags() {
      db.collection("uni-id-tag").limit(500).get().then((res) => {
        res.result.data.map((item) => {
          this.tags[item.tagid] = item.name;
        });
      }).catch((err) => {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: err.message,
          showCancel: false
        });
      });
    },
    managerMultiTag() {
      const ids = this.selectedItems();
      db.collection("uni-id-users").where({
        _id: db.command.in(ids)
      }).update({
        tags: this.managerTags
      }).then(() => {
        common_vendor.index.showToast({
          title: "\u4FEE\u6539\u6807\u7B7E\u6210\u529F",
          duration: 2e3
        });
        this.$refs.table.clearSelection();
        this.managerTags = [];
        this.loadData();
        this.closeTagsPopup();
      }).catch((err) => {
        common_vendor.index.showModal({
          content: err.message || "\u8BF7\u6C42\u670D\u52A1\u5931\u8D25",
          showCancel: false
        });
      }).finally((err) => {
        common_vendor.index.hideLoading();
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_stat_breadcrumb2 = common_vendor.resolveComponent("uni-stat-breadcrumb");
  const _easycom_uni_th2 = common_vendor.resolveComponent("uni-th");
  const _easycom_uni_tr2 = common_vendor.resolveComponent("uni-tr");
  const _easycom_uni_td2 = common_vendor.resolveComponent("uni-td");
  const _easycom_uni_link2 = common_vendor.resolveComponent("uni-link");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_dateformat2 = common_vendor.resolveComponent("uni-dateformat");
  const _easycom_uni_table2 = common_vendor.resolveComponent("uni-table");
  const _easycom_uni_pagination2 = common_vendor.resolveComponent("uni-pagination");
  const _easycom_unicloud_db2 = common_vendor.resolveComponent("unicloud-db");
  const _easycom_fix_window2 = common_vendor.resolveComponent("fix-window");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_batch_sms2 = common_vendor.resolveComponent("batch-sms");
  (_easycom_uni_stat_breadcrumb2 + _easycom_uni_th2 + _easycom_uni_tr2 + _easycom_uni_td2 + _easycom_uni_link2 + _easycom_uni_tag2 + _easycom_uni_dateformat2 + _easycom_uni_table2 + _easycom_uni_pagination2 + _easycom_unicloud_db2 + _easycom_fix_window2 + _easycom_uni_data_checkbox2 + _easycom_uni_popup2 + _easycom_batch_sms2)();
}
const _easycom_uni_stat_breadcrumb = () => "../../../components/uni-stat-breadcrumb/uni-stat-breadcrumb.js";
const _easycom_uni_th = () => "../../../uni_modules/uni-table/components/uni-th/uni-th.js";
const _easycom_uni_tr = () => "../../../uni_modules/uni-table/components/uni-tr/uni-tr.js";
const _easycom_uni_td = () => "../../../uni_modules/uni-table/components/uni-td/uni-td.js";
const _easycom_uni_link = () => "../../../uni_modules/uni-link/components/uni-link/uni-link.js";
const _easycom_uni_tag = () => "../../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_dateformat = () => "../../../uni_modules/uni-dateformat/components/uni-dateformat/uni-dateformat.js";
const _easycom_uni_table = () => "../../../uni_modules/uni-table/components/uni-table/uni-table.js";
const _easycom_uni_pagination = () => "../../../uni_modules/uni-pagination/components/uni-pagination/uni-pagination.js";
const _easycom_unicloud_db = () => "../../../node-modules/@dcloudio/uni-components/lib/unicloud-db/unicloud-db.js";
const _easycom_fix_window = () => "../../../components/fix-window/fix-window.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_batch_sms = () => "../../../components/batch-sms/batch-sms.js";
if (!Math) {
  (_easycom_uni_stat_breadcrumb + _easycom_uni_th + _easycom_uni_tr + _easycom_uni_td + _easycom_uni_link + _easycom_uni_tag + _easycom_uni_dateformat + _easycom_uni_table + _easycom_uni_pagination + _easycom_unicloud_db + _easycom_fix_window + _easycom_uni_data_checkbox + _easycom_uni_popup + _easycom_batch_sms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.search && $options.search(...args)),
    b: _ctx.$t("common.placeholder.query"),
    c: $data.query,
    d: common_vendor.o(($event) => $data.query = $event.detail.value),
    e: common_vendor.t(_ctx.$t("common.button.search")),
    f: common_vendor.o((...args) => $options.search && $options.search(...args)),
    g: common_vendor.t(_ctx.$t("common.button.add")),
    h: common_vendor.o(($event) => $options.navigateTo("./add")),
    i: common_vendor.t(_ctx.$t("common.button.batchDelete")),
    j: !$data.selectedIndexs.length,
    k: common_vendor.o((...args) => $options.delTable && $options.delTable(...args)),
    l: !$data.selectedIndexs.length,
    m: common_vendor.o((...args) => $options.openTagsPopup && $options.openTagsPopup(...args)),
    n: common_vendor.o(($event) => _ctx.$refs.batchSms.open()),
    o: common_vendor.w(({
      data,
      pagination,
      loading,
      error,
      options
    }, s0, i0) => {
      return {
        a: "66c0c17b-4-" + i0 + "," + ("66c0c17b-3-" + i0),
        b: "66c0c17b-5-" + i0 + "," + ("66c0c17b-3-" + i0),
        c: "66c0c17b-6-" + i0 + "," + ("66c0c17b-3-" + i0),
        d: "66c0c17b-7-" + i0 + "," + ("66c0c17b-3-" + i0),
        e: common_vendor.p({
          align: "center",
          ["filter-type"]: "select",
          ["filter-data"]: options.filterData.status_localdata
        }),
        f: "66c0c17b-8-" + i0 + "," + ("66c0c17b-3-" + i0),
        g: "66c0c17b-9-" + i0 + "," + ("66c0c17b-3-" + i0),
        h: "66c0c17b-10-" + i0 + "," + ("66c0c17b-3-" + i0),
        i: "66c0c17b-11-" + i0 + "," + ("66c0c17b-3-" + i0),
        j: "66c0c17b-12-" + i0 + "," + ("66c0c17b-3-" + i0),
        k: "66c0c17b-13-" + i0 + "," + ("66c0c17b-3-" + i0),
        l: "66c0c17b-3-" + i0 + "," + ("66c0c17b-2-" + i0),
        m: common_vendor.f(data, (item, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item.username),
            b: "66c0c17b-15-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            c: common_vendor.t(item.nickname),
            d: "66c0c17b-16-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            e: common_vendor.t(item.mobile),
            f: "66c0c17b-17-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            g: common_vendor.t(options.status_valuetotext[item.status]),
            h: "66c0c17b-18-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            i: "66c0c17b-20-" + i0 + "-" + i1 + "," + ("66c0c17b-19-" + i0 + "-" + i1),
            j: common_vendor.p({
              href: "mailto:" + item.email,
              text: item.email
            }),
            k: "66c0c17b-19-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            l: common_vendor.t(item.role),
            m: "66c0c17b-21-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            n: item.tags
          }, item.tags ? {
            o: common_vendor.f(item.tags, (tag, k2, i2) => {
              return {
                a: "66c0c17b-23-" + i0 + "-" + i1 + "-" + i2 + "," + ("66c0c17b-22-" + i0 + "-" + i1),
                b: common_vendor.p({
                  type: "primary",
                  inverted: true,
                  size: "small",
                  text: tag
                })
              };
            })
          } : {}, {
            p: "66c0c17b-22-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            q: item.dcloud_appid === void 0
          }, item.dcloud_appid === void 0 ? {
            r: "66c0c17b-25-" + i0 + "-" + i1 + "," + ("66c0c17b-24-" + i0 + "-" + i1),
            s: common_vendor.p({
              href: $data.noAppidWhatShouldIDoLink
            })
          } : {}, {
            t: common_vendor.t(item.dcloud_appid),
            v: "66c0c17b-24-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            w: "66c0c17b-27-" + i0 + "-" + i1 + "," + ("66c0c17b-26-" + i0 + "-" + i1),
            x: common_vendor.p({
              threshold: [0, 0],
              date: item.last_login_date
            }),
            y: "66c0c17b-26-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            z: common_vendor.o(($event) => $options.navigateTo("./edit?id=" + item._id, false)),
            A: common_vendor.o(($event) => $options.confirmDelete(item._id)),
            B: "66c0c17b-28-" + i0 + "-" + i1 + "," + ("66c0c17b-14-" + i0 + "-" + i1),
            C: index,
            D: "66c0c17b-14-" + i0 + "-" + i1 + "," + ("66c0c17b-2-" + i0)
          });
        }),
        n: common_vendor.sr("table", "66c0c17b-2-" + i0 + ",66c0c17b-1"),
        o: "66c0c17b-2-" + i0 + ",66c0c17b-1",
        p: common_vendor.p({
          loading,
          emptyText: error.message || _ctx.$t("common.empty"),
          border: true,
          stripe: true,
          type: "selection"
        }),
        q: "66c0c17b-29-" + i0 + ",66c0c17b-1",
        r: common_vendor.o(($event) => pagination.current = $event),
        s: common_vendor.p({
          ["show-iconn"]: true,
          ["show-page-size"]: true,
          ["page-size"]: pagination.size,
          total: pagination.count,
          modelValue: pagination.current
        }),
        t: i0,
        v: s0
      };
    }, {
      name: "d",
      path: "o",
      vueId: "66c0c17b-1"
    }),
    p: common_vendor.o(($event) => $options.filterChange($event, "username")),
    q: common_vendor.o(($event) => $options.sortChange($event, "username")),
    r: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    s: common_vendor.o(($event) => $options.filterChange($event, "nickname")),
    t: common_vendor.o(($event) => $options.sortChange($event, "nickname")),
    v: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    w: common_vendor.o(($event) => $options.filterChange($event, "mobile")),
    x: common_vendor.o(($event) => $options.sortChange($event, "mobile")),
    y: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    z: common_vendor.o(($event) => $options.filterChange($event, "status")),
    A: common_vendor.o(($event) => $options.filterChange($event, "email")),
    B: common_vendor.o(($event) => $options.sortChange($event, "email")),
    C: common_vendor.p({
      align: "center",
      ["filter-type"]: "search",
      sortable: true
    }),
    D: common_vendor.p({
      align: "center"
    }),
    E: common_vendor.o(($event) => $options.filterChange($event, "tags")),
    F: common_vendor.p({
      align: "center",
      ["filter-type"]: "select",
      ["filter-data"]: $options.tagsData
    }),
    G: common_vendor.p({
      align: "center"
    }),
    H: common_vendor.o(($event) => $options.filterChange($event, "last_login_date")),
    I: common_vendor.o(($event) => $options.sortChange($event, "last_login_date")),
    J: common_vendor.p({
      align: "center",
      ["filter-type"]: "timestamp",
      sortable: true
    }),
    K: common_vendor.p({
      align: "center"
    }),
    L: common_vendor.p({
      align: "center"
    }),
    M: common_vendor.p({
      align: "center"
    }),
    N: common_vendor.p({
      align: "center"
    }),
    O: common_vendor.p({
      align: "center"
    }),
    P: common_vendor.p({
      align: "center"
    }),
    Q: common_vendor.p({
      align: "center"
    }),
    R: common_vendor.p({
      align: "center"
    }),
    S: common_vendor.p({
      align: "center"
    }),
    T: common_vendor.p({
      align: "center"
    }),
    U: common_vendor.t(_ctx.$t("common.button.edit")),
    V: common_vendor.t(_ctx.$t("common.button.delete")),
    W: common_vendor.p({
      align: "center"
    }),
    X: common_vendor.o($options.selectionChange),
    Y: common_vendor.o($options.onPageChanged),
    Z: common_vendor.o($options.changeSize),
    aa: common_vendor.sr("udb", "66c0c17b-1"),
    ab: common_vendor.o($options.onqueryload),
    ac: common_vendor.p({
      collection: "uni-id-users,uni-id-roles",
      field: "username,nickname,mobile,status,email,role{role_name},dcloud_appid,tags,last_login_date",
      where: $data.where,
      ["page-data"]: "replace",
      orderby: $data.orderby,
      getcount: true,
      ["page-size"]: $data.options.pageSize,
      ["page-current"]: $data.options.pageCurrent,
      options: $data.options,
      loadtime: "manual"
    }),
    ad: common_vendor.sr("checkbox", "66c0c17b-32,66c0c17b-31"),
    ae: common_vendor.o(($event) => $data.managerTags = $event),
    af: common_vendor.p({
      multiple: true,
      collection: "uni-id-tag",
      field: "tagid as value, name as text",
      modelValue: $data.managerTags
    }),
    ag: common_vendor.o((...args) => $options.managerMultiTag && $options.managerMultiTag(...args)),
    ah: common_vendor.sr("tagsPopup", "66c0c17b-31"),
    ai: common_vendor.p({
      type: "center"
    }),
    aj: common_vendor.t($options.smsReceiver),
    ak: common_vendor.sr("batchSms", "66c0c17b-33"),
    al: common_vendor.p({
      toType: "user",
      receiver: $options.smsReceiver
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/pages/system/user/list.vue"]]);
wx.createPage(MiniProgramPage);
