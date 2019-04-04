#!/usr/bin/env deno --allow-net --allow-env
(async function () {
  let env = Deno.env();
  let color = env.NO_COLOR ? false : true
  let timeout = env.DICT_TIMEOUT ? parseInt(env.DICT_TIMEOUT) : 10000
  let page_size = env.DICT_PAGE_SIZE ? parseInt(env.DICT_PAGE_SIZE) : 15
  let exit = msg => {
    if (color) msg = msg.replace(/E(\w+)/, `\x1b[35m$1\x1b[0m`)
    let div = color ? '\x1b[31mERR!\x1b[0m' : 'ERR!'
    console.error(`dict ${div} ${msg}`)
    Deno.exit(1)
  }
  if (Deno.args.length < 2) exit('ENOARGS no arguments given')
  let query = encodeURI(Deno.args.slice(1).join(' '))
  let timer = setTimeout(() => exit('ETIMEDOUT request timed out'), timeout);
  let res = await fetch('https://www.dict.cc/?s=' + query)
  clearTimeout(timer)
  if (res.status != 200) exit('EBADSTATUS ' + res.statusText)
  let body = await res.text()
  let trs = body.match(/<tr id='tr\d+'>(.*?)<\/tr>/g)
  if (trs == null) exit('ENOTRANS no translation available')
  let trans = trs
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
  if (trans.length > page_size) trans.splice(page_size)
  let len = Math.max(...trans.map(t => t[0].length))
  let div = color ? '\x1b[35m|\x1b[0m' : '|'
  trans.forEach(t => console.log(`${t[0].padEnd(len)} ${div} ${t[1]}`))
})()
