"use strict";
const validator = {
  "username": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "minLength": 2
      }
    ],
    "label": "\u7528\u6237\u540D"
  },
  "password": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "password"
      },
      {
        "minLength": 6
      }
    ],
    "label": "\u5BC6\u7801"
  },
  "mobile": {
    "rules": [
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "label": "\u624B\u673A\u53F7\u7801"
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "\u6B63\u5E38",
            "value": 0
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
      }
    ],
    "defaultValue": 0,
    "label": "\u7528\u6237\u72B6\u6001"
  },
  "email": {
    "rules": [
      {
        "format": "string"
      },
      {
        "format": "email"
      }
    ],
    "label": "\u90AE\u7BB1"
  },
  "role": {
    "rules": [{
      "format": "array"
    }],
    "label": "\u89D2\u8272"
  },
  "last_login_date": {
    "rules": [{
      "format": "timestamp"
    }]
  }
};
const enumConverter = {
  "status_valuetotext": {
    "0": "\u6B63\u5E38",
    "1": "\u7981\u7528",
    "2": "\u5BA1\u6838\u4E2D",
    "3": "\u5BA1\u6838\u62D2\u7EDD"
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
exports.enumConverter = enumConverter;
exports.filterToWhere = filterToWhere;
exports.validator = validator;
