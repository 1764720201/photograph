"use strict";
const rootParent = {
  methods: {
    getParentAll(name, parent) {
      parent = this.getParent(`uni${name}`, parent);
      if (parent) {
        this.rootMenu[name].push(parent);
        this.getParentAll(name, parent);
      }
    },
    getParent(name, parent, type) {
      parent = parent.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    }
  }
};
exports.rootParent = rootParent;
