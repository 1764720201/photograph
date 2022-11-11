"use strict";
const uni_modules_uniIdPages_config = require("../config.js");
const { passwordStrength } = uni_modules_uniIdPages_config.config;
const passwordRules = {
  super: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  strong: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  medium: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$)[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{8,16}$/,
  weak: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]{6,16}$/
};
const ERROR = {
  normal: {
    noPwd: "\u8BF7\u8F93\u5165\u5BC6\u7801",
    noRePwd: "\u518D\u6B21\u8F93\u5165\u5BC6\u7801",
    rePwdErr: "\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4"
  },
  passwordStrengthError: {
    super: "\u5BC6\u7801\u5FC5\u987B\u5305\u542B\u5927\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u7B26\u53F7\uFF0C\u5BC6\u7801\u957F\u5EA6\u5FC5\u987B\u57288-16\u4F4D\u4E4B\u95F4",
    strong: "\u5BC6\u7801\u5FC5\u987B\u5305\u542B\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u7B26\u53F7\uFF0C\u5BC6\u7801\u957F\u5EA6\u5FC5\u987B\u57288-16\u4F4D\u4E4B\u95F4",
    medium: "\u5BC6\u7801\u5FC5\u987B\u4E3A\u5B57\u6BCD\u3001\u6570\u5B57\u548C\u7279\u6B8A\u7B26\u53F7\u4EFB\u610F\u4E24\u79CD\u7684\u7EC4\u5408\uFF0C\u5BC6\u7801\u957F\u5EA6\u5FC5\u987B\u57288-16\u4F4D\u4E4B\u95F4",
    weak: "\u5BC6\u7801\u5FC5\u987B\u5305\u542B\u5B57\u6BCD\uFF0C\u5BC6\u7801\u957F\u5EA6\u5FC5\u987B\u57286-16\u4F4D\u4E4B\u95F4"
  }
};
function validPwd(password) {
  if (passwordStrength && passwordRules[passwordStrength]) {
    if (!new RegExp(passwordRules[passwordStrength]).test(password)) {
      return ERROR.passwordStrengthError[passwordStrength];
    }
  }
  return true;
}
function getPwdRules(pwdName = "password", rePwdName = "password2") {
  const rules = {};
  rules[pwdName] = {
    rules: [
      {
        required: true,
        errorMessage: ERROR.normal.noPwd
      },
      {
        validateFunction: function(rule, value, data, callback) {
          const checkRes = validPwd(value);
          if (checkRes !== true) {
            callback(checkRes);
          }
          return true;
        }
      }
    ]
  };
  if (rePwdName) {
    rules[rePwdName] = {
      rules: [
        {
          required: true,
          errorMessage: ERROR.normal.noRePwd
        },
        {
          validateFunction: function(rule, value, data, callback) {
            if (value != data[pwdName]) {
              callback(ERROR.normal.rePwdErr);
            }
            return true;
          }
        }
      ]
    };
  }
  return rules;
}
const passwordMod = {
  ERROR,
  validPwd,
  getPwdRules
};
exports.passwordMod = passwordMod;
