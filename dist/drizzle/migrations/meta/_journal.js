var version = "7";
var dialect = "postgresql";
var entries = [
  {
    idx: 0,
    version: "7",
    when: 1744882906261,
    tag: "0000_married_the_hood",
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
