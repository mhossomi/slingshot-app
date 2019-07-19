const { execSync } = require('child_process')

async function getPublicUrls() {
    const remotes = execSync('git remote', { encoding: 'utf8' })
    if (remotes.includes('heroku')) {
        console.log('Detected Heroku')
        const info = JSON.parse(execSync('heroku apps:info --json'))
        const name = info.app.name
        return [
            { proto: 'http', public_url: `http://${name}.herokuapp.com` },
            { proto: 'https', public_url: `https://${name}.herokuapp.com` }
        ]
    }
}

module.exports = {
    getPublicUrls
}