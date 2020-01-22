const slingshot = require('./src/slingshot')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/play-recording/accounts/:accountId/calls/:callId/recordings/:recordingId', (req, res) => {
        const accountId = req.params.accountId
        const callId = req.params.callId
        const recordingId = req.params.recordingId
        const url = `${process.env.CALL_API_URL}/api/v2/accounts/${accountId}/calls/${callId}/recordings/${recordingId}/media`

        console.log(`Replied with <PlayAudio> for:\n${url}`)
        res.send('<?xml version="1.0" ?>'
            + '<Response>'
            + `    <PlayAudio username="${process.env.CALL_API_USERNAME}" password="${process.env.CALL_API_PASSWORD}">`
            + `        ${url}`
            + '   </PlayAudio>'
            + '</Response>')
    })
    .use((req, res) => res.sendStatus(200)))

