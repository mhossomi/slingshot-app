const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const https = require('https')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/complete', (req, res) => {
        console.log('Recording complete!')

        https.get(
            `http://voice-media-service-mhossomi-worker.apps.lab1.ocp.bandwidth.com/accounts/9902319\
            /calls/${req.body.callId}/recordings/${req.body.recordingId}/mp3/mono`,
            res => console.log('Recording post-process triggered!', res.statusCode))
            
        res.send('<?xml version="1.0" ?>\
        <Response> \
            <SpeakSentence voice="susan"> \
                Thanks! \
            </SpeakSentence> \
        </Response>')
    })
    .use((req, res) => res.sendStatus(200)))