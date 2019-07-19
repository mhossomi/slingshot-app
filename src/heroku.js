const { execSync } = require('child_process')

async function getPublicUrls() {
    try {
        console.log(process.env)
        const info = JSON.parse(execSync('heroku info --json'))
        console.log('Detected Heroku')
        return [
            { proto: 'https', public_url: info.app.web_url }
        ]
    } catch (e) {
        return undefined
    }
}

module.exports = {
    getPublicUrls
}