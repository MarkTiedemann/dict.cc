#!/usr/bin/env node
let https = require('https')
let env = process.env
let color = env.NO_COLOR ? false : true
let timeout = env.DICT_TIMEOUT ? parseInt(env.DICT_TIMEOUT) : 10000
let page_size = env.DICT_PAGE_SIZE ? parseInt(env.DICT_PAGE_SIZE) : 15
let exit = msg => {
  if (color) msg = msg.replace(/E(\w+)/, `\x1b[35m$1\x1b[0m`)
  let div = color ? '\x1b[31mERR!\x1b[0m' : 'ERR!'
  console.error(`dict ${div} ${msg}`)
  process.exit(1)
}
if (process.argv.length < 3) exit('ENOARGS no arguments given')
let query = encodeURI(process.argv.slice(2).join(' '))
let req = https.request({
  host: 'www.dict.cc',
  path: '/?s=' + query,
  timeout: timeout
}, res => {
  if (res.statusCode != 200) exit('EBADSTATUS ' + res.statusMessage)
  let buf = []
  res.on('error', err => exit(err.message))
  res.on('data', data => buf.push(data))
  res.on('end', () => {
    let body = Buffer.concat(buf).toString('utf-8')
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
  })
})
req.on('error', err => exit(err.message))
req.on('timeout', () => exit('ETIMEDOUT request timed out'))
req.end()
