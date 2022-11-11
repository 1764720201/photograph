"use strict";
const validator = {
  "role_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u552F\u4E00ID"
  },
  "role_name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u540D\u79F0"
  },
  "permission": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "\u6743\u9650"
  },
  "comment": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "\u5907\u6CE8"
  },
  "create_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ]
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
