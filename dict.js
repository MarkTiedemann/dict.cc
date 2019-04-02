const https = require("https");
const { JSDOM } = require("jsdom");

let query = encodeURI(process.argv.slice(2).join(" "));
https.get("https://www.dict.cc/?s=" + query, res => {
  let buf = [];
  res.on("data", data => buf.push(data));
  res.on("end", () => {
    let body = Buffer.concat(buf).toString("utf-8");
    let dom = new JSDOM(body);
    let document = dom.window.document;
    let text = td =>
      Array.from(td.querySelectorAll("a"))
        .map(a => a.textContent)
        .join(" ");
    let trans = Array(20)
      .fill(0)
      .map((_, i) => ++i)
      .map(i => document.getElementById("tr" + i))
      .filter(tr => tr != null)
      .map(tr => {
        let tds = tr.querySelectorAll("td");
        let eng = text(tds.item(1));
        let ger = text(tds.item(2));
        return [eng, ger];
      });
    let len = Math.max(...trans.map(i => i[0].length));
    trans.forEach(([eng, ger]) => {
      console.log(eng.padEnd(len) + " | " + ger);
    });
  });
});
