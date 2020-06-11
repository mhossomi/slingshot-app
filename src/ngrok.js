const fetch = require('node-fetch')

module.exports = {
    getPublicUrl: async function () {
        return fetch('http://localhost:4040/api/tunnels')
            .then(res => res.json())
            .then(res => {
                let tunnel = res.tunnels.find(tunnel => tunnel.proto === 'https')
                if (tunnel) {
                    console.log('Detected ngrok')
                    return tunnel.public_url
                }
            })
    }
}