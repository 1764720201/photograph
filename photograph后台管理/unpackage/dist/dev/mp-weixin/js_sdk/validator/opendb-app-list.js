"use strict";
const validator = {
  "appid": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "AppID"
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u5E94\u7528\u540D\u79F0"
  },
  "icon_url": {
    "rules": [{
      "format": "string"
    }],
    "label": "\u5E94\u7528\u56FE\u6807"
  },
  "introduction": {
    "rules": [{
      "format": "string"
    }],
    "label": "\u5E94\u7528\u7B80\u4ECB"
  },
  "description": {
    "rules": [{
      "format": "string"
    }],
    "label": "\u5E94\u7528\u63CF\u8FF0"
  },
  "screenshot": {
    "rules": [{
      "format": "array"
    }],
    "label": "\u5E94\u7528\u622A\u56FE"
  },
  "create_date": {
    "rules": [{
      "format": "timestamp"
    }],
    "label": "\u53D1\u884C\u65F6\u95F4"
  }
};
function filterToWhere(filter, command) {
  let where = {};
  for (let field in filter) {
    let {
      type,
      value
    } = filter[field];
    switch (type) {
      case "search":
        if (typeof value === "string" && value.length) {
          where[field] = new RegExp(value);
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = [];
          for (let s of value) {
            selectValue.push(command.eq(s));
          }
          where[field] = command.or(selectValue);
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0];
          let lt = value[1];
          where[field] = command.and([command.gte(gt), command.lte(lt)]);
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value;
          let startDate = new Date(s);
          let endDate = new Date(e);
          where[field] = command.and([command.gte(startDate), command.lte(endDate)]);
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value;
          where[field] = command.and([command.gte(startDate), command.lte(endDate)]);
        }
        break;
    }
  }
  return where;
}
const enumConverter = {};
const mpPlatform = {
  "mp_weixin": "\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F",
  "mp_alipay": "\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F",
  "mp_baidu": "\u767E\u5EA6\u5C0F\u7A0B\u5E8F",
  "mp_toutiao": "\u5B57\u8282\u5C0F\u7A0B\u5E8F",
  "mp_qq": "QQ\u5C0F\u7A0B\u5E8F",
  "mp_dingtalk": "\u9489\u9489\u5C0F\u7A0B\u5E8F",
  "mp_kuaishou": "\u5FEB\u624B\u5C0F\u7A0B\u5E8F",
  "mp_lark": "\u98DE\u4E66\u5C0F\u7A0B\u5E8F",
  "mp_jd": "\u4EAC\u4E1C\u5C0F\u7A0B\u5E8F",
  "quickapp": "\u5FEB\u5E94\u7528"
};
exports.enumConverter = enumConverter;
exports.filterToWhere = filterToWhere;
exports.mpPlatform = mpPlatform;
exports.validator = validator;
