require('dotenv').config()
const fetch = require('node-fetch')
const app = require('./src/app')
const meeting = require('./src/meeting')

app('Slingshot App', process.env.PORT || 8110, app => app

    .use('/play-recording/accounts/:accountId/calls/:callId/recordings/:recordingId', (req, res) => {
        const accountId = req.params.accountId
        const callId = req.params.callId
        const recordingId = req.params.recordingId
        const url = `${process.env.SLINGSHOT_URL}/api/v2/accounts/${accountId}/calls/${callId}/recordings/${recordingId}/media`

        console.log(`Replied with <PlayAudio> for:\n${url}`)
        res.send('<?xml version="1.0" ?>'
            + '<Response>'
            + `    <PlayAudio username="${process.env.SLINGSHOT_USERNAME}" password="${process.env.SLINGSHOT_PASSWORD}">`
            + `        ${url}`
            + '   </PlayAudio>'
            + '</Response>')
    })

    .use('/meeting', meeting)

    .use((req, res) => res.sendStatus(200)))

