"use strict";
const validator = {
  "menu_id": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ]
  },
  "icon": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "url": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "sort": {
    "rules": [
      {
        "format": "int"
      }
    ]
  },
  "parent_id": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "permission": {
    "rules": [
      {
        "format": "array"
      }
    ]
  },
  "enable": {
    "rules": [
      {
        "format": "bool"
      }
    ]
  }
};
exports.validator = validator;
