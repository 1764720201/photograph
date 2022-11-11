"use strict";
function fieldsFactory(maps = [{
  title: "\u65B0\u589E\u7528\u6237",
  field: "new_user_count",
  stat: 0
}]) {
  let fieldsMap = [{
    title: "\u65E5\u671F",
    field: "start_time",
    tooltip: "",
    formatter: "-",
    stat: -1
  }];
  if (maps) {
    fieldsMap.push(...maps);
  }
  const values = [1, 2, 3, 4, 5, 6, 7, 14, 30];
  const fields = values.map((val) => {
    return {
      title: `${val}\u5929\u540E`,
      field: `d_${val}`,
      computed: `d_${val}/${maps[0].field}`,
      formatter: "%",
      tooltip: ""
    };
  });
  fieldsMap = fieldsMap.concat(fields);
  return fieldsMap;
}
exports.fieldsFactory = fieldsFactory;
