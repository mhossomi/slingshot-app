const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')
const fs = require('fs')
const https = require('https')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use('/play-recording/:accountId/:callId/:recordingId', (req, res) => {
        const accountId = req.params.accountId
        const callId = req.params.callId
        const recordingId = req.params.recordingId
        const mediaUrl = `https://censer:fJ2EENf68HV97CC@mhossomi.lab.voice.bandwidth.com/api/v1/accounts/${accountId}/calls/${callId}/recordings/${recordingId}/media`

        console.log('Downloading:', mediaUrl)
        const file = fs.createWriteStream('./audio/recording');
        https.get(mediaUrl, () => {
            response.pipe(file);
            file.on('finish', () => file.close(cb));
        });
    })
    .use((req, res) => res.sendStatus(200)))

