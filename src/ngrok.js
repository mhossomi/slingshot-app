const fetch = require('node-fetch')

async function getPublicUrls() {
    try {
        const res = await fetch('http://localhost:4040/api/tunnels')
        console.log('Detected ngrok')
        const body = await res.json()
        return body.tunnels || []
    }
    catch (e) {
        return undefined
    }
}

module.exports = {
    getPublicUrls
}