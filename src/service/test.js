/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable indent */
// const async = require('async');
// const schedule = require('node-schedule');

// eslint-disable-next-line no-undef
// const nodeQueue = async.queue((obj, callback) => {
//     for (let index = 0; index < 20000; index++) {
//         if (index === 19999 || index === 10000 || index === 5000) {
//             console.log(index);
//         }
//     }
//     console.log('完結');
//     callback();
// });

// const data = { abc: '123', dd: '3' };
// const data1 = { abc: '1231', dd: '31' };
// nodeQueue.push({ data });
// console.log(data);
// nodeQueue.push({ data: data1 });
// console.log(data1);
// eslint-disable-next-line no-unused-vars
// schedule.scheduleJob('test1', '0/1 * * * * ?', (d, a) => {
//   console.log(`timingLogin1111:${new Date()}`);
//   const t = new Date().getTime();
//   console.log('hghs', data.abc);
//   console.log('tttttttttttt', t);
//   nodeQueue.push({ data, t });
// });
const cheerio = require('cheerio');
const superagent = require('superagent');
require('superagent-proxy')(superagent);

const p = {
    thisresource1: 711178634,
    thisresource2: 824572,
    thisresource3: 2828683978,
    consumption: 589,
    dist: 1005,
    speedfactor: 1,
    thisgalaxy: 4,
    thissystem: 58,
    thisplanet: 15,
    galaxy: 4,
    system: 58,
    planet: 16,
    thisplanettype: 3,
    planettype: 1,
    speedallsmin: 73500,
    speed: 10,
    // eslint-disable-next-line no-dupe-keys
    speedfactor: 1,
    usedfleet: 'LGbkBagcBwVjZwgmBwD6VwRjZQNvB30=',
    maxepedition: 4,
    curepedition: 2,
    fleet_group: 0,
    acs_target_mr: '0:0:0',
    trade_id: 0,
    floten3code: '3a00193e501d98160e2f9fc585f222b0',
    ship202: 1000,
    capacity202: 5000,
    consumption202: 20,
    speed202: 73500,
    mission: 15,
    resource1: '',
    resource2: '',
    resource3: '',
    expeditiontime: 1,
};

const h = {
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
    'Cache-Control': 'max-age=0',
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    Cookie: 'PHPSESSID=29ecfb7d3386ed2cb8baa8257d1cbffd; OGameCN=12164%2F%25%2F%C4%BE%D0%C7%C9%CF%D0%D0%2F%25%2Fbb99a5aa2a2d427ad93184fbd74b6884%2F%25%2F0',
    Host: 'u8.cicihappy.com',
    Origin: 'http://u8.cicihappy.com',
    Referer: 'http://u8.cicihappy.com/ogame/floten2.php',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
};


superagent
    .agent()
    .post('http://u8.cicihappy.com/ogame/floten3.php')
    .type('form')
    .send(p)
    .set(h)
    .end((err, res) => {
        console.log(res);
    });


// superagent
//     .agent()
//     .post('http://u8.cicihappy.com/ogame/fleet.php')
//     .type('form')
//     .set(h)
//     .end((err, res) => {
//         const $ = cheerio.load(res.text);
//         const f = $('input[name="floten1code"]').val();
//         const form = $('form');
//         const fg = $(form).serializeArray();
//         const fgobj = {};
//         fg.forEach((item) => {
//             fgobj[item.name] = item.value;
//         });
//         console.log(fgobj);
//     });
