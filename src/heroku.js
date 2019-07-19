const { execSync } = require('child_process')

async function getPublicUrls() {
    if (process.env.HEROKU_APP_NAME) {
        console.log('Detected Heroku')
        return [
            { proto: 'https', public_url: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` },
            { proto: 'http', public_url: `http://${process.env.HEROKU_APP_NAME}.herokuapp.com` }
        ]
    }

}

module.exports = {
    getPublicUrls
}