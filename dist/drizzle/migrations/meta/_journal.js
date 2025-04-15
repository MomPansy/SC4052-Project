var version = "7";
var dialect = "postgresql";
var entries = [
  {
    idx: 0,
    version: "7",
    when: 1744643231388,
    tag: "0000_living_zarda",
    breakpoints: false
  },
  {
    idx: 1,
    version: "7",
    when: 1744644207689,
    tag: "0001_happy_black_queen",
    breakpoints: false
  }
];
var journal_default = {
  version,
  dialect,
  entries
};
export {
  journal_default as default,
  dialect,
  entries,
  version
};
