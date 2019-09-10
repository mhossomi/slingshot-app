const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const https = require('https')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use((req, res) => res.sendStatus(200)))

