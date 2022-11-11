"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "uniNavMenu",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    mode: {
      type: String,
      default: "vertical"
    },
    collapse: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "#fff"
    },
    textColor: {
      type: String,
      default: "#303133"
    },
    activeTextColor: {
      type: String,
      default: "#42B983"
    },
    activeBackgroundColor: {
      type: String,
      default: "inherit"
    },
    activeKey: {
      type: String,
      default: "id"
    },
    active: {
      type: String,
      default: ""
    },
    defaultOpeneds: {
      type: Array,
      default() {
        return [];
      }
    },
    uniqueOpened: {
      type: Boolean,
      default: false
    },
    menuTrigger: {
      type: String,
      default: "hover"
    },
    router: {
      type: Boolean,
      default: false
    },
    collapseTransition: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeIndex: this.active
    };
  },
  watch: {
    active(newVal) {
      this.activeIndex = newVal;
    },
    activeIndex(newVal, oldVal) {
      if (this.itemChildrens.length > 0) {
        let isActive = false;
        for (let i = 0; i < this.itemChildrens.length; i++) {
          const item = this.itemChildrens[i];
          isActive = this.isActive(item);
          if (isActive)
            break;
        }
        if (!isActive) {
          this.closeAll();
        }
      }
    }
  },
  created() {
    this.itemChildrens = [];
    this.subChildrens = [];
  },
  methods: {
    select(key, keyPath) {
      this.$emit("select", key, keyPath);
    },
    open(key, keyPath) {
      this.$emit("open", key, keyPath);
    },
    close(key, keyPath) {
      this.$emit("close", key, keyPath);
    },
    isActive(subItem) {
      let active = "";
      let isActive = false;
      if (typeof subItem.index === "object") {
        active = subItem.index[this.activeKey] || "";
      } else {
        active = subItem.index;
      }
      if (subItem.index && this.activeIndex === active) {
        isActive = true;
        subItem.$subMenu.forEach((item, index) => {
          if (!item.disabled && !subItem.disabled) {
            subItem.indexPath.push(item.index);
            item.isOpen = true;
          }
        });
        if (!subItem.active) {
          subItem.onClickItem("init");
        }
      }
      return isActive;
    },
    selectMenu(subMenu) {
      this.subChildrens.forEach((item, index) => {
        if (item === subMenu) {
          subMenu.isOpen = !subMenu.isOpen;
          subMenu.indexPath.push(subMenu.index);
        } else {
          if (item.isOpen && this.uniqueOpened)
            item.isOpen = false;
        }
      });
      subMenu.$subMenu.forEach((sub, idx) => {
        sub.isOpen = true;
        subMenu.indexPath.unshift(sub.index);
      });
      if (subMenu.isOpen) {
        this.open(subMenu.indexPath[subMenu.indexPath.length - 1], subMenu.indexPath);
      } else {
        this.close(subMenu.indexPath[subMenu.indexPath.length - 1], subMenu.indexPath);
      }
      subMenu.indexPath = [];
    },
    closeOtherActive(itemMenu) {
      itemMenu.indexPath = [];
      itemMenu.$subMenu.forEach((item) => {
        if (!item.disabled) {
          itemMenu.indexPath.push(item.index);
        }
      });
      this.itemChildrens.map((item) => {
        if (item.active) {
          item.active = false;
        }
        return item;
      });
    },
    closeAll() {
      this.subChildrens.forEach((item) => {
        if (item.isOpen) {
          item.isOpen = false;
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_menu_sidebar2 = common_vendor.resolveComponent("uni-menu-sidebar");
  _easycom_uni_menu_sidebar2();
}
const _easycom_uni_menu_sidebar = () => "../uni-menu-sidebar/uni-menu-sidebar.js";
if (!Math) {
  _easycom_uni_menu_sidebar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      data: $props.data
    }),
    b: $props.backgroundColor
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/uni-nav-menu/uni-nav-menu.vue"]]);
wx.createComponent(Component);
