const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const config = require('./config.json')
const fs = require('fs')
const https = require('https')

const authorization = "Basic " + Buffer.from(config.CALL_API_USERNAME + ":" + config.CALL_API_PASSWORD).toString("base64")

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/play-recording/:accountId/:callId/:recordingId', (req, res) => {
        const accountId = req.params.accountId
        const callId = req.params.callId
        const recordingId = req.params.recordingId
        const url = `${config.CALL_API_URL}/api/v2/accounts/${accountId}/calls/${callId}/recordings/${recordingId}/media`

        res.send('<?xml version="1.0" ?>'
            + '<Response>'
            + `    <PlayAudio username="${config.CALL_API_USERNAME}" password="${config.CALL_API_PASSWORD}">`
            + `        ${url}`
            + '   </PlayAudio>'
            + '</Response>')
    })
    .use((req, res) => res.sendStatus(200)))

