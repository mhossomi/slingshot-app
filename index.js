const slingshot = require('./src/slingshot')
const bxml = require('./src/bxml')

slingshot('Slingshot App', process.env.PORT || 8110, app => app
    .use((req, res) => res.sendStatus(200)))