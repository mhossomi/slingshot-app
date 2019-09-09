const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const http = require('http')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/complete', (req, res) => {
        console.log('Recording complete!', JSON.stringify(req.body))
    })
    .use((req, res) => res.sendStatus(200)))