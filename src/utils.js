const fs = require('fs')
const fetch = require('node-fetch')

const AUTHORIZATION = 'Basic ' + Buffer.from(`${process.env.CALL_API_USERNAME}:${process.env.CALL_API_PASSWORD}`).toString('base64')

function ResponseError(res, message) {
  let e = new Error(message)
  e.res = res
  return e
}

function downloadAudio(url, name) {
  return fetch(url, { headers: { 'Authorization': AUTHORIZATION } }).then(res => {
    if (res.status !== 200) {
      throw ResponseError(res, `Failed to download audio ${url}`)
    }

    console.log(`Downloading audio ${name}`)
    const file = fs.createWriteStream(`audio/${name}`);
    return new Promise((resolve, reject) => {
      res.body.pipe(file);
      res.body.on("error", (e) => {
        reject(e);
      });
      file.on("finish", function () {
        resolve();
      });
    });
  })
}

module.exports = {
  downloadAudio,
  ResponseError
}