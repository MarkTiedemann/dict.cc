#!/usr/bin/env deno --allow-net
(async function () {
  let query = encodeURI(Deno.args.slice(1).join(' '))
  let res = await fetch('https://www.dict.cc/?s=' + query);
  let body = await res.text()
  let trans = body
    .match(/<tr id='tr\d+'>(.*?)<\/tr>/g)
    .map(tr => tr.match(/<td.*?>(.*?)<\/td>/g))
    .map(tds => [tds[1], tds[2]])
    .map(tds => tds.map(td => td
      .match(/<a.*?>.*?<\/a>/g)
      .map(a =>
        /<a.*?>(.*?)<\/a>/g.exec(a
          .replace(/<b.*?>(.*?)<\/b>/g, '$1')
          .replace(/<abbr.*?>(.*?)<\/abbr>/g, '$1')
          .replace(/<kbd.*?>(.*?)<\/kbd>/g, '$1')
          .replace('&lt;', '<')
          .replace('&gt;', '>')
        )[1]
      )
      .join(' ')
    ))
  if (trans.length > 15) trans.splice(15)
  let len = Math.max(...trans.map(t => t[0].length))
  trans.forEach(t => console.log(t[0].padEnd(len) + ' | ' + t[1]))
})()
