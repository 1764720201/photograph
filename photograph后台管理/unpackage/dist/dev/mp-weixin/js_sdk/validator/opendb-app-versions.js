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
    "rules": [{
      "format": "string"
    }],
    "label": "\u5E94\u7528\u540D\u79F0"
  },
  "title": {
    "rules": [{
      "format": "string"
    }],
    "label": "\u66F4\u65B0\u6807\u9898"
  },
  "contents": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u66F4\u65B0\u5185\u5BB9"
  },
  "platform": {
    "rules": [
      {
        "required": true
      },
      {
        "range": [
          {
            "value": "Android",
            "text": "\u5B89\u5353"
          },
          {
            "value": "iOS",
            "text": "\u82F9\u679C"
          }
        ]
      }
    ],
    "label": "\u5E73\u53F0"
  },
  "type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      },
      {
        "range": [
          {
            "value": "native_app",
            "text": "\u539F\u751FApp\u5B89\u88C5\u5305"
          },
          {
            "value": "wgt",
            "text": "wgt\u8D44\u6E90\u5305"
          }
        ]
      }
    ],
    "label": "\u5B89\u88C5\u5305\u7C7B\u578B"
  },
  "version": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "\u7248\u672C\u53F7"
  },
  "min_uni_version": {
    "rules": [{
      "format": "string"
    }],
    "label": "\u539F\u751FApp\u6700\u4F4E\u7248\u672C"
  },
  "url": {
    "rules": [{
      "required": true
    }, {
      "format": "string"
    }],
    "label": "\u94FE\u63A5"
  },
  "stable_publish": {
    "rules": [{
      "format": "bool"
    }],
    "label": "\u4E0A\u7EBF\u53D1\u884C"
  },
  "create_date": {
    "rules": [{
      "format": "timestamp"
    }],
    "label": "\u4E0A\u4F20\u65F6\u95F4"
  },
  "is_silently": {
    "rules": [{
      "format": "bool"
    }],
    "label": "\u9759\u9ED8\u66F4\u65B0",
    "defaultValue": false
  },
  "is_mandatory": {
    "rules": [{
      "format": "bool"
    }],
    "label": "\u5F3A\u5236\u66F4\u65B0",
    "defaultValue": false
  },
  "store_list": {
    "rules": [{
      "format": "array"
    }],
    "label": "\u5E94\u7528\u5E02\u573A"
  }
};
const enumConverter = {
  "platform_valuetotext": [
    {
      "value": "Android",
      "text": "\u5B89\u5353"
    },
    {
      "value": "iOS",
      "text": "\u82F9\u679C"
    }
  ],
  "type_valuetotext": {
    "native_app": "\u539F\u751FApp\u5B89\u88C5\u5305",
    "wgt": "wgt\u8D44\u6E90\u5305"
  }
};
exports.enumConverter = enumConverter;
exports.validator = validator;
