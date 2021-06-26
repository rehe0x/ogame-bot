/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const path = require('path');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const superagent = require('superagent');
require('superagent-proxy')(superagent);
const schedule = require('node-schedule');
const fs = require('fs');

const __user_config = 'config';

function wait(ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

const genRandom = (min, max) => Math.floor((Math.random() * ((max - min) + 1) || 0) + min);

const baseHeader = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
  'Cache-Control': 'max-age=0',
  Connection: 'keep-alive',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Upgrade-Insecure-Requests': 1,
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
};

const getConfig = () => {
  try {
    const j = fs.readFileSync(path.join(__user_config, '/config.json'));
    return JSON.parse(j);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getLoginInfo = () => {
  try {
    const j = fs.readFileSync(path.join(__user_config, '/data/user.json'));
    return JSON.parse(j);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const setConfig = (username, password) => {
  try {
    const ob = {};
    ob.username = username;
    ob.password = password;
    fs.writeFileSync(path.join(__user_config, '/config.json'), JSON.stringify(ob));
  } catch (err) {
    alert(err);
  }
};

const setBackTime = (t) => {
  try {
    fs.writeFileSync(path.join(__user_config, '/data/back_time.json'), JSON.stringify(t));
  } catch (err) {
    console.log(err);
  }
};

const getBackTime = () => {
  try {
    const j = fs.readFileSync(path.join(__user_config, '/data/back_time.json'));
    return JSON.parse(j);
  } catch (err) {
    console.log(err);
    return null;
  }
};

class Dao {
  constructor(u, cookie = null, proxyURL = null, proxyAuth = null) {
    this.url = `http://${u}.cicihappy.com`;
    this.proxyURL = proxyURL;
    this.proxyAuth = proxyAuth;
    this.agent = superagent.agent();
    this.baseHeader = baseHeader;
    if (cookie) {
      this.baseHeader.Cookie = cookie;
    }
  }

  referrersta(referrerAddress) {
    return this.agent
      .get('http://g.cicihappy.com/ogame/referrersta.php')
      .query({
        referrerAddress,
      })
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Referer: 'http://www.cicihappy.com/',
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  login(p) {
    return this.agent
      .post(`${this.url}/ogame/login.php`)
      .type('form')
      .responseType('blob')
      .send(p)
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Referer: `${this.url}/`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  frames() {
    const userInfo = getLoginInfo();
    return this.agent
      .get(`${this.url}/ogame/frames.php`)
      .responseType('blob')
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Referer: 'http://www.cicihappy.com/',
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  overview(s = false) {
    const userInfo = getLoginInfo();
    const refererArry = ['overview.php', 'frames.php', 'fleet.php', 'floten1.php'];
    const re = s ? 'frames.php' : refererArry[genRandom(0, refererArry.length - 1)];
    return this.agent
      .get(`${this.url}/ogame/overview.php`)
      .responseType('blob')
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Referer: `${this.url}/ogame/${re}`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  fleet(p = '') {
    const userInfo = getLoginInfo();
    return this.agent
      .get(`${this.url}/ogame/fleet.php${p}`)
      .type('form')
      .responseType('blob')
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Referer: `${this.url}/ogame/overview.php`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  floten1(p) {
    const userInfo = getLoginInfo();
    return this.agent
      .post(`${this.url}/ogame/floten1.php`)
      .type('form')
      .responseType('blob')
      .send(p)
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Origin: this.url,
        Referer: `${this.url}/ogame/fleet.php`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  floten2(p) {
    const userInfo = getLoginInfo();
    return this.agent
      .post(`${this.url}/ogame/floten2.php`)
      .type('form')
      .responseType('blob')
      .send(p)
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Origin: this.url,
        Referer: `${this.url}/ogame/floten1.php`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }

  floten3(p) {
    const userInfo = getLoginInfo();
    return this.agent
      .post(`${this.url}/ogame/floten3.php`)
      .type('form')
      .responseType('blob')
      .send(p)
      .proxy(this.proxyURL)
      .set({
        ...this.baseHeader,
        Cookie: userInfo.cookie,
        Origin: this.url,
        Referer: `${this.url}/ogame/floten2.php`,
        'Proxy-Authorization': this.proxyAuth,
      })
      .retry(3)
      .timeout({
        response: 50000,
        deadline: 50000,
      })
      .disableTLSCerts();
  }
}

class Service {
  constructor() {
    const c = getConfig();
    this.dao = new Dao(c.universe);
  }

  async login() {
    const config = getConfig();
    await this.dao.referrersta(`http://${config.universe}.cicihappy.com/`);
    await wait(genRandom(3000, 5000));
    const p = {
      v: 2,
      username: config.username,
      password: config.password,
      universe: `${config.universe}.cicihappy.com`,
    };
    const res = await this.dao.login(p);
    const text = iconv.decode(res.body, 'gbk');
    const u = {
      cookie: res.request.cookies,
    };
    fs.writeFileSync(path.join(__user_config, '/data/user.json'), JSON.stringify(u));
    await wait(1500);
    const r = await this.dao.overview();
    return r;
  }

  async getPlanetInfo() {
    let res = await this.dao.overview();
    let text = iconv.decode(res.body, 'gbk');
    if (text.indexOf('你的当前登录验证已失效') > -1
        || text.indexOf('请重新尝试点击！') > -1
        || text.indexOf('并重启浏览器后再次登录尝试') > -1
        || text.indexOf('长时间没有操作，登录已失效，请重新登录!') > -1) {
      await wait(genRandom(3000, 6000));
      res = await this.login();
      text = iconv.decode(res.body, 'gbk');
    }
    const $ = cheerio.load(text);
    const planet = [];
    // eslint-disable-next-line func-names
    $('.header center td select option').each(function (i, elem) {
      planet.push({
        name: $(this).text().match(/(\S*)\s\[/)[1],
        p: $(this).val(),
        xyz: $(this).text().match(/\[(\S*)\]/)[1],
      });
    });
    return planet;
  }

  async getFleetForm() {
    const res = await this.dao.fleet();
    const text = iconv.decode(res.body, 'gbk');
    const $ = cheerio.load(text);
    const fgbArr = [];
    const fgb = $('#fleetgroupbox tr th a').eq(0).attr('href');
    fgb.split(';').forEach((item) => {
      const reg = item ? item.match(/\(([\s\S]*)\)/)[1] : '';
      const d = reg ? reg.replace(/\s*/g, '').split(',') : '';
      if (d) {
        fgbArr.push({
          ship: `ship${d[0]}`,
          num: Number(d[1]),
        });
      }
    });
    const backTime = [];
    const fle = $('#fleetdelaybox').next().nextAll();
    fle.each(function (i, elem) {
      if ($(this).find('th').eq(1).text() === '探险') {
        const f = $(this).find('th').eq(7).text();
        backTime.push(`20${f}`);
      }
    });

    const formData = $('form');
    const formArr = $(formData).serializeArray();
    const formObj = {};
    formArr.forEach((item) => {
      formObj[item.name] = Number.isNaN(Number(item.value)) ? item.value : Number(item.value);
    });
    return { formObj, fgbArr, backTime };
  }

  // eslint-disable-next-line no-dupe-class-members
  async getFloten1Form(p) {
    const res = await this.dao.floten1(p);
    const text = iconv.decode(res.body, 'gbk');
    const $ = cheerio.load(text);
    const formData = $('form');
    const formArr = $(formData).serializeArray();
    const formObj = {};
    formArr.forEach((item) => {
      formObj[item.name] = Number.isNaN(Number(item.value)) ? item.value : Number(item.value);
    });
    return formObj;
  }

  async getFloten2Form(p) {
    const res = await this.dao.floten2(p);
    const text = iconv.decode(res.body, 'gbk');
    const $ = cheerio.load(text);
    const formData = $('form');
    const formArr = $(formData).serializeArray();
    const formObj = {};
    formArr.forEach((item) => {
      formObj[item.name] = Number.isNaN(Number(item.value)) ? item.value : Number(item.value);
    });
    return formObj;
  }

  async getFloten3Form(p) {
    const res = await this.dao.floten3(p);
    const text = iconv.decode(res.body, 'gbk');
    const $ = cheerio.load(text);
    const formData = $('form');
    const formArr = $(formData).serializeArray();
    const formObj = {};
    formArr.forEach((item) => {
      formObj[item.name] = Number.isNaN(Number(item.value)) ? item.value : Number(item.value);
    });
    return formObj;
  }

  // eslint-disable-next-line class-methods-use-this
  txJob() {
    const job = schedule.scheduledJobs.txJob;
    if (job) {
      console.log('已创建txJob');
      return;
    }
    schedule.scheduleJob('txJob', '0 */3 * * * ?', () => {
      console.log(`txJob:${new Date()}`);
      const btDate = getBackTime();
      const btTime = [];
      btDate.forEach((item) => {
        btTime.push(new Date(item).getTime());
      });
      btTime.sort((a, b) => b - a);
      if (new Date().getTime() > (btTime[0] + (1000 * 60 * genRandom(1, 5)))) {
        console.log('tx 结束');
        this.tx();
      } else {
        console.log('tx 等待', `${new Date(btTime[0])}`);
      }
    });
  }

  async tx() {
    const planet = await this.getPlanetInfo();
    console.log(planet);
    if (planet.length === 0) {
      return;
    }
    await wait(genRandom(2000, 5000));

    const arr = await this.getFleetForm();
    await wait(genRandom(2000, 5000));
    const from = arr.formObj;

    if (from.maxepedition === from.curepedition) {
      console.log('max', from.curepedition);
      setBackTime(arr.backTime);
      this.txJob();
      return;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const item of arr.fgbArr) {
      if (from[`max${item.ship}`] < item.num) {
        console.log(`max${item.ship}`, item.num);
        return;
      }
      from[`${item.ship}`] = item.num;
    }
    console.log(from);

    const from1 = await this.getFloten1Form(from);
    console.log(from1);
    await wait(genRandom(2000, 5000));
    from1.planet = 16;

    const from2 = await this.getFloten2Form(from1);
    console.log(from2);
    await wait(genRandom(2000, 5000));

    const from3 = await this.getFloten3Form(from2);
    console.log(from3);

    await wait(genRandom(2000, 10000));
    await this.tx();
  }
}

(async () => {
  const se = new Service();
  se.tx();
})();
