"use strict";
const components_downloadExcel_download = require("./download.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "downloadExcel",
  props: {
    type: {
      type: String,
      default: "xls"
    },
    data: {
      type: Array,
      required: false,
      default: null
    },
    fields: {
      type: Object,
      default: () => null
    },
    exportFields: {
      type: Object,
      default: () => null
    },
    defaultValue: {
      type: String,
      required: false,
      default: ""
    },
    header: {
      default: null
    },
    footer: {
      default: null
    },
    name: {
      type: String,
      default: "data.xls"
    },
    fetch: {
      type: Function
    },
    meta: {
      type: Array,
      default: () => []
    },
    worksheet: {
      type: String,
      default: "Sheet1"
    },
    beforeGenerate: {
      type: Function
    },
    beforeFinish: {
      type: Function
    },
    escapeCsv: {
      type: Boolean,
      default: true
    },
    stringifyLongNum: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    idName() {
      var now = new Date().getTime();
      return "export_" + now;
    },
    downloadFields() {
      if (this.fields)
        return this.fields;
      if (this.exportFields)
        return this.exportFields;
    }
  },
  methods: {
    async generate() {
      if (typeof this.beforeGenerate === "function") {
        await this.beforeGenerate();
      }
      let data = this.data;
      if (typeof this.fetch === "function" || !data)
        data = await this.fetch();
      if (!data || !data.length) {
        return;
      }
      let json = this.getProcessedJson(data, this.downloadFields);
      if (this.type === "html") {
        return this.export(
          this.jsonToXLS(json),
          this.name.replace(".xls", ".html"),
          "text/html"
        );
      } else if (this.type === "csv") {
        return this.export(
          this.jsonToCSV(json),
          this.name.replace(".xls", ".csv"),
          "application/csv"
        );
      }
      return this.export(
        this.jsonToXLS(json),
        this.name,
        "application/vnd.ms-excel"
      );
    },
    export: async function(data, filename, mime) {
      let blob = this.base64ToBlob(data, mime);
      if (typeof this.beforeFinish === "function")
        await this.beforeFinish();
      components_downloadExcel_download.download(blob, filename, mime);
    },
    jsonToXLS(data) {
      let xlsTemp = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta name=ProgId content=Excel.Sheet> <meta name=Generator content="Microsoft Excel 11"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>br {mso-data-placement: same-cell;}</style></head><body><table>${table}</table></body></html>';
      let xlsData = "<thead>";
      const colspan = Object.keys(data[0]).length;
      let _self = this;
      const header = this.header || this.$attrs.title;
      if (header) {
        xlsData += this.parseExtraData(
          header,
          '<tr><th colspan="' + colspan + '">${data}</th></tr>'
        );
      }
      xlsData += "<tr>";
      for (let key in data[0]) {
        xlsData += "<th>" + key + "</th>";
      }
      xlsData += "</tr>";
      xlsData += "</thead>";
      xlsData += "<tbody>";
      data.map(function(item, index) {
        xlsData += "<tr>";
        for (let key in item) {
          xlsData += "<td>" + _self.preprocessLongNum(
            _self.valueReformattedForMultilines(item[key])
          ) + "</td>";
        }
        xlsData += "</tr>";
      });
      xlsData += "</tbody>";
      if (this.footer != null) {
        xlsData += "<tfoot>";
        xlsData += this.parseExtraData(
          this.footer,
          '<tr><td colspan="' + colspan + '">${data}</td></tr>'
        );
        xlsData += "</tfoot>";
      }
      return xlsTemp.replace("${table}", xlsData).replace("${worksheet}", this.worksheet);
    },
    jsonToCSV(data) {
      let _self = this;
      var csvData = [];
      const header = this.header || this.$attrs.title;
      if (header) {
        csvData.push(this.parseExtraData(header, "${data}\r\n"));
      }
      for (let key in data[0]) {
        csvData.push(key);
        csvData.push(",");
      }
      csvData.pop();
      csvData.push("\r\n");
      data.map(function(item) {
        for (let key in item) {
          let escapedCSV = item[key] + "";
          if (_self.escapeCsv) {
            escapedCSV = '="' + escapedCSV + '"';
            if (escapedCSV.match(/[,"\n]/)) {
              escapedCSV = '"' + escapedCSV.replace(/\"/g, '""') + '"';
            }
          }
          csvData.push(escapedCSV);
          csvData.push(",");
        }
        csvData.pop();
        csvData.push("\r\n");
      });
      if (this.footer != null) {
        csvData.push(this.parseExtraData(this.footer, "${data}\r\n"));
      }
      return csvData.join("");
    },
    getProcessedJson(data, header) {
      let keys = this.getKeys(data, header);
      let newData = [];
      let _self = this;
      data.map(function(item, index) {
        let newItem = {};
        for (let label in keys) {
          let property = keys[label];
          newItem[label] = _self.getValue(property, item);
        }
        newData.push(newItem);
      });
      return newData;
    },
    getKeys(data, header) {
      if (header) {
        return header;
      }
      let keys = {};
      for (let key in data[0]) {
        keys[key] = key;
      }
      return keys;
    },
    parseExtraData(extraData, format) {
      let parseData = "";
      if (Array.isArray(extraData)) {
        for (var i = 0; i < extraData.length; i++) {
          if (extraData[i])
            parseData += format.replace("${data}", extraData[i]);
        }
      } else {
        parseData += format.replace("${data}", extraData);
      }
      return parseData;
    },
    getValue(key, item) {
      const field = typeof key !== "object" ? key : key.field;
      let indexes = typeof field !== "string" ? [] : field.split(".");
      let value = this.defaultValue;
      if (!field)
        value = item;
      else if (indexes.length > 1)
        value = this.getValueFromNestedItem(item, indexes);
      else
        value = this.parseValue(item[field]);
      if (key.hasOwnProperty("callback"))
        value = this.getValueFromCallback(value, key.callback);
      return value;
    },
    valueReformattedForMultilines(value) {
      if (typeof value == "string")
        return value.replace(/\n/gi, "<br/>");
      else
        return value;
    },
    preprocessLongNum(value) {
      if (this.stringifyLongNum) {
        if (String(value).startsWith("0x")) {
          return value;
        }
        if (!isNaN(value) && value != "") {
          if (value > 99999999999 || value < 1e-13) {
            return '="' + value + '"';
          }
        }
      }
      return value;
    },
    getValueFromNestedItem(item, indexes) {
      let nestedItem = item;
      for (let index of indexes) {
        if (nestedItem)
          nestedItem = nestedItem[index];
      }
      return this.parseValue(nestedItem);
    },
    getValueFromCallback(item, callback) {
      if (typeof callback !== "function")
        return this.defaultValue;
      const value = callback(item);
      return this.parseValue(value);
    },
    parseValue(value) {
      return value || value === 0 || typeof value === "boolean" ? value : this.defaultValue;
    },
    base64ToBlob(data, mime) {
      let base64 = window.btoa(window.unescape(encodeURIComponent(data)));
      let bstr = atob(base64);
      let n = bstr.length;
      let u8arr = new Uint8ClampedArray(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.name),
    b: $options.idName,
    c: common_vendor.o((...args) => $options.generate && $options.generate(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/yzc/Documents/HBuilderProjects/uni-admin \u57FA\u7840\u6846\u67B6/components/download-excel/download-excel.vue"]]);
wx.createComponent(Component);
