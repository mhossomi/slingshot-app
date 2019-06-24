const fetch = require('node-fetch')

async function getTunnels() {
    try {
        const res = await fetch('http://localhost:4040/api/tunnels')
        console.log('Detected ngrok')
        const body = await res.json()
        return body.tunnels || []
    }
    catch (e) {
        return []
    }
}

module.exports = {
    getTunnels
}