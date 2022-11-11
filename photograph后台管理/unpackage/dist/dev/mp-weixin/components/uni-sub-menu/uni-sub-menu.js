"use strict";
const components_uniNavMenu_mixins_rootParent = require("../uni-nav-menu/mixins/rootParent.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uniSubMenu",
  mixins: [components_uniNavMenu_mixins_rootParent.rootParent],
  props: {
    index: {
      type: [String, Object],
      default() {
        return "";
      }
    },
    popperClass: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "#f5f5f5"
    }
  },
  data() {
    return {
      height: 0,
      oldheight: 0,
      isOpen: false,
      textColor: "#303133"
    };
  },
  computed: {
    paddingLeft() {
      return 20 + 20 * this.rootMenu.SubMenu.length + "px";
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    if (this.$menuParent) {
      const menuIndex = this.$menuParent.subChildrens.findIndex((item) => item === this);
      this.$menuParent.subChildrens.splice(menuIndex, 1);
    }
  },
  methods: {
    init() {
      this.rootMenu = {
        NavMenu: [],
        SubMenu: []
      };
      this.childrens = [];
      this.indexPath = [];
      this.getParentAll("SubMenu", this);
      this.$menuParent = this.getParent("uniNavMenu", this);
      this.textColor = this.$menuParent.textColor;
      this.$subMenu = this.rootMenu.SubMenu;
      if (this.$menuParent) {
        this.$menuParent.subChildrens.push(this);
      }
    },
    select() {
      if (this.disabled)
        return;
      this.$menuParent.selectMenu(this);
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.disabled ? "#999" : $data.textColor,
    b: $data.isOpen ? 1 : "",
    c: common_vendor.p({
      type: "arrowdown",
      color: "#bbb",
      size: "14"
    }),
    d: $props.disabled ? 1 : "",
    e: $options.paddingLeft,
    f: common_vendor.o((...args) => $options.select && $options.select(...args)),
    g: !$data.isOpen ? 1 : "",
    h: $props.backgroundColor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/uni-sub-menu/uni-sub-menu.vue"]]);
wx.createComponent(Component);
