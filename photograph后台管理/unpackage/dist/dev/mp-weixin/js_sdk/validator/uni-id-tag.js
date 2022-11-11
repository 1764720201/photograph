"use strict";
const validator = {
  "tagid": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u6807\u7B7E\u7684tagid"
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
    "label": "\u6807\u7B7E\u540D\u79F0"
  },
  "description": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "\u6807\u7B7E\u63CF\u8FF0"
  }
};
const enumConverter = {};
function filterToWhere(filter, command) {
  let where = {};
  for (let field in filter) {
    let { type, value } = filter[field];
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
exports.enumConverter = enumConverter;
exports.filterToWhere = filterToWhere;
exports.validator = validator;
