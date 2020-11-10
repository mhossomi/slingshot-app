const fs = require('fs')
const fetch = require('node-fetch')

process.env.SLINGSHOT_AUTH = 'Basic ' + Buffer
  .from(`${process.env.SLINGSHOT_USERNAME}:${process.env.SLINGSHOT_PASSWORD}`)
  .toString('base64')

if (process.env.APP_USERNAME) {
  process.env.BXML_AUTH = `username="${process.env.APP_USERNAME}" password="${process.env.APP_PASSWORD}"`
}

console.log('Slingshot username:', process.env.SLINGSHOT_USERNAME)
console.log('Application username:', process.env.APP_USERNAME)

function downloadAudio(url, name) {
  return fetch(url, {
    headers: {
      'Authorization': process.env.SLINGSHOT_AUTH
    }
  }).then(res => {
    if (res.status !== 200) {
      throw new Error(`Failed to download audio ${url}`)
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

function redirectCall(callUrl, redirectUrl) {
  let callId = callUrl.substr(callUrl.lastIndexOf('/') + 1)
  return fetch(callUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.SLINGSHOT_AUTH
      },
      body: JSON.stringify({ redirectUrl })
    })
    .then(() => console.log(`Redirected call ${callId} to ${redirectUrl}`))
    .catch(e => console.log(`Failed to redirect call ${callId}`, e))
}

module.exports = {
  downloadAudio,
  redirectCall
}