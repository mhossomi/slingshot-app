const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const http = require('http')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/complete', (req, res) => {
        console.log('Recording complete!')
        http.get(`${req.body.callUrl}/recordings/${req.body.recordingId}/mp3/mono`, res => {
            console.log('Recording post-process triggered!', res.statusCode)
        })
        res.sendStatus(200)
    })
    .use((req, res) => res.sendStatus(200)))