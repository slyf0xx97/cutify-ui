// cutify-ui: parse a classic inline script from stdin without running it. argv[2] is the page line of its first line. MIT.
const vm = require("vm");
let s = "";
process.stdin.on("data", d => (s += d)).on("end", () => {
  try {
    new vm.Script(s, { filename: "page", lineOffset: +process.argv[2] });
  } catch (e) {
    const m = /page:(\d+)/.exec(e.stack || "");
    console.log((m ? m[1] : "?") + " " + e.message);
    process.exit(1);
  }
});
